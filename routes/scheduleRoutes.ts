import express from 'express';
import { getSchedules, getClockInLimit } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', (req, res) => getSchedules(req, res));
router.get('/:scheduleId/clock-in-limit', (req, res) => getClockInLimit(req, res));

export default router;
