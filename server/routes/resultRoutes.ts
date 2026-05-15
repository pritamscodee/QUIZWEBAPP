import express from 'express';
import {
  submitQuiz,
  getUserResults,
  getAllResults,
  getLeaderboard,
  getResultById,
} from '../controllers/resultController';
import { authenticateUser, isAdmin } from '../middleware/auth';

const router = express.Router();

router.use(authenticateUser);

router.get('/my-results', getUserResults);
router.get('/leaderboard', getLeaderboard);
router.get('/admin/all', isAdmin, getAllResults);
router.post('/', submitQuiz);
router.get('/:id', getResultById);

export default router;
