import express, { Request, Response } from 'express';
import * as attendanceStatsController from '../controllers/attendanceStatsController.js';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.get('/summary', verifyToken, (req: Request, res: Response) => attendanceStatsController.getAttendanceSummary(req, res));
router.get('/chart-data', verifyToken, (req: Request, res: Response) => attendanceStatsController.getChartData(req, res));
router.get('/table-data', verifyToken, (req: Request, res: Response) => attendanceStatsController.getTableData(req, res));
router.get('/export', verifyToken, (req: Request, res: Response) => attendanceStatsController.exportAttendanceData(req, res));

export default router;
