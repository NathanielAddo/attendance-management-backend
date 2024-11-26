import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  country: string;
  branch: string;
  category: string;
  group: string;
  subgroup: string;
  schedule: string;
  phone: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  country: { type: String, required: true },
  branch: { type: String, required: true },
  category: { type: String, required: true },
  group: { type: String },
  subgroup: { type: String },
  schedule: { type: String },
  phone: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema);

