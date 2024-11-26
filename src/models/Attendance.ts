import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  type: 'clockIn' | 'clockOut';
  time: Date;
  source: 'self' | 'admin';
  hours: number;
  overtimeHours: number;
  lateHours: number;
  breakOverstayHours: number;
  earlyDepartureHours: number;
}

const AttendanceSchema: Schema = new Schema({
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

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);

