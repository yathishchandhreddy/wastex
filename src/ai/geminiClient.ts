/**
 * WasteX AI - Gemini Client Bridge Architecture
 *
 * CRITICAL SECURITY ARCHITECTURE:
 * - Gemini API key is NEVER exposed to the frontend client.
 * - In accordance with AI Studio security guidelines, all Gemini API calls
 *   run server-side via `/api/ai/*` endpoints.
 * - This module establishes the client-side proxy interface ready for Step 2.
 */

export interface AIAnalysisRequest {
  imageUrl?: string;
  imageMimeType?: string;
  imageBase64?: string;
  feedstockDescription?: string;
  declaredCategory?: string;
  spectralDataHint?: string;
}

export interface AIValorizationRequest {
  material: string;
  purityPct: number;
  quantityMT: number;
  contaminants?: string;
  location?: string;
}

export interface AIMatchExplanationRequest {
  wasteListingId: string;
  buyerRequirementId: string;
}

export const geminiClient = {
  /**
   * Health check for server-side AI runtime
   */
  async checkAIStatus(): Promise<{ available: boolean; provider: string; model: string }> {
    // Step 1 Foundation: Architectural stub ready for Step 2 server proxy
    return {
      available: false,
      provider: 'Google Gemini (Server-Side Proxy)',
      model: 'gemini-2.5-flash',
    };
  },

  /**
   * Proxy call to server-side Gemini endpoint
   */
  async invokeAIEndpoint<T>(_endpoint: string, _payload: unknown): Promise<T> {
    throw new Error(
      'Gemini AI pipeline is scheduled for Step 2. Server-side proxy /api/ai endpoints will execute models without leaking API keys.'
    );
  },
};
