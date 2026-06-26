import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  authRateLimiter,
  refreshRateLimiter,
} from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/register', authRateLimiter, registerUser);
router.post('/login', authRateLimiter, loginUser);
router.post('/refresh', refreshRateLimiter, refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
