import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createAndUploadBundle, getBundleUrl, deleteBundle } from './bundleManager';
import { pool } from './db';
import attendanceRoutes from './routes/attendanceRoutes';
import rosterRoutes from './routes/rosterRoutes';
import eventRoutes from './routes/eventRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import notificationRoutes from './routes/notificationRoutes';
import biometricRoutes from './routes/biometricRoutes';
import deviceRequestRoutes from './routes/deviceRequestRoutes';
import locationRoutes from './routes/locationRoutes';
import reportRoutes from './routes/reportRoutes';
import offlineRoutes from './routes/offlineRoutes';
import adminScheduleRoutes from './routes/adminScheduleRoute';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5178;

// Define allowed origins for CORS
const allowedOrigins = [
  "https://super.akwaabahr.com",
  "https://akwaabahr.com",
  "https://symmetrical-xylophone-wrr9gqj97p6v3vxq-3000.app.github.dev",
];

// Custom CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
    credentials: true,
  })
);

// Middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/roster', rosterRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/biometric', biometricRoutes);
app.use('/api/device-requests', deviceRequestRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/offline', offlineRoutes);
app.use('/api/admin-schedule', adminScheduleRoutes);

// Query route with caching mechanism
app.get('/api/query/:queryName', async (req: Request, res: Response) => {
  const { queryName } = req.params;
  const { query, params } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const existingBundleName = `${queryName}_${Date.now() - 24 * 60 * 60 * 1000}.json.gz`;
    const existingBundleUrl = await getBundleUrl(existingBundleName);

    if (existingBundleUrl) {
      return res.redirect(existingBundleUrl);
    }

    const { bundleName, publicUrl } = await createAndUploadBundle(queryName, query as string, params as any[]);
    res.redirect(publicUrl);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invalidate bundle route
app.post('/api/invalidate/:queryName', async (req: Request, res: Response) => {
  const { queryName } = req.params;

  try {
    const bundleName = `${queryName}_*.json.gz`;
    await deleteBundle(bundleName);
    res.json({ message: 'Bundle invalidated successfully' });
  } catch (error) {
    console.error('Error invalidating bundle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
