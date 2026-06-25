import express from 'express';
import { generateDescription, getAiRules, saveAiRules } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateDescription);
router.get('/rules',     getAiRules);
router.put('/rules',     saveAiRules);

export default router;
