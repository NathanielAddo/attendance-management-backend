// server.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createAndUploadBundle, getBundleUrl, deleteBundle } from './bundleManager';
import { dataSource } from './db';
import attendanceRoutes from './routes/attendanceRoutes';
// import other routes as needed
// import rosterRoutes from './routes/rosterRoutes';
// import eventRoutes from './routes/eventRoutes';
// ...

dotenv.config();

const PORT = parseInt(process.env.PORT || '5178', 10);

// Define allowed origins for CORS
const allowedOrigins = [
  "https://super.akwaabahr.com",
  "https://akwaabahr.com",
  "http://localhost:3000/",
];

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Custom CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Custom-Header');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  } else {
    res.status(403).send(`CORS policy does not allow access from origin: ${origin}`);
  }
});

// API Query route
app.get('/api/query/:queryName', async (req: Request, res: Response) => {
  const { queryName } = req.params;
  const query = req.query.query as string | undefined;
  const params = req.query.params as string | undefined;

  if (!query) {
    res.status(400).json({ error: 'Query parameter is required' });
    return;
  }

  try {
    // Create an existing bundle name using a timestamp from 24 hours ago.
    const existingBundleName = `${queryName}_${Date.now() - 24 * 60 * 60 * 1000}.json.gz`;
    const existingBundleUrl = await getBundleUrl(existingBundleName);

    if (existingBundleUrl) {
      res.redirect(302, existingBundleUrl);
      return;
    }

    const { publicUrl } = await createAndUploadBundle(
      queryName,
      query,
      params ? JSON.parse(params) : []
    );
    res.redirect(302, publicUrl);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Invalidate route
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

// Register attendance routes (and any additional routes)
// Instead of calling attendanceRoutes(app), use app.use() to mount the router.
app.use('/attendance', attendanceRoutes);
// Example: app.use('/roster', rosterRoutes), app.use('/event', eventRoutes), etc.

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Start the server and initialize the database
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await dataSource.initialize();
    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
