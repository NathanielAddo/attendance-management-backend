import express from 'express';
import { 
  getAttendees, 
  getAbsentees, 
  clockIn, 
  validateClockIn, 
  clockOut, 
  validateClockOut, 
  getClockingRecords, 
  getUserClockingRecord, 
  exportClockingRecords 
} from '../controllers/attendanceController.js';
import { authenticate } from '../middlewares/auth.middleware';
const router = express.Router();

router.get('/schedules/:scheduleId/attendees', authenticate, (req, res) => getAttendees(req, res));
router.get('/schedules/:scheduleId/absentees', authenticate, (req, res) => getAbsentees(req, res));
router.post('/schedules/:scheduleId/clock-in', authenticate, (req, res) => clockIn(req, res));
router.post('/schedules/:scheduleId/validate-clock-in', authenticate, (req, res) => validateClockIn(req, res));
router.post('/schedules/:scheduleId/clock-out', authenticate, (req, res) => clockOut(req, res));
router.post('/schedules/:scheduleId/validate-clock-out', authenticate, (req, res) => validateClockOut(req, res));
router.get('/schedules/:scheduleId/records', authenticate, (req, res) => getClockingRecords(req, res));
router.get('/schedules/:scheduleId/records/:userId', authenticate, (req, res) => getUserClockingRecord(req, res));
router.get('/schedules/:scheduleId/records/export', authenticate, (req, res) => exportClockingRecords(req, res));

export default router;
