import { askRag } from '../services/ragService.js';
import { z } from 'zod';
import { asyncWrapper } from '../middleware/asyncWrapper.js';
import { getAuthUser } from '../utils/authUtils.js';

const AskRagSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Question is required')
    .max(100, 'Question must be less than 100 characters'),
});

export const askQuestion = asyncWrapper(async (req, res) => {
  const user = getAuthUser(req);
  const { question } = AskRagSchema.parse(req.body);

  const { answer, sources } = await askRag(question, user.id);

  res.status(200).json({
    success: true,
    message: 'Question answered successfully',
    data: { question, answer, sources },
  });
});
