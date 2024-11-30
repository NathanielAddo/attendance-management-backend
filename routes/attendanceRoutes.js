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

router.get('/schedules/:scheduleId/attendees', getAttendees);
router.get('/schedules/:scheduleId/absentees', getAbsentees);
router.post('/schedules/:scheduleId/clock-in', clockIn);
router.post('/schedules/:scheduleId/validate-clock-in', validateClockIn);
router.post('/schedules/:scheduleId/clock-out', clockOut);
router.post('/schedules/:scheduleId/validate-clock-out', validateClockOut);
router.get('/schedules/:scheduleId/records', getClockingRecords);
router.get('/schedules/:scheduleId/records/:userId', getUserClockingRecord);
router.get('/schedules/:scheduleId/records/export', exportClockingRecords);

export default router;

