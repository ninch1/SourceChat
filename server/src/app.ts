import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import askRoutes from './routes/askRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.use('/api/ask', askRoutes);

app.use(errorHandler);

export default app;
