const express = require('express');
const historyReportController = require('../controllers/historyReportController');

const router = express.Router();

router.get('/summary', historyReportController.getSummaryReport);
router.get('/breakdown', historyReportController.getBreakdownReport);
router.post('/validate', historyReportController.validateUsers);
router.get('/download/summary', historyReportController.downloadSummaryReport);
router.get('/download/breakdown', historyReportController.downloadBreakdownReport);

module.exports = router;
