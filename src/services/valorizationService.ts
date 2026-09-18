/**
 * WasteX AI - Real Supabase Valorization Service Module
 * Handles circular pathways evaluation, real market demand verification,
 * and persistence in public.valorization_options and localStorage.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { ValorizationOptionRow, InsertTables } from '@/src/types/database';
import type {
  ValorizationInput,
  StructuredValorizationResult,
  ValorizationRecord,
  ValorizationPathwayType,
} from '@/src/types/valorization';
import { geminiService } from './geminiService';

const ACTIVE_VALORIZATION_KEY = 'wastex_active_valorization_result';
const VALORIZATION_HISTORY_KEY = 'wastex_valorization_history';

export const valorizationService = {
  /**
   * Check real buyer demand from public.buyer_requirements in Supabase
   * NEVER invents fake buyers. Returns empty array if none found.
   */
  async checkMarketDemand(
    material: string,
    category?: string
  ): Promise<
    Array<{
      material?: string | null;
      max_price?: number | null;
      min_quantity?: number | null;
      max_quantity?: number | null;
      location?: string | null;
      quality_requirement?: string | null;
    }>
  > {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('buyer_requirements')
        .select('*')
        .eq('status', 'active');

      if (error || !data || data.length === 0) {
        return [];
      }

      const matClean = (material || '').toLowerCase().trim();
      const catClean = (category || '').toLowerCase().trim();

      // Find compatible requirements matching material name or category
      const matched = data.filter((req) => {
        const reqMat = (req.material || '').toLowerCase();
        const reqWaste = (req.waste_type || '').toLowerCase();
        const reqDesc = (req.description || '').toLowerCase();

        return (
          reqMat.includes(matClean) ||
          matClean.includes(reqMat) ||
          reqWaste.includes(catClean) ||
          catClean.includes(reqWaste) ||
          reqDesc.includes(matClean)
        );
      });

      return matched.map((m) => ({
        material: m.material,
        max_price: m.max_price,
        min_quantity: m.min_quantity,
        max_quantity: m.max_quantity,
        location: m.location,
        quality_requirement: m.quality_requirement,
      }));
    } catch (err) {
      console.warn('Market demand check error:', err);
      return [];
    }
  },

  /**
   * Run the AI Valorization Decision Engine with real Gemini AI
   * and persist options to public.valorization_options
   */
  async evaluateAndSaveValorization(
    input: ValorizationInput,
    listingId?: string
  ): Promise<ValorizationRecord> {
    // 1. Verify real active market demand in Supabase
    const matchingBuyers = await this.checkMarketDemand(input.wasteName, input.category);
    const enrichedInput: ValorizationInput = {
      ...input,
      matchingBuyerRequirements: matchingBuyers,
    };

    // 2. Call server-side Gemini valorization engine
    const result: StructuredValorizationResult = await geminiService.valorizeWaste(enrichedInput);

    const activeListingId = listingId || `listing-${Date.now()}`;
    const recordId = `val-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const record: ValorizationRecord = {
      id: recordId,
      waste_listing_id: activeListingId,
      waste_name: input.wasteName,
      created_at: new Date().toISOString(),
      result,
      input: enrichedInput,
    };

    // 3. Persist pathways to Supabase public.valorization_options if configured and activeListingId is a valid UUID
    if (isSupabaseConfigured && supabase) {
      const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');
      
      if (isUuid(activeListingId)) {
        try {
          const rowsToInsert: InsertTables<'valorization_options'>[] = result.pathways.map((p) => {
            // Map pathway type to database enum: 'reuse' | 'recycling' | 'recovery' | 'disposal'
            const dbPathway: 'reuse' | 'recycling' | 'recovery' | 'disposal' =
              p.pathway === 'alternative_disposal' ? 'disposal' : p.pathway;

            return {
              waste_listing_id: activeListingId,
              pathway: dbPathway,
              estimated_value: p.estimated_value ?? (p.pathway === result.recommended_pathway && result.potential_value_label.includes('AI') ? 100 : null),
              market_demand_score: p.market_demand_score ?? (p.suitability === 'high' ? 85 : 50),
              environmental_benefit_score: p.environmental_score ?? (p.suitability === 'high' ? 90 : 60),
              feasibility_score: p.feasibility_score ?? (p.suitability === 'high' ? 85 : 55),
              overall_score: p.score,
              reason: `${p.reason} | Feasibility: ${p.practical_feasibility} | Economics: ${p.economic_context} | Market: ${p.market_context}`,
            };
          });

          const { error: insertError } = await supabase
            .from('valorization_options')
            .insert(rowsToInsert);

          if (insertError) {
            console.warn('Failed to insert into Supabase valorization_options:', insertError.message);
          } else {
            console.log('Successfully persisted valorization pathways to Supabase valorization_options');
          }
        } catch (dbErr) {
          console.warn('Error persisting to Supabase valorization_options:', dbErr);
        }
      } else {
        console.log('Skipping Supabase valorization_options insert because listingId is temporary/client-side (local storage active).');
      }
    }

    // 4. Cache active result in localStorage for instant UI recovery and durability
    try {
      localStorage.setItem(ACTIVE_VALORIZATION_KEY, JSON.stringify(record));
      const historyRaw = localStorage.getItem(VALORIZATION_HISTORY_KEY);
      const history: ValorizationRecord[] = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift(record);
      // Keep up to 20 past valorizations
      localStorage.setItem(VALORIZATION_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch {
      // ignore storage quota errors
    }

    return record;
  },

  /**
   * Retrieve active valorization record from session storage
   */
  getActiveValorization(): ValorizationRecord | null {
    try {
      const raw = localStorage.getItem(ACTIVE_VALORIZATION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ValorizationRecord;
    } catch {
      return null;
    }
  },

  /**
   * Set active valorization record
   */
  setActiveValorization(record: ValorizationRecord): void {
    try {
      localStorage.setItem(ACTIVE_VALORIZATION_KEY, JSON.stringify(record));
    } catch {
      // ignore
    }
  },

  /**
   * Retrieve valorization history
   */
  getValorizationHistory(): ValorizationRecord[] {
    try {
      const raw = localStorage.getItem(VALORIZATION_HISTORY_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ValorizationRecord[];
    } catch {
      return [];
    }
  },

  /**
   * Get valorization pathways generated for a specific waste stream from Supabase
   */
  async getOptionsByListingId(listingId: string): Promise<ValorizationOptionRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from('valorization_options')
      .select('*')
      .eq('waste_listing_id', listingId)
      .order('overall_score', { ascending: false });

    if (error) {
      console.warn('Valorization options fetch error:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Save raw valorization options directly to Supabase
   */
  async saveOptions(options: InsertTables<'valorization_options'>[]): Promise<ValorizationOptionRow[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase database not connected.');
    }
    const { data, error } = await supabase
      .from('valorization_options')
      .insert(options)
      .select('*');

    if (error) throw error;
    return data || [];
  },
};
