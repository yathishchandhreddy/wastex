import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import type {
  StructuredValorizationResult,
  ValorizationInput,
  ValorizationPathwayType,
} from '../../src/types/valorization';

const SYSTEM_INSTRUCTION = `You are the chief industrial circular economy and waste valorization engine for WasteX AI (official SU-05 decision engine).
Your task is to analyze industrial waste intake data and determine the most appropriate pathway among the 4 recognized outcomes:
1. REUSE (direct repurposing, cleaning, or internal/external reuse without chemical or structural transformation)
2. RECYCLING (mechanical, chemical, or metallurgical reprocessing into secondary raw materials or pellets)
3. RECOVERY (energy recovery, thermal co-processing, RDF/refuse-derived fuel, solvent recovery, or metallurgical extraction)
4. ALTERNATIVE DISPOSAL (certified TSDF hazardous waste treatment, high-temperature incineration, secure landfill, or stabilization)

CRITICAL EVALUATION CONSTRAINTS:
1. DO NOT OVERSIMPLIFY. Never use hardcoded rules such as "plastic -> recycling", "metal -> recycling", or "wood -> reuse".
2. You MUST evaluate ALL 4 pathways independently considering:
   - Waste composition and purity
   - Quantity and minimum viable processing threshold (e.g. small quantities under 100 kg may make specialized recycling economically unfeasible; bulk MT makes industrial recycling viable)
   - Generation pattern (continuous stream vs one-off batch)
   - Hazardous characteristics, solvent residues, or contaminants that prevent direct open recycling
   - Practical feasibility and handling logistics
   - Market demand context (use the supplied active buyer demand data if provided; do NOT invent buyers)
   - Economic and environmental context
3. If critical information (e.g. quantity, composition, quality) is missing or unverified, explicitly mark those fields as "Insufficient information" and adopt a conservative, safety-first stance.
4. Difficulty of selling does not automatically mean a material should be sent to disposal. Conversely, theoretical recyclability does not qualify a stream if heavy toxic contamination or zero economic feasibility exists.
5. In economic potential, do NOT promise exact revenue. Provide realistic indicative ranges (e.g. "$1,100 - $1,250 / MT" or "Treatment cost: $40 - $60 / MT") or explicitly "Indicative value unavailable" / "Insufficient market data". Clearly label estimates as "AI Estimated" or "Indicative".
6. In market demand, if no compatible buyers are provided, strictly output "Not currently available" and "No matching market demand currently available".
7. For disposal guidance, provide recommended handling pathway, reason, risk/handling notes, and compliance notes. State clearly that WasteX provides decision support and does not certify statutory compliance.
8. Language in "why_recommendation" must be clear, plain English, and accessible to normal industrial plant operators without confusing acronyms.

Return ONLY a valid structured JSON object matching the schema below. No markdown fences, no conversational prose.`;

