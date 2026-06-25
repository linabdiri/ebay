import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login',  login);
router.get('/verify',  protect, verifyToken);

export default router;