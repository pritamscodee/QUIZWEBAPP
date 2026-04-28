import express from 'express';
import { getAllQuizzes, getQuizById, createQuiz } from '../controllers/quizController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/', authenticateUser, createQuiz);

export default router;