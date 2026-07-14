import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import askRoutes from './routes/askRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import ErrorResponse from './errors/errorResponse.js';
import { generalRateLimiter } from './middleware/rateLimitMiddleware.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);

  if (!process.env.CLIENT_ORIGIN) {
    throw new Error(
      'CLIENT_ORIGIN must be set in production for CORS with credentials.',
    );
  }
}

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.use(generalRateLimiter);

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SourceChat API is running',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.use('/api/ask', askRoutes);

app.use((req, _res, next) => {
  next(
    new ErrorResponse(`Route not found: ${req.method} ${req.originalUrl}`, 404),
  );
});

app.use(errorHandler);

export default app;
