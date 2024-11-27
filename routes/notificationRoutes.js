import express from 'express';
import { getNotifications, createNotification, updateNotification, deleteNotification, sendNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);
router.post('/send', sendNotification);

export default router;

