import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceReport extends Document {
  userId: string;
  userName: string;
  userImage: string;
  totalClockIns: number;
  totalClockOuts: number;
  adminClockIns: number;
  adminClockOuts: number;
  totalHours: number;
  overtimeHours: number;
  lateHours: number;
  validated: boolean;
  breakOverstay: number;
  absentDays: number;
  leaveDays: number;
  excuseDutyDays: number;
  userType: string;
  schedule: string;
  date: Date;
}

const AttendanceReportSchema: Schema = new Schema({
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

export default mongoose.model<IAttendanceReport>('AttendanceReport', AttendanceReportSchema);

