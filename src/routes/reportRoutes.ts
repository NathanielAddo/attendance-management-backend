import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getAttendanceReport, getAttendanceBreakdown } from '../controllers/reportController.js';

const router = express.Router();

router.get('/attendance', verifyToken, (req, res) => getAttendanceReport(req, res));
router.get('/attendance/breakdown', verifyToken, (req, res) => getAttendanceBreakdown(req, res));

export default router;
