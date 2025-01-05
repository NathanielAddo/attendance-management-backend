import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getNotifications, createNotification, updateNotification, deleteNotification, sendNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => getNotifications(req, res));
router.post('/', verifyToken, (req, res) => createNotification(req, res));
router.put('/:id', verifyToken, (req, res) => updateNotification(req, res));
router.delete('/:id', verifyToken, (req, res) => deleteNotification(req, res));
router.post('/send', verifyToken, (req, res) => sendNotification(req, res));

export default router;
