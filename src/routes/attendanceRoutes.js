const express = require('express');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
