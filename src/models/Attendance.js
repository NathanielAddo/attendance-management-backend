const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['clockIn', 'clockOut'], required: true },
  time: { type: Date, required: true },
  source: { type: String, enum: ['self', 'admin'], required: true },
  hours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  lateHours: { type: Number, default: 0 },
  breakOverstayHours: { type: Number, default: 0 },
  earlyDepartureHours: { type: Number, default: 0 },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
