const express = require('express');
const attendanceStatsController = require('../controllers/attendanceStatsController');

const router = express.Router();

router.get('/summary', attendanceStatsController.getAttendanceSummary);
router.get('/chart-data', attendanceStatsController.getChartData);
router.get('/table-data', attendanceStatsController.getTableData);
router.get('/export', attendanceStatsController.exportAttendanceData);

module.exports = router;
