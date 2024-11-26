import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  name: string;
  branch: string;
  startTime: string;
  closingTime: string;
  assignedUsers: number;
  locations: string;
  duration: string;
  country: string;
  category: string;
  isArchived: boolean;
  agendas: string[];
}

const ScheduleSchema: Schema = new Schema({
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

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);

