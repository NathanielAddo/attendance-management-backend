import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyBreakdown extends Document {
  userId: string;
  date: Date;
  clockIn: Date;
  clockOut: Date;
  clockSource: 'Self' | 'Admin';
  hours: number;
  status: 'On Time' | 'Late' | 'Early Leave';
}

const DailyBreakdownSchema: Schema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date, required: true },
  clockSource: { type: String, enum: ['Self', 'Admin'], required: true },
  hours: { type: Number, required: true },
  status: { type: String, enum: ['On Time', 'Late', 'Early Leave'], required: true },
});

export default mongoose.model<IDailyBreakdown>('DailyBreakdown', DailyBreakdownSchema);