export async function executeGeminiValorization(
  input: ValorizationInput
): Promise<StructuredValorizationResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY environment variable is not configured in Vercel settings.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const hasQuantity = input.quantity !== undefined && input.quantity !== null && String(input.quantity).trim() !== '' && Number(input.quantity) > 0;
  const hasComposition = Array.isArray(input.composition) && input.composition.length > 0;
  const hasHazardDeclaration = Boolean(input.hazardousDeclaration && input.hazardousDeclaration.trim());

  let marketDemandText = 'No matching market demand currently available in the database.';
  if (Array.isArray(input.matchingBuyerRequirements) && input.matchingBuyerRequirements.length > 0) {
    marketDemandText = `Active Compatible Buyer Requirements from Database (${input.matchingBuyerRequirements.length} found):\n` +
      input.matchingBuyerRequirements.map((b, i) =>
        `  ${i + 1}. Material: ${b.material || 'Similar feedstock'}, Max Price: ${b.max_price ? `$${b.max_price}/MT` : 'Negotiable'}, Quantity Range: ${b.min_quantity || 0} - ${b.max_quantity || 'Bulk'} MT, Location: ${b.location || 'Regional'}`
      ).join('\n');
  }

  const promptText = `
EVALUATE THIS INDUSTRIAL WASTE STREAM FOR VALORIZATION & DISPOSAL:

[WASTE STREAM PROFILE]
- Stream Name: ${input.wasteName || 'Insufficient information'}
- Category: ${input.category || 'Insufficient information'}
- Subcategory / Grade: ${input.subcategory || 'Insufficient information'}
- Quantity: ${hasQuantity ? `${input.quantity} ${input.unit || 'MT'}` : 'Insufficient information (Quantity not specified)'}
- Generation Pattern: ${input.generationFrequency || 'Insufficient information'}
- Storage Condition: ${input.storageCondition || 'Standard containment'}
- Hazardous Declaration: ${hasHazardDeclaration ? input.hazardousDeclaration : 'Insufficient information'}
- Declared Quality / Grade: ${input.qualityGrade || 'Insufficient information'}
- Location: ${input.location || 'Insufficient information'}
- Process Description: ${input.description || 'Insufficient information'}

[AI CHARACTERIZATION ASSAY DATA]
- Composition Estimate: ${hasComposition ? JSON.stringify(input.composition) : 'Insufficient information'}
- Recyclability Tier: ${input.recyclability || 'Insufficient information'}
- Reuse Potential: ${input.reusePotential !== undefined ? String(input.reusePotential) : 'Insufficient information'}
- Recovery Potential: ${input.recoveryPotential !== undefined ? String(input.recoveryPotential) : 'Insufficient information'}
- Hazard Indicators: ${Array.isArray(input.hazardIndicators) && input.hazardIndicators.length > 0 ? input.hazardIndicators.join(', ') : 'None declared'}

[MARKET DEMAND CONTEXT (FROM DATABASE)]
${marketDemandText}

REQUIRED JSON OUTPUT FORMAT:
{
  "recommended_pathway": "reuse" | "recycling" | "recovery" | "alternative_disposal",
  "recommendation_reason": string,
  "confidence": number,
  "suitability_level": "HIGH" | "MEDIUM" | "LOW",
  "potential_value_display": string,
  "potential_value_label": "AI Estimated" | "Indicative" | "Indicative value unavailable" | "Insufficient market data",
  "market_demand_status": "Available" | "Limited" | "Not currently available",
  "market_demand_summary": string,
  "why_recommendation": {
    "waste_characteristics": string,
    "quantity": string,
    "generation_pattern": string,
    "market_context": string,
    "economic_context": string,
    "environmental_context": string
  },
  "pathways": [
    {
      "pathway": "reuse" | "recycling" | "recovery" | "alternative_disposal",
      "suitability": "high" | "medium" | "low" | "not suitable",
      "score": number,
      "reason": string,
      "practical_feasibility": string,
      "feasibility_score": number,
      "economic_context": string,
      "economic_score": number,
      "estimated_value": number or null,
      "environmental_context": string,
      "environmental_score": number,
      "market_context": string,
      "market_demand_score": number
    }
  ],
  "disposal_guidance": {
    "recommended_handling_pathway": string,
    "reason": string,
    "risk_handling_notes": string[],
    "compliance_notes": string
  }
}
`;

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest',
  ];
  let responseText: string | undefined;
  let lastError: any;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.15,
        },
      });
      responseText = response.text;
      if (responseText) break;
    } catch (err: any) {
      console.warn(`Model ${modelName} valorization call failed, trying next candidate:`, err?.message || err);
      lastError = err;
    }
  }

  if (!responseText) {
    const errorDetails = lastError?.message || (typeof lastError === 'string' ? lastError : JSON.stringify(lastError));
    throw new Error(`Gemini Valorization API call failed across all model candidates. ${errorDetails || ''}`);
  }

  function extractJsonObject(text: string): any {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf('{');
      if (start !== -1) {
        let depth = 0;
        let inString = false;
        let escape = false;

        for (let i = start; i < cleaned.length; i++) {
          const char = cleaned[i];
          if (escape) {
            escape = false;
            continue;
          }
          if (char === '\\') {
            escape = true;
            continue;
          }
          if (char === '"') {
            inString = !inString;
            continue;
          }
          if (!inString) {
            if (char === '{') {
              depth++;
            } else if (char === '}') {
              depth--;
              if (depth === 0) {
                const sub = cleaned.substring(start, i + 1);
                return JSON.parse(sub);
              }
            }
          }
        }
      }
      throw new Error('Failed to locate valid JSON object in Gemini response.');
    }
  }

  let parsed: StructuredValorizationResult;
  try {
    parsed = extractJsonObject(responseText);
  } catch (err: any) {
    console.warn('Could not extract JSON from Gemini valorization:', err?.message || err);
    throw new Error('Failed to parse Gemini valorization JSON response.');
  }

  const validPathways: ValorizationPathwayType[] = ['reuse', 'recycling', 'recovery', 'alternative_disposal'];
  if (!Array.isArray(parsed.pathways)) {
    parsed.pathways = [];
  }

  if (!validPathways.includes(parsed.recommended_pathway)) {
    parsed.recommended_pathway = 'recycling';
  }

  for (const p of validPathways) {
    const existing = parsed.pathways.find((item) => item.pathway === p);
    if (!existing) {
      parsed.pathways.push({
        pathway: p,
        suitability: p === parsed.recommended_pathway ? 'high' : 'medium',
        score: p === parsed.recommended_pathway ? 85 : 50,
        reason: `Evaluated ${p} potential for ${input.wasteName}.`,
        practical_feasibility: 'Standard processing requirements apply.',
        economic_context: 'Subject to local feedstock demand.',
        environmental_context: 'Resource loop efficiency evaluated.',
        market_context: input.matchingBuyerRequirements?.length ? 'Regional demand monitored' : 'No matching market demand currently available',
      });
    }
  }

  if (!parsed.why_recommendation) {
    parsed.why_recommendation = {
      waste_characteristics: input.wasteName ? `Analyzed characteristics of ${input.wasteName}` : 'Insufficient information on waste characteristics',
      quantity: hasQuantity ? `${input.quantity} ${input.unit || 'MT'} available lot size` : 'Insufficient information on quantity',
      generation_pattern: input.generationFrequency || 'Insufficient information',
      market_context: input.matchingBuyerRequirements?.length ? 'Matching market demand identified' : 'No matching market demand currently available',
      economic_context: parsed.potential_value_display || 'Indicative value unavailable',
      environmental_context: 'Resource circularity and emissions reduction assessed',
    };
  }

  parsed.created_at = new Date().toISOString();
  return parsed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!input || !input.wasteName) {
      return res.status(400).json({
        error: 'Missing required valorization input parameters (wasteName required).',
      });
    }

    const result = await executeGeminiValorization(input);
    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    console.error('Serverless Gemini Valorization Error:', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'AI valorization decision could not be completed. Please try again.',
    });
  }
}

