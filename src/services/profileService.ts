/**
 * WasteX AI - Profile Service
 * Operations on the Supabase public.profiles table
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { Profile, UpdateTables } from '@/src/types/database';

export const profileService = {
  /**
   * Get profile by ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Profile fetch error:', error.message);
      return null;
    }

    return data;
  },

  /**
   * Update profile fields (name, organization, location, etc.)
   */
  async updateProfile(userId: string, updates: UpdateTables<'profiles'>): Promise<Profile> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured.');
    }

    // Do NOT allow updating the primary key id
    const { id, created_at, ...cleanUpdates } = updates;

    const { data, error } = await supabase
      .from('profiles')
      .update(cleanUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update profile record.');

    return data;
  },
};
