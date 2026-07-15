import { askRag } from '../services/ragService.js';
import { z } from 'zod';
import { asyncWrapper } from '../middleware/asyncWrapper.js';
import { getAuthUser } from '../utils/authUtils.js';

const AskRagSchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, 'Question must be at least 3 characters')
    .max(500, 'Question must be less than 500 characters'),
});

export const askRagQuestion = asyncWrapper(async (req, res, next) => {
  // TEMP diagnostic logs for production /api/ask 502 debugging — remove later
  console.log('[ASK] route hit');

  try {
    const user = getAuthUser(req);
    const { question } = AskRagSchema.parse(req.body);

    console.log('[ASK] request context:', {
      userId: user.id,
      questionLength: question.length,
      timestamp: new Date().toISOString(),
    });

    console.log('[ASK] validation/auth passed, starting RAG');
    const { answer, sources } = await askRag(question, user.id);

    console.log('[ASK] sending response', {
      answerLength: answer.length,
      sourcesCount: sources.length,
    });

    res.status(200).json({
      success: true,
      message: 'Question answered successfully',
      data: { question, answer, sources },
    });

    console.log('[ASK] response sent');
  } catch (error) {
    console.error('[ASK] failed:', error);
    next(error);
  }
});
