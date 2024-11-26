const mongoose = require('mongoose');
const { Schema } = mongoose;

const RosterSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schedules: { type: Map, of: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  country: { type: String, required: true },
  branch: { type: String, required: true },
  category: { type: String, required: true },
  group: { type: String },
  subgroup: { type: String },
  schedule: { type: String },
});

module.exports = mongoose.model('Roster', RosterSchema);
