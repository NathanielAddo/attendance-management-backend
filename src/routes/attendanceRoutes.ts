import express from 'express';
import {
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
  clockOutBulk,
  getAttendees,
  getAbsentees,
  getClockedInUsers,
  exportClockingRecords,
} from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Individual attendance routes
router.post('/schedules/:scheduleId/clock-in', authenticate, clockInIndividual);
router.post('/schedules/:scheduleId/clock-out', authenticate, clockOutIndividual);

// Bulk attendance routes
router.post('/schedules/:scheduleId/clock-in/bulk', authenticate, clockInBulk);
router.post('/schedules/:scheduleId/clock-out/bulk', authenticate, clockOutBulk);

// Attendance details routes
router.get('/schedules/:scheduleId/attendees', authenticate, getAttendees);
router.get('/schedules/:scheduleId/absentees', authenticate, getAbsentees);

// Get all clocked-in users for a schedule
router.get('/schedules/:scheduleId/clocked-in-users', authenticate, getClockedInUsers);

// Export attendance data
router.get('/schedules/:scheduleId/records/export', authenticate, exportClockingRecords);

export default router;
