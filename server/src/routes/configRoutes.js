import { Router } from 'express';
import { getPublicConfig, getAdminConfig, updateConfig } from '../controllers/configController.js';
import { requireOwnerAuth } from '../middleware/auth.js';

const router = Router();
router.get('/config', getPublicConfig);
router.get('/admin/config', requireOwnerAuth, getAdminConfig);
router.put('/admin/config', requireOwnerAuth, updateConfig);
export default router;
