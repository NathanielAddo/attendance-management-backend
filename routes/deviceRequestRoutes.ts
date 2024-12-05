import express from 'express';
import { submitDeviceRequest, getDeviceRequestStatus, cancelDeviceRequest } from '../controllers/deviceRequestController.js';

const router = express.Router();

router.post('/request-approval', (req, res) => submitDeviceRequest(req, res));
router.get('/request-status', (req, res) => getDeviceRequestStatus(req, res));
router.delete('/request-approval/:requestId', (req, res) => cancelDeviceRequest(req, res));

export default router;
