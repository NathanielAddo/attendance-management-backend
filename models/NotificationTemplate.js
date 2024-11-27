const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationTemplateSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  variables: [{ type: String }],
});

module.exports = mongoose.model('NotificationTemplate', NotificationTemplateSchema);
