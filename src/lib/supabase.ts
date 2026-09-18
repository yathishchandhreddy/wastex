/**
 * WasteX AI - Supabase Client Module
 * Provides safe client initialization, environment configuration validation,
 * and clear diagnostic warnings when variables are missing.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  message: string;
}

export function checkSupabaseConfig(): SupabaseConfigStatus {
  const missingKeys: string[] = [];

  if (!supabaseUrl || supabaseUrl.trim() === '' || supabaseUrl.includes('placeholder')) {
    missingKeys.push('VITE_SUPABASE_URL');
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '' || supabaseAnonKey.includes('placeholder')) {
    missingKeys.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missingKeys.length > 0) {
    return {
      isConfigured: false,
      missingKeys,
      message: `Supabase configuration missing: ${missingKeys.join(', ')}. Please configure these in your environment (.env / Vercel Settings) to enable real database features.`,
    };
  }

  return {
    isConfigured: true,
    missingKeys: [],
    message: 'Supabase client is configured and operational.',
  };
}

export const configStatus = checkSupabaseConfig();

/**
 * Singleton Supabase client instance or null if not yet configured.
 * Does NOT crash the application on missing variables.
 */
export const supabase: SupabaseClient<Database> | null = configStatus.isConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const isSupabaseConfigured = configStatus.isConfigured;
