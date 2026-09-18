/**
 * WasteX AI - Waste Analysis Persistence & Lifecycle Service
 * Manages Supabase persistence, historical analysis record keeping,
 * re-analysis marking, and the handoff to the Valorization stage.
 */
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type {
  StructuredGeminiAnalysisResponse,
  WasteAnalysisInput,
  WasteAnalysisRecord,
} from '@/src/types/wasteAnalysis';

const LOCAL_STORAGE_HISTORY_KEY = 'wastex_ai_analysis_history';
const ACTIVE_ANALYSIS_HANDOFF_KEY = 'wastex_active_analysis_for_valorization';

export const wasteAnalysisService = {
  /**
   * Save a newly generated Gemini analysis record
   */
  async saveAnalysisRecord(
    input: WasteAnalysisInput,
    result: StructuredGeminiAnalysisResponse,
    listingId = 'stream-gen-001'
  ): Promise<WasteAnalysisRecord> {
    const recordId = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const record: WasteAnalysisRecord = {
      id: recordId,
      waste_listing_id: listingId,
      waste_name: input.wasteName || 'Industrial Stream',
      created_at: nowIso,
      is_current: true,
      result,
      user_provided: {
        wasteName: input.wasteName,
        category: input.category,
        subcategory: input.subcategory,
        materialType: input.materialType,
        quantity: input.quantity,
        unit: input.unit,
        generationFrequency: input.generationFrequency,
        storageCondition: input.storageCondition,
        hazardousDeclaration: input.hazardousDeclaration,
        qualityGrade: input.qualityGrade,
        description: input.description,
        location: input.location,
        imageUrl: input.imageUrl,
      },
      provenance: {
        category: 'AI Estimated',
        material: 'AI Estimated',
        subcategory: 'AI Estimated',
        composition_estimate: 'AI Estimated',
        physical_characteristics: 'AI Estimated',
        contaminants: 'AI Estimated',
        moisture_assessment: 'AI Estimated',
        recyclability_tier: 'AI Estimated',
        reuse_potential: 'AI Estimated',
        recovery_potential: 'AI Estimated',
        hazard_indicators: 'AI Estimated',
        analysis_summary: 'AI Estimated',
        declared_quantity: 'User Provided',
        declared_frequency: 'User Provided',
        dispatch_location: 'User Provided',
      },
      is_verified_by_user: false,
    };

    // 1. Persist to Supabase if connected and waste_listing_id is a valid UUID
    if (isSupabaseConfigured && supabase) {
      const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');
      
      if (isUuid(record.waste_listing_id)) {
        try {
          const insertPayload: any = {
            waste_listing_id: record.waste_listing_id,
            category: result.category,
            material: result.material,
            subcategory: result.subcategory,
            composition: {
              ...result,
              provenance: record.provenance,
              user_provided: record.user_provided,
              is_current: true,
            },
            recyclability: result.recyclability_tier,
            reuse_potential: result.reuse_potential,
            recovery_potential: result.recovery_potential,
            ai_confidence: result.confidence,
            ai_summary: result.analysis_summary,
            created_at: nowIso,
          };

          if (isUuid(record.id)) {
            insertPayload.id = record.id;
          }

          const { error: dbError } = await supabase.from('waste_analysis').insert(insertPayload);
          if (dbError) {
            console.warn('Could not persist analysis to Supabase (using local storage fallback):', dbError.message);
          }
        } catch (dbErr) {
          console.warn('Could not persist analysis to Supabase, fallback to local storage:', dbErr);
        }
      } else {
        console.log('Skipping Supabase waste_analysis insert because waste_listing_id is temporary/client-side (local storage active).');
      }
    }

    // 2. Persist in local storage for instant durability & re-analysis history
    const history = this.getLocalHistory();
    // Mark previous records for this stream as is_current = false
    const updatedHistory = history.map((h) => {
      if (h.waste_listing_id === listingId || h.waste_name === record.waste_name) {
        return { ...h, is_current: false };
      }
      return h;
    });
    updatedHistory.unshift(record);
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
      // Save as active for Valorization handoff
      localStorage.setItem(ACTIVE_ANALYSIS_HANDOFF_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    return record;
  },

  /**
   * Retrieve all previous analyses for the stream/generator
   */
  async getAnalysisHistory(listingId = 'stream-gen-001'): Promise<WasteAnalysisRecord[]> {
    // Check Supabase first if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('waste_analysis')
          .select('*')
          .eq('waste_listing_id', listingId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((row, idx) => {
            const extra = (row.composition as any) || {};
            return {
              id: row.id,
              waste_listing_id: row.waste_listing_id,
              waste_name: extra?.user_provided?.wasteName || row.material || 'Industrial Stream',
              created_at: row.created_at,
              is_current: idx === 0,
              result: {
                category: row.category || extra.category || 'Plastic & Polymers',
                material: row.material || extra.material || 'Recoverable Fraction',
                subcategory: row.subcategory || extra.subcategory || 'Industrial scrap',
                confidence: row.ai_confidence || 85,
                composition_estimate: extra.composition_estimate || [],
                physical_characteristics: extra.physical_characteristics || [],
                contaminants: extra.contaminants || [],
                moisture_assessment: extra.moisture_assessment || 'Ambient',
                recyclability_tier: row.recyclability || extra.recyclability_tier || 'Tier 1',
                reuse_potential: row.reuse_potential || extra.reuse_potential || 'High',
                recovery_potential: row.recovery_potential || extra.recovery_potential || 'High',
                hazard_indicators: extra.hazard_indicators || [],
                analysis_summary: row.ai_summary || extra.analysis_summary || '',
                recommended_next_step: extra.recommended_next_step || 'Proceed to valorization',
              },
              user_provided: extra.user_provided || {
                wasteName: row.material || 'Industrial Byproduct',
                category: row.category || 'Plastic & Polymers',
                quantity: 24,
                unit: 'MT',
              },
              provenance: extra.provenance || {},
              is_verified_by_user: Boolean(extra.is_verified_by_user),
            };
          });
        }
      } catch (err) {
        console.warn('Error fetching Supabase analysis history:', err);
      }
    }

    // Fallback to local storage history
    return this.getLocalHistory();
  },

  /**
   * Internal reader for localStorage history
   */
  getLocalHistory(): WasteAnalysisRecord[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore parsing errors
    }
    return [];
  },

  /**
   * Get the active analysis prepared for Valorization handoff
   */
  getActiveAnalysisForValorization(): WasteAnalysisRecord | null {
    try {
      const raw = localStorage.getItem(ACTIVE_ANALYSIS_HANDOFF_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    const history = this.getLocalHistory();
    return history.length > 0 ? history[0] : null;
  },

  /**
   * Set a specific historical analysis as the active one
   */
  setActiveAnalysis(record: WasteAnalysisRecord): void {
    try {
      localStorage.setItem(ACTIVE_ANALYSIS_HANDOFF_KEY, JSON.stringify(record));
      const history = this.getLocalHistory();
      const updated = history.map((h) => ({
        ...h,
        is_current: h.id === record.id,
      }));
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update active analysis:', e);
    }
  },

  /**
   * Mark an analysis field as verified by the human engineer
   */
  markFieldVerified(recordId: string, fieldKey: string): void {
    const history = this.getLocalHistory();
    const updated = history.map((h) => {
      if (h.id === recordId) {
        return {
          ...h,
          provenance: {
            ...h.provenance,
            [fieldKey]: 'Verified' as const,
          },
          is_verified_by_user: true,
        };
      }
      return h;
    });
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  },
};
