import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  notificationId: mongoose.Types.ObjectId;
  timestamp: Date;
  updatedBy: mongoose.Types.ObjectId;
  totalUsers: number;
  medium: 'SMS' | 'Voice' | 'Email';
}

const ActivityLogSchema: Schema = new Schema({
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
  timestamp: { type: Date, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalUsers: { type: Number, required: true },
  medium: { type: String, enum: ['SMS', 'Voice', 'Email'], required: true },
});

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

