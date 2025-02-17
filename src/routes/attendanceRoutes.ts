// attendanceRoutes.ts

import express from 'express';
import {
  createSchedule,
  clockInIndividual,
  clockInBulk,
  clockOutIndividual
} from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Schedule routes
router.post('/schedules', authenticate, createSchedule);

// Individual attendance routes
router.post('/schedules/:scheduleId/clock-in', authenticate, clockInIndividual);
router.post('/schedules/:scheduleId/clock-out', authenticate, clockOutIndividual);

// Bulk attendance routes
router.post('/schedules/:scheduleId/clock-in/bulk', authenticate, clockInBulk);

export default router;
