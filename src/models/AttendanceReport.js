const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceReportSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: { type: String },
  totalClockIns: { type: Number, default: 0 },
  totalClockOuts: { type: Number, default: 0 },
  adminClockIns: { type: Number, default: 0 },
  adminClockOuts: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  lateHours: { type: Number, default: 0 },
  validated: { type: Boolean, default: false },
  breakOverstay: { type: Number, default: 0 },
  absentDays: { type: Number, default: 0 },
  leaveDays: { type: Number, default: 0 },
  excuseDutyDays: { type: Number, default: 0 },
  userType: { type: String },
  schedule: { type: String },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('AttendanceReport', AttendanceReportSchema);
