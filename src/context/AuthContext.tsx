import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { authService, type SignUpData } from '@/src/services/authService';
import { profileService } from '@/src/services/profileService';
import type { Profile, UpdateTables, UserRole } from '@/src/types/database';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<Profile>;
  signUp: (data: SignUpData) => Promise<Profile>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  updateProfile: (updates: UpdateTables<'profiles'>) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfileForUser = useCallback(async (currentUser: User): Promise<Profile | null> => {
    try {
      let currentProfile = await authService.getProfile(currentUser.id);

      if (!currentProfile) {
        // Hydrate from user metadata if table record is pending
        const meta = currentUser.user_metadata || {};
        const role: UserRole =
          meta.role === 'admin' ? 'admin' : meta.role === 'buyer' ? 'buyer' : 'generator';

        const synthesized: Profile = {
          id: currentUser.id,
          name: meta.name || meta.full_name || currentUser.email?.split('@')[0] || 'Industrial Entity',
          email: currentUser.email || null,
          organization: meta.organization || meta.company || 'Facility Node',
          role,
          location: meta.location || 'Regional Industrial Hub',
          created_at: currentUser.created_at || new Date().toISOString(),
        };

        if (isSupabaseConfigured && supabase) {
          try {
            const { data: upserted } = await supabase
              .from('profiles')
              .upsert(synthesized)
              .select('*')
              .single();
            currentProfile = upserted || synthesized;
          } catch {
            currentProfile = synthesized;
          }
        } else {
          currentProfile = synthesized;
        }
      }

      setProfile(currentProfile);
      return currentProfile;
    } catch (err) {
      console.warn('Error hydrating profile:', err);
      return null;
    }
  }, []);

  // Initialize session and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    async function initializeAuth() {
      try {
        const demoSession = authService.getDemoSession();
        if (demoSession && isMounted) {
          setUser(demoSession.user);
          setProfile(demoSession.profile);
          setLoading(false);
          return;
        }

        if (!isSupabaseConfigured || !supabase) {
          if (isMounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session?.user && isMounted) {
          setUser(data.session.user);
          await fetchProfileForUser(data.session.user);
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Session initialization notice:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfileForUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileForUser]);

  const signIn = async (email: string, password: string): Promise<Profile> => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      setUser(result.user);
      setProfile(result.profile);
      return result.profile;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<Profile> => {
    setLoading(true);
    try {
      const result = await authService.signUp(data);
      if (result.user) {
        setUser(result.user);
      }
      if (result.profile) {
        setProfile(result.profile);
        return result.profile;
      }
      throw new Error('User account created, awaiting profile synchronization.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await authService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    await authService.updatePassword(newPassword);
  };

  const refreshProfile = async (): Promise<Profile | null> => {
    if (!user) return null;
    return await fetchProfileForUser(user);
  };

  const updateProfile = async (updates: UpdateTables<'profiles'>): Promise<Profile> => {
    if (!user) throw new Error('No authenticated user session.');
    const updated = await profileService.updateProfile(user.id, updates);
    setProfile(updated);
    return updated;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
