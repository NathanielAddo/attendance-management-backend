const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.post('/send', notificationController.sendNotification);
router.get('/templates', notificationController.getNotificationTemplates);
router.get('/activity-logs', notificationController.getActivityLogs);

module.exports = router;
