import express from 'express';
import {
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
} from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Individual attendance routes
router.post('/schedules/:scheduleId/clock-in', authenticate, clockInIndividual);
router.post('/schedules/:scheduleId/clock-out', authenticate, clockOutIndividual);

// Bulk attendance routes
router.post('/schedules/:scheduleId/clock-in/bulk', authenticate, clockInBulk);

export default router;
