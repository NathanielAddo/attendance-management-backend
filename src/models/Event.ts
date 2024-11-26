import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: string;
  group: string;
  subgroup: string;
  country: string;
  branch: string;
  assignedUsers: string[];
  adminUsers: string[];
}

const EventSchema: Schema = new Schema({
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

export default mongoose.model<IEvent>('Event', EventSchema);

