import express from 'express';
import { getAttendanceReport, getAttendanceBreakdown } from '../controllers/reportController.js';

const router = express.Router();

router.get('/attendance', getAttendanceReport);
router.get('/attendance/breakdown', getAttendanceBreakdown);

export default router;

