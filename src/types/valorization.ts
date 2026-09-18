/**
 * WasteX AI - Valorization Decision Engine Type Definitions
 * Represents inputs, evaluated pathways, structured AI recommendations,
 * and database persistence contracts for SU-05 Valorization Engine.
 */

export type ValorizationPathwayType = 'reuse' | 'recycling' | 'recovery' | 'alternative_disposal';

export type PathwaySuitability = 'high' | 'medium' | 'low' | 'not suitable';

export interface PathwayEvaluation {
  pathway: ValorizationPathwayType;
  suitability: PathwaySuitability;
  score: number; // 0 - 100
  reason: string;
  practical_feasibility: string;
  feasibility_score?: number; // 0 - 100
  economic_context: string;
  economic_score?: number; // 0 - 100
  estimated_value?: number | null;
  environmental_context: string;
  environmental_score?: number; // 0 - 100
  market_context: string;
  market_demand_score?: number; // 0 - 100
}

export interface WhyRecommendationBreakdown {
  waste_characteristics: string;
  quantity: string;
  generation_pattern: string;
  market_context: string;
  economic_context: string;
  environmental_context: string;
}

export interface DisposalGuidance {
  recommended_handling_pathway: string;
  reason: string;
  risk_handling_notes: string[];
  compliance_notes: string;
}

export interface ValorizationInput {
  wasteName: string;
  category: string;
  subcategory?: string;
  quantity: number | string;
  unit: string;
  generationFrequency?: string;
  qualityGrade?: string;
  storageCondition?: string;
  hazardousDeclaration?: string;
  description?: string;
  location?: string;
  composition?: Array<{ component: string; estimated_percentage?: number | null }> | null;
  recyclability?: string;
  reusePotential?: string | number;
  recoveryPotential?: string | number;
  hazardIndicators?: string[];
  // Market demand context supplied from real database queries
  matchingBuyerRequirements?: Array<{
    material?: string | null;
    max_price?: number | null;
    min_quantity?: number | null;
    max_quantity?: number | null;
    location?: string | null;
    quality_requirement?: string | null;
  }>;
}

export interface StructuredValorizationResult {
  recommended_pathway: ValorizationPathwayType;
  recommendation_reason: string;
  confidence: number; // 0 - 100
  suitability_level: 'HIGH' | 'MEDIUM' | 'LOW';
  potential_value_display: string;
  potential_value_label: 'AI Estimated' | 'Indicative' | 'Indicative value unavailable' | 'Insufficient market data';
  market_demand_status: 'Available' | 'Limited' | 'Not currently available';
  market_demand_summary: string;
  why_recommendation: WhyRecommendationBreakdown;
  pathways: PathwayEvaluation[];
  disposal_guidance?: DisposalGuidance;
  created_at: string;
}

export interface ValorizationRecord {
  id: string;
  waste_listing_id: string;
  waste_name: string;
  created_at: string;
  result: StructuredValorizationResult;
  input: ValorizationInput;
}
