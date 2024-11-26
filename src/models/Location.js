const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
});

module.exports = mongoose.model('Location', LocationSchema);
