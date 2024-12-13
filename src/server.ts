import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createAndUploadBundle, getBundleUrl, deleteBundle } from './bundleManager';
// import { pool } from './db';
import userRoutes from './routes/userRoutes';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
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

app.get('/api/query/:queryName', async (req: Request, res: Response) => {
  const { queryName } = req.params;
  const { query, params } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Check if bundle exists
    const existingBundleName = `${queryName}_${Date.now() - 24 * 60 * 60 * 1000}.json.gz`;
    const existingBundleUrl = await getBundleUrl(existingBundleName);

    if (existingBundleUrl) {
      // Serve existing bundle
      return res.redirect(existingBundleUrl);
    }

    // Create and upload new bundle
    const { bundleName, publicUrl } = await createAndUploadBundle(queryName, query as string, params as any[]);

    // Serve new bundle
    res.redirect(publicUrl);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
