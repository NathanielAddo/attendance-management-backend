import mongoose, { Schema, Document } from 'mongoose';

export interface IBiometricUser extends Document {
  userId: string;
  name: string;
  country: string;
  branch: string;
  voiceData: string;
  imageData: string;
  voiceStatus: 'Available' | 'Empty';
  imageStatus: 'Available' | 'Empty';
  registrationDate: Date;
}

const BiometricUserSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  branch: { type: String, required: true },
  voiceData: { type: String },
  imageData: { type: String },
  voiceStatus: { type: String, enum: ['Available', 'Empty'], default: 'Empty' },
  imageStatus: { type: String, enum: ['Available', 'Empty'], default: 'Empty' },
  registrationDate: { type: Date, default: Date.now },
});

export default mongoose.model<IBiometricUser>('BiometricUser', BiometricUserSchema);

