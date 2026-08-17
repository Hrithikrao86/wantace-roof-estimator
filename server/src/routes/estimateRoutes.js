import { Router } from 'express';
import { createEstimate } from '../controllers/estimateController.js';

const router = Router();
router.post('/estimate', createEstimate);
export default router;
