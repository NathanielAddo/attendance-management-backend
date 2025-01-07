import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getSchedules, getClockInLimit } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => getSchedules(req, res));
router.get('/:scheduleId/clock-in-limit', authenticate, (req, res) => getClockInLimit(req, res));

export default router;
