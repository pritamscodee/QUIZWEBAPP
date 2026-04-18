import dotenv from 'dotenv';
dotenv.config();

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { isDatabaseConnected, getConnectionStatus } from './utils/dbHelper.js';
import { logInfo, logError } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'https://quizwebapp-frontend.vercel.app',      // your main production domain
  'https://quizwebapp-fro-git-f54569-kunal-kumar-prasads-projects-d62aa511.vercel.app',
  'https://quizwebapp-frontend-e9evobcyg.vercel.app',
  'http://localhost:3000',                       // local development
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
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
    const dbConnected = isDatabaseConnected();
    res.json({
        status: 'OK',
        message: 'Server running',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});
app.get('/', (req, res) => {
  res.json({ message: 'Quiz API is running', endpoints: '/api/health, /api/users, /api/quizzes, /api/results' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    logInfo(`Server running on http://localhost:${PORT}`);
});
