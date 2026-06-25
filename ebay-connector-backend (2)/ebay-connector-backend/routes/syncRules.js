import express from 'express';
import { getRules, createRule, deleteRule } from '../controllers/syncRuleController.js';

const router = express.Router();

router.get('/',       getRules);
router.post('/',      createRule);
router.delete('/:id', deleteRule);

export default router;
