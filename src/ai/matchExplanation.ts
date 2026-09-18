/**
 * WasteX AI - Match Explanation AI Interface
 * Provides natural-language circular economy compatibility synergy assessments.
 */
import type { AIMatchExplanationRequest } from './geminiClient';

export interface AIMatchExplanationResult {
  matchScore: number;
  executiveSummary: string;
  synergies: string[];
  risksOrPretreatmentsNeeded: string[];
  logisticsRecommendation: string;
}

export const matchExplanationAI = {
  /**
   * Explain synergy between generator byproduct and buyer requirement
   */
  async explainMatch(_req: AIMatchExplanationRequest): Promise<AIMatchExplanationResult> {
    throw new Error('AI Match Explanation will be integrated with Gemini in Step 2.');
  },
};
