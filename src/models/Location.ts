import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
});

export default mongoose.model<ILocation>('Location', LocationSchema);

