/**
 * WasteX AI - Client-Side Gemini Service
 * Secure client proxy that delegates multimodal characterization to the backend.
 * Never handles or exposes raw API keys.
 */
import type { StructuredGeminiAnalysisResponse, WasteAnalysisInput } from '@/src/types/wasteAnalysis';
import type { StructuredValorizationResult, ValorizationInput } from '@/src/types/valorization';

export const geminiService = {
  /**
   * Request structured Gemini industrial waste analysis from the secure backend
   */
  async analyzeWaste(input: WasteAnalysisInput): Promise<StructuredGeminiAnalysisResponse> {
    try {
      const res = await fetch('/api/gemini/analyze-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errMessage = json?.error || `HTTP ${res.status}: AI analysis could not be completed.`;
        throw new Error(errMessage);
      }

      if (!json || !json.success || !json.data) {
        throw new Error(json?.error || 'AI analysis request succeeded but returned invalid output structure.');
      }

      return json.data as StructuredGeminiAnalysisResponse;
    } catch (err: any) {
      console.error('Gemini Service Client Error:', err);
      throw err;
    }
  },

  /**
   * Request structured Gemini techno-economic valorization evaluation from the secure backend
   */
  async valorizeWaste(input: ValorizationInput): Promise<StructuredValorizationResult> {
    try {
      const res = await fetch('/api/gemini/valorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        let errMessage = `HTTP ${res.status}: AI valorization decision could not be completed.`;
        try {
          const errData = await res.json();
          if (errData?.error) {
            errMessage = errData.error;
          }
        } catch {
          // fallback
        }
        throw new Error(errMessage);
      }

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error('AI valorization request succeeded but returned invalid output structure.');
      }

      return json.data as StructuredValorizationResult;
    } catch (err: any) {
      console.error('Gemini Valorization Client Error:', err);
      throw err;
    }
  },

  /**
   * Check if the backend AI runtime is available
   */
  async checkHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
      return { status: 'error', hasGeminiKey: false };
    } catch {
      return { status: 'offline', hasGeminiKey: false };
    }
  },
};
