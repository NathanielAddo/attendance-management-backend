import express from 'express';
import { submitDeviceRequest, getDeviceRequestStatus, cancelDeviceRequest } from '../controllers/deviceRequestController.js';

const router = express.Router();

router.post('/request-approval', submitDeviceRequest);
router.get('/request-status', getDeviceRequestStatus);
router.delete('/request-approval/:requestId', cancelDeviceRequest);

export default router;

