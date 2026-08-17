import { Router } from 'express';
import { getLeads } from '../controllers/leadsController.js';
import { requireOwnerAuth } from '../middleware/auth.js';

const router = Router();
router.get('/admin/leads', requireOwnerAuth, getLeads);
export default router;
