import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  const hasKey = Boolean(
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') ||
      (process.env.GOOGLE_GEMINI_API_KEY && process.env.GOOGLE_GEMINI_API_KEY.trim() !== '') ||
      (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim() !== '') ||
      (process.env.VITE_GEMINI_API_KEY && process.env.VITE_GEMINI_API_KEY.trim() !== '')
  );

  res.status(200).json({
    status: 'ok',
    service: 'WasteX AI Backend API',
    hasGeminiKey: hasKey,
    nodeEnv: process.env.NODE_ENV || 'production',
    endpoints: ['/api/health', '/api/gemini/analyze-waste', '/api/gemini/valorize'],
    timestamp: new Date().toISOString(),
  });
}
