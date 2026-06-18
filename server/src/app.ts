import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import askRoutes from './routes/askRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);

app.use('/api/ask', askRoutes);

export default app;
