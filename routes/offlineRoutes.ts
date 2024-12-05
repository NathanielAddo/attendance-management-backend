import express from 'express';
import { syncOfflineData, getSyncStatus } from '../controllers/offlineController.js';

const router = express.Router();

router.post('/sync', (req, res) => syncOfflineData(req, res));
router.get('/sync/status', (req, res) => getSyncStatus(req, res));

export default router;
