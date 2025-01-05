import express, { Request, Response } from 'express';
import { verifyToken } from '../utils/verifyToken';
import * as historyReportController from '../controllers/historyReportController.js';

const router = express.Router();

router.get('/summary', verifyToken, (req: Request, res: Response) => historyReportController.getSummaryReport(req, res));
router.get('/breakdown', verifyToken, (req: Request, res: Response) => historyReportController.getBreakdownReport(req, res));
router.post('/validate', verifyToken, (req: Request, res: Response) => historyReportController.validateUsers(req, res));
router.get('/download/summary', verifyToken, (req: Request, res: Response) => historyReportController.downloadSummaryReport(req, res));
router.get('/download/breakdown', verifyToken, (req: Request, res: Response) => historyReportController.downloadBreakdownReport(req, res));

export default router;
