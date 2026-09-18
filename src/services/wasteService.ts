/**
 * WasteX AI - Real Supabase Waste Service Module
 * Handles industrial waste stream listings, retrieval, and updates in public.waste_listings.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { WasteListingRow, InsertTables, UpdateTables } from '@/src/types/database';

export const wasteService = {
  /**
   * Create a new industrial waste listing
   */
  async createWasteListing(listing: InsertTables<'waste_listings'>): Promise<WasteListingRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }

    const { data, error } = await supabase
      .from('waste_listings')
      .insert(listing)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create waste listing record.');
    return data;
  },

  /**
   * Fetch waste listings owned by the specified generator
   */
  async getMyWasteListings(generatorId: string): Promise<WasteListingRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('waste_listings')
      .select('*')
      .eq('generator_id', generatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching generator waste listings:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Fetch a single waste listing by ID
   */
  async getWasteListing(id: string): Promise<WasteListingRow | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('waste_listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching waste listing:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Update an existing waste listing
   */
  async updateWasteListing(id: string, updates: UpdateTables<'waste_listings'>): Promise<WasteListingRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }

    const { data, error } = await supabase
      .from('waste_listings')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update waste listing record.');
    return data;
  },

  /**
   * Delete a waste listing
   */
  async deleteWasteListing(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }

    const { error } = await supabase
      .from('waste_listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Fetch all active marketplace listings (for buyers & exchange view)
   */
  async getActiveMarketplaceListings(): Promise<WasteListingRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('waste_listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching active marketplace listings:', error.message);
      return [];
    }
    return data || [];
  },
};
