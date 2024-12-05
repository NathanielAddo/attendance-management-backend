import express, { Request, Response } from 'express';
import * as historyReportController from '../controllers/historyReportController.js';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => historyReportController.getSummaryReport(req, res));
router.get('/breakdown', (req: Request, res: Response) => historyReportController.getBreakdownReport(req, res));
router.post('/validate', (req: Request, res: Response) => historyReportController.validateUsers(req, res));
router.get('/download/summary', (req: Request, res: Response) => historyReportController.downloadSummaryReport(req, res));
router.get('/download/breakdown', (req: Request, res: Response) => historyReportController.downloadBreakdownReport(req, res));

export default router;
