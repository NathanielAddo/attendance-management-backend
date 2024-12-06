import express from 'express';
import { getAttendanceReport, getAttendanceBreakdown } from '../controllers/reportController.js';

const router = express.Router();

router.get('/attendance', (req, res) => getAttendanceReport(req, res));
router.get('/attendance/breakdown', (req, res) => getAttendanceBreakdown(req, res));

export default router;
