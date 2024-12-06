const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceStatsSchema = new Schema({
  date: { type: Date, required: true },
  totalEmployees: { type: Number, required: true },
  lateArrivals: { type: Number, required: true },
  onTime: { type: Number, required: true },
  earlyDepartures: { type: Number, required: true },
  absent: { type: Number, required: true },
  timeOff: { type: Number, required: true },
});

module.exports = mongoose.model('AttendanceStats', AttendanceStatsSchema);
