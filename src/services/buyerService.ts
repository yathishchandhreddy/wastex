/**
 * WasteX AI - Real Supabase Buyer Service
 * Handles secondary feedstock procurement requirements in public.buyer_requirements.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { BuyerRequirementRow, InsertTables, UpdateTables } from '@/src/types/database';

export const buyerService = {
  /**
   * Create a new procurement requirement
   */
  async createBuyerRequirement(requirement: InsertTables<'buyer_requirements'>): Promise<BuyerRequirementRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }

    const { data, error } = await supabase
      .from('buyer_requirements')
      .insert(requirement)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create buyer requirement record.');
    return data;
  },

  /**
   * Fetch requirements created by this buyer
   */
  async getMyBuyerRequirements(buyerId: string): Promise<BuyerRequirementRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('buyer_requirements')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching buyer requirements:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Update an existing buyer requirement
   */
  async updateBuyerRequirement(id: string, updates: UpdateTables<'buyer_requirements'>): Promise<BuyerRequirementRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }

    const { data, error } = await supabase
      .from('buyer_requirements')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update buyer requirement record.');
    return data;
  },

  /**
   * Delete a buyer requirement
   */
  async deleteBuyerRequirement(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }

    const { error } = await supabase
      .from('buyer_requirements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Fetch active marketplace requirements (for generator matching and demands)
   */
  async getActiveMarketplaceRequirements(): Promise<BuyerRequirementRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('buyer_requirements')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching active buyer requirements:', error.message);
      return [];
    }
    return data || [];
  },
};
