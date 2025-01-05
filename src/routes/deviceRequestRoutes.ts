import express, { Response } from 'express';
import { 
  submitDeviceRequest, 
  getDeviceRequestStatus, 
  cancelDeviceRequest 
} from '../controllers/deviceRequestController.js';
import { verifyToken } from '../utils/verifyToken';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

router.post('/request-approval', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  submitDeviceRequest(req, res);
});

router.get('/request-status', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  getDeviceRequestStatus(req, res);
});

router.delete('/request-approval/:requestId', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  cancelDeviceRequest(req, res);
});

export default router;
