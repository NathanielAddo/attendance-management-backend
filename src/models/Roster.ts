import mongoose, { Schema, Document } from 'mongoose';

export interface IRoster extends Document {
  userId: mongoose.Types.ObjectId;
  schedules: { [date: string]: string };
  startDate: Date;
  endDate: Date;
  country: string;
  branch: string;
  category: string;
  group: string;
  subgroup: string;
  schedule: string;
}

const RosterSchema: Schema = new Schema({
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

export default mongoose.model<IRoster>('Roster', RosterSchema);

