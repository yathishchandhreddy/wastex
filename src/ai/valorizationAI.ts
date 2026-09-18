/**
 * WasteX AI - Valorization AI Engine Interface
 * Evaluates circular transformation routes, techno-economic yields, and carbon impacts.
 */
import type { ValorizationOption } from '@/src/types';
import type { AIValorizationRequest } from './geminiClient';

export interface AIValorizationResult {
  pathways: {
    pathwayName: string;
    targetProduct: string;
    estimatedValueUSD: number;
    marketDemandScore: number;
    environmentalBenefitScore: number;
    feasibilityScore: number;
    overallScore: number;
    carbonAvoidanceTCO2e: number;
    capexRequirement: 'Low' | 'Moderate' | 'High' | 'Capital Intensive';
    technologyReadinessLevel: number;
    rationale: string;
  }[];
}

export const valorizationAI = {
  /**
   * Generates valorization options based on material properties
   */
  async evaluateValorizationPathways(_req: AIValorizationRequest): Promise<AIValorizationResult> {
    throw new Error(
      'Valorization AI engine will be connected to Gemini API in Step 2.'
    );
  },

  /**
   * Transform AI output into domain models
   */
  transformToValorizationOptions(raw: AIValorizationResult, listingId: string): Omit<ValorizationOption, 'id' | 'created_at'>[] {
    return raw.pathways.map((p) => ({
      waste_listing_id: listingId,
      pathway: p.pathwayName,
      target_product: p.targetProduct,
      estimated_value: p.estimatedValueUSD,
      currency: 'USD',
      market_demand_score: p.marketDemandScore,
      environmental_benefit_score: p.environmentalBenefitScore,
      feasibility_score: p.feasibilityScore,
      overall_score: p.overallScore,
      carbon_avoidance_potential_tco2e: p.carbonAvoidanceTCO2e,
      capex_requirement: p.capexRequirement,
      technology_readiness_level: p.technologyReadinessLevel,
      reason: p.rationale,
    }));
  },
};
