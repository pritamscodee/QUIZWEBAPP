import express from 'express';
import { register, login, getProfile } from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateUser, getProfile);

export default router;