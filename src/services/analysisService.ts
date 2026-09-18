/**
 * WasteX AI - Real Supabase Analysis Service Module
 * Handles persistence and retrieval of waste composition analyses in public.waste_analysis.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { WasteAnalysisRow, InsertTables } from '@/src/types/database';

export const analysisService = {
  /**
   * Retrieve analysis results by waste listing ID
   */
  async getAnalysisByListingId(listingId: string): Promise<WasteAnalysisRow | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }
    const { data, error } = await supabase
      .from('waste_analysis')
      .select('*')
      .eq('waste_listing_id', listingId)
      .maybeSingle();

    if (error) {
      console.warn('Analysis fetch error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Save an analysis record
   */
  async saveAnalysis(analysis: InsertTables<'waste_analysis'>): Promise<WasteAnalysisRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase database not connected.');
    }
    const { data, error } = await supabase
      .from('waste_analysis')
      .insert(analysis)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to persist waste analysis.');
    return data;
  },
};
