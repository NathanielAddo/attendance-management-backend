const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  startTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  assignedUsers: { type: Number, default: 0 },
  locations: { type: String, required: true },
  duration: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  agendas: [{ type: String }],
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
