import express from 'express';
import { executeGeminiWasteAnalysis } from './geminiWasteAnalysis';
import { executeGeminiValorization } from './geminiValorization';

export const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health and runtime capability check
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') ||
      (process.env.GOOGLE_GEMINI_API_KEY && process.env.GOOGLE_GEMINI_API_KEY.trim() !== '') ||
      (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim() !== '') ||
      (process.env.VITE_GEMINI_API_KEY && process.env.VITE_GEMINI_API_KEY.trim() !== '')
  );

  res.json({
    status: 'ok',
    hasGeminiKey: hasKey,
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Secure Server-Side Gemini Waste Analysis Endpoint
app.post('/api/gemini/analyze-waste', async (req, res) => {
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!input || !input.wasteName) {
      return res.status(400).json({
        error: 'Missing required waste input parameters (wasteName required).',
      });
    }

    const result = await executeGeminiWasteAnalysis(input);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Server Gemini Analysis Error:', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'AI analysis could not be completed. Please try again.',
    });
  }
});

// Secure Server-Side Gemini Valorization Endpoint
app.post('/api/gemini/valorize', async (req, res) => {
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!input || !input.wasteName) {
      return res.status(400).json({
        error: 'Missing required valorization input parameters (wasteName required).',
      });
    }

    const result = await executeGeminiValorization(input);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Server Gemini Valorization Error:', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'AI valorization decision could not be completed. Please try again.',
    });
  }
});

export default app;
