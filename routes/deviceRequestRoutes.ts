import express, { Response } from 'express';
import { submitDeviceRequest, getDeviceRequestStatus, cancelDeviceRequest } from '../controllers/deviceRequestController';
import { AuthenticatedRequest } from '../types/express';

const router = express.Router();

router.post('/request-approval', (req: AuthenticatedRequest, res: Response) => {
  submitDeviceRequest(req, res);
});

router.get('/request-status', (req: AuthenticatedRequest, res: Response) => {
  getDeviceRequestStatus(req, res);
});

router.delete('/request-approval/:requestId', (req: AuthenticatedRequest, res: Response) => {
  cancelDeviceRequest(req, res);
});

export default router;

