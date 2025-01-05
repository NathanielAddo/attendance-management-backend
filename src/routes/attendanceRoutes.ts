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
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.get('/schedules/:scheduleId/attendees', verifyToken, (req, res) => getAttendees(req, res));
router.get('/schedules/:scheduleId/absentees', verifyToken, (req, res) => getAbsentees(req, res));
router.post('/schedules/:scheduleId/clock-in', verifyToken, (req, res) => clockIn(req, res));
router.post('/schedules/:scheduleId/validate-clock-in', verifyToken, (req, res) => validateClockIn(req, res));
router.post('/schedules/:scheduleId/clock-out', verifyToken, (req, res) => clockOut(req, res));
router.post('/schedules/:scheduleId/validate-clock-out', verifyToken, (req, res) => validateClockOut(req, res));
router.get('/schedules/:scheduleId/records', verifyToken, (req, res) => getClockingRecords(req, res));
router.get('/schedules/:scheduleId/records/:userId', verifyToken, (req, res) => getUserClockingRecord(req, res));
router.get('/schedules/:scheduleId/records/export', verifyToken, (req, res) => exportClockingRecords(req, res));

export default router;
