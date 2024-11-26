import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationTemplate extends Document {
  title: string;
  content: string;
  variables: string[];
}

const NotificationTemplateSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  variables: [{ type: String }],
});

export default mongoose.model<INotificationTemplate>('NotificationTemplate', NotificationTemplateSchema);

