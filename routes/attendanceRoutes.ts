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

const router = express.Router();

router.get('/schedules/:scheduleId/attendees', (req, res) => getAttendees(req, res));
router.get('/schedules/:scheduleId/absentees', (req, res) => getAbsentees(req, res));
router.post('/schedules/:scheduleId/clock-in', (req, res) => clockIn(req, res));
router.post('/schedules/:scheduleId/validate-clock-in', (req, res) => validateClockIn(req, res));
router.post('/schedules/:scheduleId/clock-out', (req, res) => clockOut(req, res));
router.post('/schedules/:scheduleId/validate-clock-out', (req, res) => validateClockOut(req, res));
router.get('/schedules/:scheduleId/records', (req, res) => getClockingRecords(req, res));
router.get('/schedules/:scheduleId/records/:userId', (req, res) => getUserClockingRecord(req, res));
router.get('/schedules/:scheduleId/records/export', (req, res) => exportClockingRecords(req, res));

export default router;
