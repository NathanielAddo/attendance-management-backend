const { Request, Response } = require('express');
const Notification = require('../models/Notification');
const NotificationTemplate = require('../models/NotificationTemplate');
const ActivityLog = require('../models/ActivityLog');

const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(400).json({ message: 'Error creating notification' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

const updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting notification' });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { notificationId, users } = req.body;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    // Implement notification sending logic here
    // Create activity log
    const activityLog = new ActivityLog({
      notificationId,
      timestamp: new Date(),
      updatedBy: req.user.id, // Assuming you have user information in the request
      totalUsers: users.length,
      medium: notification.medium,
    });
    await activityLog.save();
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification' });
  }
};

const getNotificationTemplates = async (req, res) => {
  try {
    const templates = await NotificationTemplate.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification templates' });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find().sort({ timestamp: -1 });
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  sendNotification,
  getNotificationTemplates,
  getActivityLogs,
};
