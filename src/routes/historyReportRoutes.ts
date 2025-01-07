import express, { Request, Response } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as historyReportController from '../controllers/historyReportController.js';

const router = express.Router();

router.get('/summary', authenticate, (req: Request, res: Response) => historyReportController.getSummaryReport(req, res));
router.get('/breakdown', authenticate, (req: Request, res: Response) => historyReportController.getBreakdownReport(req, res));
router.post('/validate', authenticate, (req: Request, res: Response) => historyReportController.validateUsers(req, res));
router.get('/download/summary', authenticate, (req: Request, res: Response) => historyReportController.downloadSummaryReport(req, res));
router.get('/download/breakdown', authenticate, (req: Request, res: Response) => historyReportController.downloadBreakdownReport(req, res));

export default router;
