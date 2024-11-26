const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivityLogSchema = new Schema({
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
  timestamp: { type: Date, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalUsers: { type: Number, required: true },
  medium: { type: String, enum: ['SMS', 'Voice', 'Email'], required: true },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
