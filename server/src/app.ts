import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { askRag } from './services/ragService.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/ask', async (req: Request, res: Response) => {
  const { question } = req.body;

  if (typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const { answer, sources } = await askRag(question);
  return res.json({ question, answer, sources });
});

export default app;
