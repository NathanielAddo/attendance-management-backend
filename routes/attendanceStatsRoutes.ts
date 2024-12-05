import express, { Request, Response } from 'express';
import * as attendanceStatsController from '../controllers/attendanceStatsController.js';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => attendanceStatsController.getAttendanceSummary(req, res));
router.get('/chart-data', (req: Request, res: Response) => attendanceStatsController.getChartData(req, res));
router.get('/table-data', (req: Request, res: Response) => attendanceStatsController.getTableData(req, res));
router.get('/export', (req: Request, res: Response) => attendanceStatsController.exportAttendanceData(req, res));

export default router;
