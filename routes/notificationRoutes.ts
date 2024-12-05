import express from 'express';
import { getNotifications, createNotification, updateNotification, deleteNotification, sendNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', (req, res) => getNotifications(req, res));
router.post('/', (req, res) => createNotification(req, res));
router.put('/:id', (req, res) => updateNotification(req, res));
router.delete('/:id', (req, res) => deleteNotification(req, res));
router.post('/send', (req, res) => sendNotification(req, res));

export default router;
