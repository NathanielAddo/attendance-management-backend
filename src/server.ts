import uWS, { App } from 'uWebSockets.js';
import dotenv from 'dotenv';
import { createAndUploadBundle, getBundleUrl, deleteBundle } from './bundleManager';
import { dataSource } from "./db";
import attendanceRoutes from './routes/attendanceRoutes';
// import rosterRoutes from './routes/rosterRoutes';
// import eventRoutes from './routes/eventRoutes';
// import scheduleRoutes from './routes/scheduleRoutes';
// import notificationRoutes from './routes/notificationRoutes';
// import biometricRoutes from './routes/biometricRoutes';
// import deviceRequestRoutes from './routes/deviceRequestRoutes';
// import locationRoutes from './routes/locationRoutes';
// import reportRoutes from './routes/reportRoutes';
// import offlineRoutes from './routes/offlineRoutes';
// import adminScheduleRoutes from './routes/adminScheduleRoute';
dotenv.config();

const PORT = parseInt(process.env.PORT || '5178', 10);

// Define allowed origins for CORS
const allowedOrigins = [
  "https://super.akwaabahr.com",
  "https://akwaabahr.com",
  "https://symmetrical-xylophone-wrr9gqj97p6v3vxq-3000.app.github.dev",
];

const app = App();

// Type aliases for uWebSockets.js request and response
// Replace 'any' with proper types if available.
type UWSHttpResponse = any;
type UWSHttpRequest = any;

// Middleware for CORS
app.any('/*', (res: UWSHttpResponse, req: UWSHttpRequest, next: () => void) => {
  const origin = req.getHeader('origin');
  if (!origin || allowedOrigins.includes(origin)) {
    res.writeHeader('Access-Control-Allow-Origin', origin || '*');
    res.writeHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.writeHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Custom-Header');
    res.writeHeader('Access-Control-Allow-Credentials', 'true');
    next();
  } else {
    res.writeStatus('403 Forbidden').end(`CORS policy does not allow access from origin: ${origin}`);
  }
});

// Middleware for JSON parsing
app.any('/*', (res: UWSHttpResponse, req: UWSHttpRequest, next: () => void) => {
  let buffer = '';
  res.onData((chunk: ArrayBuffer, isLast: boolean) => {
    buffer += Buffer.from(chunk).toString();
    if (isLast) {
      try {
        req.body = JSON.parse(buffer);
      } catch (error) {
        req.body = {};
      }
      next();
    }
  });
});

// API Query route
app.get('/api/query/:queryName', (res: UWSHttpResponse, req: UWSHttpRequest) => {
  const queryName = req.getParameter(0);
  const query = req.getQuery('query');
  const params = req.getQuery('params');

  if (!query) {
    res.writeStatus('400 Bad Request').end(JSON.stringify({ error: 'Query parameter is required' }));
    return;
  }

  (async () => {
    try {
      const existingBundleName = `${queryName}_${Date.now() - 24 * 60 * 60 * 1000}.json.gz`;
      const existingBundleUrl = await getBundleUrl(existingBundleName);

      if (existingBundleUrl) {
        res.writeStatus('302 Found').writeHeader('Location', existingBundleUrl).end();
        return;
      }

      const { publicUrl } = await createAndUploadBundle(
        queryName,
        query,
        params ? JSON.parse(params) : []
      );
      res.writeStatus('302 Found').writeHeader('Location', publicUrl).end();
    } catch (error) {
      console.error('Error processing query:', error);
      res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: 'Internal server error' }));
    }
  })();
});

// API Invalidate route
app.post('/api/invalidate/:queryName', (res: UWSHttpResponse, req: UWSHttpRequest) => {
  const queryName = req.getParameter(0);

  (async () => {
    try {
      const bundleName = `${queryName}_*.json.gz`;
      await deleteBundle(bundleName);
      res.end(JSON.stringify({ message: 'Bundle invalidated successfully' }));
    } catch (error) {
      console.error('Error invalidating bundle:', error);
      res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: 'Internal server error' }));
    }
  })();
});

// Register attendance routes
// This function (exported as default from your attendanceRoutes module) registers all attendance endpoints.
attendanceRoutes(app);

// 404 handler
app.any('/*', (res: UWSHttpResponse, req: UWSHttpRequest) => {
  res.writeStatus('404 Not Found').end('Sorry, that route does not exist.');
});

// Start the server
app.listen(PORT, async (token: any) => {
  if (token) {
    console.log(`Server running on port ${PORT}`);

    try {
      // Initialize your database connection
      await dataSource.initialize();
      console.log('Connected to the database successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  } else {
    console.log(`Failed to listen on port ${PORT}`);
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
