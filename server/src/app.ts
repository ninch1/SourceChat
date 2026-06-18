import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/ask', (req: Request, res: Response) => {
  const { question } = req.body;

  if (typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  // fake response for now
  return res.json({
    question,
    answer: 'This is where the RAG answer will go.',
  });
});

export default app;
