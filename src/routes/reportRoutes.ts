import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getAttendanceReport, getAttendanceBreakdown } from '../controllers/reportController.js';

const router = express.Router();

router.get('/attendance', authenticate, (req, res) => getAttendanceReport(req, res));
router.get('/attendance/breakdown', authenticate, (req, res) => getAttendanceBreakdown(req, res));

export default router;
