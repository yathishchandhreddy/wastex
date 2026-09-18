/**
 * WasteX AI - Real Supabase Authentication Service
 * Industrial-grade authentication, role-based profiles, and session management.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { Profile, UserRole } from '@/src/types/database';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  organization: string;
  role: 'generator' | 'buyer'; // Strictly generator or buyer for public signup
  location?: string;
}

export const DEMO_ACCOUNTS = {
  generator: {
    email: 'generator@wastex.ai',
    password: 'demo1234',
    name: 'Rajesh Sharma',
    organization: 'Gujarat AgroChem Refinery Ltd.',
    role: 'generator' as const,
    location: 'Dahej PCPIR, Gujarat',
  },
  buyer: {
    email: 'buyer@wastex.ai',
    password: 'demo1234',
    name: 'Vikramaditya Mehta',
    organization: 'EcoBind Circular Materials Corp.',
    role: 'buyer' as const,
    location: 'Pune Industrial Corridor, Maharashtra',
  },
  admin: {
    email: 'admin@wastex.ai',
    password: 'demo1234',
    name: 'WasteX Operations Lead',
    organization: 'WasteX Platform Clearinghouse',
    role: 'admin' as const,
    location: 'National Industrial Clearinghouse Hub',
  },
};

export const authService = {
  /**
   * Register a new industrial facility or buyer account
   */
  async signUp(params: SignUpData): Promise<{ user: User | null; session: Session | null; profile: Profile | null }> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    // Security check: strictly deny public admin registration
    if (params.role !== 'generator' && params.role !== 'buyer') {
      throw new Error('Public registration only permits Generator and Buyer roles.');
    }

    if (!params.email || !params.password) {
      throw new Error('Email and password are required.');
    }

    if (params.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: {
          name: params.name.trim(),
          organization: params.organization.trim(),
          role: params.role,
          location: params.location?.trim() || 'Regional Industrial Hub',
        },
      },
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error('Failed to create authentication user.');
    }

    // Provision corresponding profile record in public.profiles table
    const profilePayload: Profile = {
      id: data.user.id,
      name: params.name.trim(),
      email: data.user.email || params.email.trim(),
      organization: params.organization.trim(),
      role: params.role,
      location: params.location?.trim() || null,
      created_at: new Date().toISOString(),
    };

    try {
      const { data: insertedProfile, error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload)
        .select('*')
        .single();

      if (profileError) {
        console.warn('Profile direct insert note (may be handled by DB trigger):', profileError.message);
      }

      return {
        user: data.user,
        session: data.session,
        profile: insertedProfile || profilePayload,
      };
    } catch {
      return {
        user: data.user,
        session: data.session,
        profile: profilePayload,
      };
    }
  },

  /**
   * Real Supabase Sign In with Email & Password (with Demo fallback)
   */
  async signIn(email: string, password: string): Promise<{ user: User; session: Session; profile: Profile }> {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if logging in with pre-configured Demo Credentials
    const matchedDemoKey = (Object.keys(DEMO_ACCOUNTS) as (keyof typeof DEMO_ACCOUNTS)[]).find(
      (k) => DEMO_ACCOUNTS[k].email.toLowerCase() === cleanEmail
    );

    const isDemoPassword =
      cleanPassword.toLowerCase() === 'demo1234' ||
      cleanPassword.toLowerCase() === 'demo' ||
      cleanPassword === 'Demo1234!';

    if (matchedDemoKey && isDemoPassword) {
      const demoConfig = DEMO_ACCOUNTS[matchedDemoKey];

      // Try real Supabase auth first if project credentials exist
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: demoConfig.email,
            password: cleanPassword,
          });

          if (!error && data?.user && data?.session) {
            let profile = await this.getProfile(data.user.id);
            if (!profile) {
              profile = {
                id: data.user.id,
                name: demoConfig.name,
                email: demoConfig.email,
                organization: demoConfig.organization,
                role: demoConfig.role,
                location: demoConfig.location,
                created_at: new Date().toISOString(),
              };
              await supabase.from('profiles').upsert(profile).select('*').maybeSingle();
            }
            return { user: data.user, session: data.session, profile };
          }
        } catch {
          // Proceed to instant local demo session below
        }
      }

      // Standalone instant demo session for frictionless testing
      const demoUser: User = {
        id: `demo-${matchedDemoKey}-user-id`,
        app_metadata: { provider: 'demo' },
        user_metadata: {
          name: demoConfig.name,
          organization: demoConfig.organization,
          role: demoConfig.role,
          location: demoConfig.location,
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: demoConfig.email,
        phone: '',
        role: 'authenticated',
        updated_at: new Date().toISOString(),
      };

      const demoSession: Session = {
        access_token: `demo-token-${matchedDemoKey}`,
        token_type: 'bearer',
        expires_in: 86400,
        refresh_token: `demo-refresh-${matchedDemoKey}`,
        user: demoUser,
      };

      const demoProfile: Profile = {
        id: demoUser.id,
        name: demoConfig.name,
        email: demoConfig.email,
        organization: demoConfig.organization,
        role: demoConfig.role,
        location: demoConfig.location,
        created_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(
          'wastex_demo_session',
          JSON.stringify({ user: demoUser, session: demoSession, profile: demoProfile })
        );
      } catch {
        // Storage notice ignored
      }

      return {
        user: demoUser,
        session: demoSession,
        profile: demoProfile,
      };
    }

    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;

    if (!data.user || !data.session) {
      throw new Error('Authentication succeeded but session could not be established.');
    }

    // Fetch user profile from profiles table
    let profile = await this.getProfile(data.user.id);

    if (!profile) {
      // Self-heal: If profile row is not yet created, create from metadata
      const meta = data.user.user_metadata || {};
      const fallbackRole: UserRole =
        meta.role === 'admin' ? 'admin' : meta.role === 'buyer' ? 'buyer' : 'generator';

      const fallbackProfile: Profile = {
        id: data.user.id,
        name: meta.name || meta.full_name || email.split('@')[0],
        email: data.user.email || email,
        organization: meta.organization || meta.company || 'Industrial Facility',
        role: fallbackRole,
        location: meta.location || 'Regional Industrial Hub',
        created_at: new Date().toISOString(),
      };

      try {
        const { data: upserted } = await supabase
          .from('profiles')
          .upsert(fallbackProfile)
          .select('*')
          .single();
        profile = upserted || fallbackProfile;
      } catch {
        profile = fallbackProfile;
      }
    }

    return {
      user: data.user,
      session: data.session,
      profile,
    };
  },

  /**
   * Get cached demo session if available
   */
  getDemoSession(): { user: User; session: Session; profile: Profile } | null {
    try {
      const stored = localStorage.getItem('wastex_demo_session');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Silently continue
    }
    return null;
  },

  /**
   * Real Supabase sign out & clear demo sessions
   */
  async signOut(): Promise<void> {
    try {
      localStorage.removeItem('wastex_demo_session');
    } catch {
      // Silently continue
    }
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Supabase sign out notice:', error.message);
    } catch (err) {
      console.warn('Signout exception:', err);
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  },

  /**
   * Fetch profile by user ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile:', error.message);
      return null;
    }

    return data;
  },

  /**
   * Request password reset email
   */
  async resetPassword(email: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
  },

  /**
   * Update authenticated user password
   */
  async updatePassword(newPassword: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured.');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },
};
