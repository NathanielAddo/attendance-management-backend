import express, { Response } from 'express';
import {
  submitDeviceRequest,
  getDeviceRequestStatus,
  cancelDeviceRequest,
} from '../controllers/deviceRequestController';
import { Request } from 'express';

// Define AuthenticatedRequest extending Request
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  }; // Add custom properties here if needed
}

const router = express.Router();

// POST: Submit a device request
router.post('/request-approval', (req: Request, res: Response) => {
  submitDeviceRequest(req as AuthenticatedRequest, res);
});

// GET: Get the status of a device request
router.get('/request-status', (req: Request, res: Response) => {
  getDeviceRequestStatus(req as AuthenticatedRequest, res);
});

// DELETE: Cancel a device request
router.delete('/request-approval/:requestId', (req: Request, res: Response) => {
  cancelDeviceRequest(req as AuthenticatedRequest, res);
});

export default router;
