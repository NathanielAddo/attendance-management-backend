// src/routes/attendanceRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import {
  createSchedule,
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
  bulkCreateSchedules
} from '../controllers/attendanceController';
// import { authenticate } from '../middlewares/auth.middleware';

const router = Router();


// Create a new individual schedule.
router.post('/schedules', createSchedule);

// Clock in for an individual user.
router.post('/schedules/:scheduleId/clock-in', clockInIndividual);

// Clock out for an individual user.
router.post('/schedules/:scheduleId/clock-out',  clockOutIndividual);

// Clock in for multiple users (Bulk).
router.post('/schedules/:scheduleId/clock-in/bulk',  clockInBulk);

// Bulk create schedules from a CSV file.
router.post('/schedules/bulk', bulkCreateSchedules);

export default router;
