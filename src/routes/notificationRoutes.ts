import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getNotifications, createNotification, updateNotification, deleteNotification, sendNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => getNotifications(req, res));
router.post('/', authenticate, (req, res) => createNotification(req, res));
router.put('/:id', authenticate, (req, res) => updateNotification(req, res));
router.delete('/:id', authenticate, (req, res) => deleteNotification(req, res));
router.post('/send',authenticate, (req, res) => sendNotification(req, res));

export default router;
