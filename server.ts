import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import attendanceRoutes from './src/routes/attendanceRoutes';
import eventRoutes from './src/routes/eventRoutes';
import attendanceHistoryRoutes from './src/routes/attendanceHistoryRoutes';
import attendanceStatsRoutes from './src/routes/attendanceStatsRoutes';
import scheduleRoutes from './src/routes/scheduleRoutes';
import historyReportRoutes from './src/routes/historyReportRoutes';
import userRoutes from './src/routes/userRoutes';
import locationRoutes from './src/routes/locationRoutes';
import rosterRoutes from './src/routes/rosterRoutes';
import notificationRoutes from './src/routes/notificationRoutes';
import biometricRoutes from './src/routes/biometricRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance-history', attendanceHistoryRoutes);
app.use('/api/attendance-stats', attendanceStatsRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/history-report', historyReportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/rosters', rosterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/biometrics', biometricRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

