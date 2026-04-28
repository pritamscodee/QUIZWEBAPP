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

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://quizwebappfrontend.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:3000'
].filter((origin): origin is string => typeof origin === 'string' && origin.length > 0);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    logWarn(`CORS blocked request from origin: ${origin}`);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwebapp')
  .then(() => {
    logInfo('MongoDB connected');
    logInfo(`Connection status: ${getConnectionStatus()}`);
  })
  .catch(err => logError('MongoDB error:', err));

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: isDatabaseConnected() ? 'connected' : 'disconnected' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Quiz API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      quizzes: '/api/quizzes',
      results: '/api/results'
    }
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logInfo(`Server running on http://localhost:${PORT}`);
});