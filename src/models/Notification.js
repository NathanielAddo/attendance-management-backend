const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  medium: { type: String, enum: ['SMS', 'Voice', 'Email'], required: true },
  alertType: { type: String, enum: ['Recurring', 'Non-recurring'], required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  startDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },
  additionalText: { type: String },
});

module.exports = mongoose.model('Notification', NotificationSchema);
