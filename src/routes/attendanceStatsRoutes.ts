import express, { Request, Response } from 'express';
import * as attendanceStatsController from '../controllers/attendanceStatsController.js';
import { authenticate } from '../middlewares/auth.middleware';
const router = express.Router();

router.get('/summary', authenticate, (req: Request, res: Response) => attendanceStatsController.getAttendanceSummary(req, res));
router.get('/chart-data', authenticate, (req: Request, res: Response) => attendanceStatsController.getChartData(req, res));
router.get('/table-data', authenticate, (req: Request, res: Response) => attendanceStatsController.getTableData(req, res));
router.get('/export', authenticate, (req: Request, res: Response) => attendanceStatsController.exportAttendanceData(req, res));

export default router;
