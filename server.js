const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const attendanceHistoryRoutes = require('./src/routes/attendanceHistoryRoutes');
const attendanceStatsRoutes = require('./src/routes/attendanceStatsRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const historyReportRoutes = require('./src/routes/historyReportRoutes');
const userRoutes = require('./src/routes/userRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const rosterRoutes = require('./src/routes/rosterRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const biometricRoutes = require('./src/routes/biometricRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/attendance', attendanceRoutes);
app.use('/events', eventRoutes);
app.use('/attendance-history', attendanceHistoryRoutes);
app.use('/attendance-stats', attendanceStatsRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/history-report', historyReportRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);
app.use('/rosters', rosterRoutes);
app.use('/notifications', notificationRoutes);
app.use('/biometrics', biometricRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
