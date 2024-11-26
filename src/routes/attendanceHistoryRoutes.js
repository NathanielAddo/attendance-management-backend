const express = require('express');
const attendanceHistoryController = require('../controllers/attendanceHistoryController');

const router = express.Router();

router.get('/summary', attendanceHistoryController.getAttendanceSummary);
router.get('/breakdown/:userId', attendanceHistoryController.getAttendanceBreakdown);
router.post('/filter', attendanceHistoryController.filterAttendance);
router.post('/validate/:reportId', attendanceHistoryController.validateReport);
router.get('/export', attendanceHistoryController.exportAttendanceReport);

module.exports = router;
