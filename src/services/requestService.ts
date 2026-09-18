/**
 * WasteX AI - Real Supabase Request Service Module
 * Handles bilateral transaction negotiation, trade requests, and settlement tracking in public.requests.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { RequestRow, InsertTables, RequestStatus } from '@/src/types/database';

export const requestService = {
  /**
   * Get all requests involving a specific user (sent or received)
   */
  async getRequests(userId: string): Promise<RequestRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Requests fetch error:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Submit a trade or sample request
   */
  async submitRequest(request: InsertTables<'requests'>): Promise<RequestRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase database not connected.');
    }
    const { data, error } = await supabase
      .from('requests')
      .insert(request)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create request.');
    return data;
  },

  /**
   * Update request status (pending, accepted, rejected, completed)
   */
  async updateStatus(id: string, status: RequestStatus): Promise<RequestRow> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase database not connected.');
    }
    const { data, error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update request status.');
    return data;
  },
};
