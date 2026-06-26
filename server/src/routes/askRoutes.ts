import { Router } from 'express';
import { askRagQuestion } from '../controllers/askController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/', authMiddleware, aiRateLimiter, askRagQuestion);

export default router;
