import express from 'express';
import { getTenants, createTenant, updateTenant } from '../controllers/tenantController.js';

const router = express.Router();

router.get('/',      getTenants);
router.post('/',     createTenant);
router.put('/:id',   updateTenant);

export default router;
