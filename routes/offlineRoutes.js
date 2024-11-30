import express from 'express';
import { syncOfflineData, getSyncStatus } from '../controllers/offlineController.js';

const router = express.Router();

router.post('/sync', syncOfflineData);
router.get('/sync/status', getSyncStatus);

export default router;

