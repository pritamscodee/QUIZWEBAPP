/**
 * RESULT ROUTES - Quiz submission and results
 */

import express from 'express';
import { submitQuiz, getUserResults } from '../controllers/resultController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.post('/', submitQuiz);
router.get('/my-results', getUserResults);

export default router;