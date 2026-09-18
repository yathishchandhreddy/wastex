/**
 * WasteX AI - Real AI Waste Analysis Type System
 * Structured definitions for Gemini industrial characterization, provenance, and persistence.
 */

export type FieldProvenance = 'AI Estimated' | 'User Provided' | 'Verified';

export interface CompositionComponent {
  component: string;
  estimated_percentage: number;
  confidence: number;
}

export interface StructuredGeminiAnalysisResponse {
  category: string;
  material: string;
  subcategory: string;
  confidence: number;
  composition_estimate: CompositionComponent[];
  physical_characteristics: string[];
  contaminants: string[];
  moisture_assessment: string;
  recyclability_tier: string;
  reuse_potential: string;
  recovery_potential: string;
  hazard_indicators: string[];
  analysis_summary: string;
  recommended_next_step: string;
}

export interface WasteAnalysisInput {
  wasteName: string;
  category: string;
  subcategory?: string;
  materialType?: string;
  quantity: number | string;
  unit: string;
  generationFrequency?: string;
  storageCondition?: string;
  hazardousDeclaration?: string;
  qualityGrade?: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface WasteAnalysisRecord {
  id: string;
  waste_listing_id: string;
  waste_name: string;
  created_at: string;
  is_current: boolean;
  result: StructuredGeminiAnalysisResponse;
  user_provided: {
    wasteName: string;
    category: string;
    subcategory?: string;
    materialType?: string;
    quantity: number | string;
    unit: string;
    generationFrequency?: string;
    storageCondition?: string;
    hazardousDeclaration?: string;
    qualityGrade?: string;
    description?: string;
    location?: string;
    imageUrl?: string;
  };
  provenance: Record<string, FieldProvenance>;
  is_verified_by_user?: boolean;
}
