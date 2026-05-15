import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';
import resultRoutes from './routes/resultRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { isDatabaseConnected, getConnectionStatus } from './utils/dbHelper';
import { logInfo, logError, logWarn } from './utils/logger';

const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[FATAL] Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://quizwebapplication-xi.vercel.app',
  'https://quizwebappfrontend-5rtdamiay.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter((origin): origin is string => typeof origin === 'string' && origin.length > 0);

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      logWarn(`CORS blocked request from origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    logInfo('MongoDB connected');
    logInfo(`Connection status: ${getConnectionStatus()}`);
  })
  .catch((err: Error) => {
    logError('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'OK',
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({
    message: 'Quiz API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      quizzes: '/api/quizzes',
      results: '/api/results',
    },
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logInfo(`Server running on http://localhost:${PORT}`);
});
