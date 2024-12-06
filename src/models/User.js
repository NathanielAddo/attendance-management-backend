const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
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

module.exports = mongoose.model('User', UserSchema);
