import express from 'express';
import * as attendanceController from '../controllers/attendanceController';

const router = express.Router();

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

export default router;

