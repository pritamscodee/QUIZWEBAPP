/**
 * MAIN SERVER FILE - NOW USING UTILS
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import { isDatabaseConnected, getConnectionStatus } from './utils/dbHelper.js';
import { logInfo, logError } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwebapp')
    .then(() => {
        logInfo('✅ MongoDB connected successfully');
        logInfo(`Connection status: ${getConnectionStatus()}`);
    })
    .catch(err => logError('❌ MongoDB error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

// Health check - USING UTILS
app.get('/api/health', (req, res) => {
    const dbConnected = isDatabaseConnected();
    res.json({
        status: 'OK',
        message: 'Server running',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logInfo(`🚀 Server running on http://localhost:${PORT}`);
});