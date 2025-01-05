import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getSchedules, getClockInLimit } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => getSchedules(req, res));
router.get('/:scheduleId/clock-in-limit', verifyToken, (req, res) => getClockInLimit(req, res));

export default router;
