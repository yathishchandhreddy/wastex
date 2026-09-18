/**
 * WasteX AI - Real Supabase Matching Service Module
 * Handles bilateral matching records in public.matches.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { MatchRow, BuyerRequirementRow, InsertTables } from '@/src/types/database';

export const matchingService = {
  /**
   * Fetch buyer requirements
   */
  async getRequirements(): Promise<BuyerRequirementRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from('buyer_requirements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Requirements fetch error:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Get matches for a generator's waste listing
   */
  async getMatchesForListing(listingId: string): Promise<MatchRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('waste_listing_id', listingId)
      .order('match_score', { ascending: false });

    if (error) {
      console.warn('Matches fetch error:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Get matches for a buyer's requirement
   */
  async getMatchesForRequirement(requirementId: string): Promise<MatchRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('buyer_requirement_id', requirementId)
      .order('match_score', { ascending: false });

    if (error) {
      console.warn('Matches fetch error:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Save a match record
   */
  async createMatch(match: InsertTables<'matches'>): Promise<MatchRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase backend not connected.');
    }
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create match record.');
    return data;
  },
};
