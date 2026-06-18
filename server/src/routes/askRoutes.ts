import { Router, type Request, type Response } from 'express';
import { askRag } from '../services/ragService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { question } = req.body;

  if (typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const cleanedQuestion = question.trim().toLowerCase();

  try {
    const { answer, sources } = await askRag(cleanedQuestion);
    return res.json({ question, answer, sources });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
