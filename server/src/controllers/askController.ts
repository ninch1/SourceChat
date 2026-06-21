import { askRag } from '../services/ragService.js';
import { z } from 'zod';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const AskRagSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Question is required')
    .max(100, 'Question must be less than 100 characters'),
});

export const askQuestion = asyncWrapper(async (req, res) => {
  const { question } = AskRagSchema.parse(req.body);

  const { answer, sources } = await askRag(question);
  res.status(200).json({ question, answer, sources });
});
