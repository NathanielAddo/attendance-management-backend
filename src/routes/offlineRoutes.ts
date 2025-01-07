import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { syncOfflineData, getSyncStatus } from '../controllers/offlineController.js';

const router = express.Router();

router.post('/sync', authenticate, (req, res) => syncOfflineData(req, res));
router.get('/sync/status', authenticate, (req, res) => getSyncStatus(req, res));

export default router;
