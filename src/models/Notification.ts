import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  content: string;
  medium: 'SMS' | 'Voice' | 'Email';
  alertType: 'Recurring' | 'Non-recurring';
  status: 'Active' | 'Inactive';
  startDate: Date;
  deliveryTime: string;
  additionalText: string;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  medium: { type: String, enum: ['SMS', 'Voice', 'Email'], required: true },
  alertType: { type: String, enum: ['Recurring', 'Non-recurring'], required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  startDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },
  additionalText: { type: String },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);

