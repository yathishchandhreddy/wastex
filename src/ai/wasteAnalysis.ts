/**
 * WasteX AI - AI Waste Analysis Engine Interface
 * Defines expected inputs, prompt schema, and structured response parsing
 * for multimodal industrial waste classification.
 */
import type { WasteAnalysis } from '@/src/types';
import type { AIAnalysisRequest } from './geminiClient';

export interface AIWasteAnalysisResult {
  identifiedMaterial: string;
  category: string;
  subcategory: string;
  confidenceScore: number;
  composition: {
    component: string;
    percentage: number;
    formula?: string;
    is_contaminant: boolean;
  }[];
  moistureRatio: number;
  contaminantsRatio: number;
  contaminantsDescription: string;
  recyclabilityTier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Non-recyclable';
  estimatedCarbonAvoidanceTCO2e: number;
  aiSummary: string;
  recommendedPathway: string;
}

export const wasteAnalysisAI = {
  /**
   * Generates AI multimodal analysis from image or spectral metadata.
   * NOTE: In Step 1, this returns explicit pending status without fabricating data.
   */
  async analyzeIndustrialWaste(_req: AIAnalysisRequest): Promise<AIWasteAnalysisResult> {
    throw new Error(
      'AI Waste Analysis will be activated in Step 2 with the Gemini multimodal vision pipeline.'
    );
  },

  /**
   * Helper to format raw Gemini JSON into strongly-typed WasteAnalysis entity
   */
  transformToWasteAnalysis(raw: AIWasteAnalysisResult, listingId: string): Omit<WasteAnalysis, 'id' | 'created_at'> {
    return {
      waste_listing_id: listingId,
      category: raw.category,
      material: raw.identifiedMaterial,
      subcategory: raw.subcategory,
      composition: raw.composition,
      moisture_ratio: raw.moistureRatio,
      contaminants_ratio: raw.contaminantsRatio,
      contaminants_type: raw.contaminantsDescription,
      recyclability: raw.recyclabilityTier,
      recyclability_tier: raw.recyclabilityTier,
      carbon_avoidance_tco2e: raw.estimatedCarbonAvoidanceTCO2e,
      reuse_potential: Math.min(100, Math.round(raw.confidenceScore * 0.95)),
      recovery_potential: Math.min(100, Math.round(raw.confidenceScore * 0.98)),
      ai_confidence: raw.confidenceScore,
      ai_summary: raw.aiSummary,
      detection_modality: 'Visual Computer Vision',
    };
  },
};
