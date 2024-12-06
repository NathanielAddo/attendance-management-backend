const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: String },
  group: { type: String },
  subgroup: { type: String },
  country: { type: String },
  branch: { type: String },
  assignedUsers: [{ type: String }],
  adminUsers: [{ type: String }],
});

module.exports = mongoose.model('Event', EventSchema);
