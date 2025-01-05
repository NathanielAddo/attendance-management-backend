import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { syncOfflineData, getSyncStatus } from '../controllers/offlineController.js';

const router = express.Router();

router.post('/sync', verifyToken, (req, res) => syncOfflineData(req, res));
router.get('/sync/status', verifyToken, (req, res) => getSyncStatus(req, res));

export default router;
