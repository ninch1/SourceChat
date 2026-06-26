import rateLimit from 'express-rate-limit';

const getPositiveEnvNumber = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const GENERAL_RATE_LIMIT = getPositiveEnvNumber(
  process.env.GENERAL_RATE_LIMIT,
  300,
);

const AUTH_RATE_LIMIT = getPositiveEnvNumber(process.env.AUTH_RATE_LIMIT, 20);

const AI_RATE_LIMIT = getPositiveEnvNumber(process.env.AI_RATE_LIMIT, 30);

const REFRESH_RATE_LIMIT = getPositiveEnvNumber(
  process.env.REFRESH_RATE_LIMIT,
  60,
);

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: GENERAL_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: AUTH_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: AI_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests. Please try again later.',
  },
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: REFRESH_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many refresh requests. Please try again later.',
  },
});
