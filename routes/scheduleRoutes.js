import express from 'express';
import { getSchedules, getClockInLimit } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getSchedules);
router.get('/:scheduleId/clock-in-limit', getClockInLimit);

export default router;

