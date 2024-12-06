import express, { Request, Response } from 'express';
import * as attendanceHistoryController from '../controllers/attendanceHistoryController';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => attendanceHistoryController.getAttendanceSummary(req, res));
router.get('/breakdown/:userId', (req: Request, res: Response) => attendanceHistoryController.getAttendanceBreakdown(req, res));
router.post('/filter', (req: Request, res: Response) => attendanceHistoryController.filterAttendance(req, res));
router.post('/validate/:reportId', (req: Request, res: Response) => attendanceHistoryController.validateReport(req, res));
router.get('/export', (req: Request, res: Response) => attendanceHistoryController.exportAttendanceReport(req, res));

export default router;
