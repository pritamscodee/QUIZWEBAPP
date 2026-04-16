/**
 * QUIZ ROUTES - Quiz CRUD operations
 */

import express from 'express';
import {
    getAllQuizzes,
    getQuizById,
    createQuiz
} from '../controllers/quizController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);

// Protected routes
router.post('/', authenticateUser, createQuiz);

export default router;