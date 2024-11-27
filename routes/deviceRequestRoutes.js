import express from 'express';
import { getDeviceRequests, createDeviceRequest, updateDeviceRequest, deleteDeviceRequest, bulkApproveDeviceRequests, bulkDeleteDeviceRequests } from '../controllers/deviceRequestController.js';

const router = express.Router();

router.get('/', getDeviceRequests);
router.post('/', createDeviceRequest);
router.put('/:id', updateDeviceRequest);
router.delete('/:id', deleteDeviceRequest);
router.post('/bulk-approve', bulkApproveDeviceRequests);
router.post('/bulk-delete', bulkDeleteDeviceRequests);

export default router;

