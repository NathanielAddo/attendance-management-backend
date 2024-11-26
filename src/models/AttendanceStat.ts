import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceStats extends Document {
  date: Date;
  totalEmployees: number;
  lateArrivals: number;
  onTime: number;
  earlyDepartures: number;
  absent: number;
  timeOff: number;
}

const AttendanceStatsSchema: Schema = new Schema({
  date: { type: Date, required: true },
  totalEmployees: { type: Number, required: true },
  lateArrivals: { type: Number, required: true },
  onTime: { type: Number, required: true },
  earlyDepartures: { type: Number, required: true },
  absent: { type: Number, required: true },
  timeOff: { type: Number, required: true },
});

export default mongoose.model<IAttendanceStats>('AttendanceStats', AttendanceStatsSchema);

