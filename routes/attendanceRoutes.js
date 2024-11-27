import express from 'express';
import { getAttendance, createAttendance, updateAttendance, deleteAttendance, getAttendanceStats, bulkClockIn, bulkClockOut, bulkCancel } from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/', getAttendance);
router.get('/stats', getAttendanceStats);
router.post('/', createAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);
router.post('/bulk-clock-in', bulkClockIn);
router.post('/bulk-clock-out', bulkClockOut);
router.post('/bulk-cancel', bulkCancel);

export default router;

