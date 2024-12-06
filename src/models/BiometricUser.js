const mongoose = require('mongoose');
const { Schema } = mongoose;

const BiometricUserSchema = new Schema({
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

module.exports = mongoose.model('BiometricUser', BiometricUserSchema);
