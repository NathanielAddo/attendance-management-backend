const mongoose = require('mongoose');
const { Schema } = mongoose;

const DailyBreakdownSchema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date, required: true },
  clockSource: { type: String, enum: ['Self', 'Admin'], required: true },
  hours: { type: Number, required: true },
  status: { type: String, enum: ['On Time', 'Late', 'Early Leave'], required: true },
});

module.exports = mongoose.model('DailyBreakdown', DailyBreakdownSchema);
