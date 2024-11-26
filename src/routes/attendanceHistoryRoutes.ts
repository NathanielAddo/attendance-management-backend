import express from 'express';
import * as attendanceHistoryController from '../controllers/attendanceHistoryController';

const router = express.Router();

router.get('/summary', attendanceHistoryController.getAttendanceSummary);
router.get('/breakdown/:userId', attendanceHistoryController.getAttendanceBreakdown);
router.post('/filter', attendanceHistoryController.filterAttendance);
router.post('/validate/:reportId', attendanceHistoryController.validateReport);
router.get('/export', attendanceHistoryController.exportAttendanceReport);

export default router;

