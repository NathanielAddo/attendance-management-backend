// src/routes/attendanceRoutes.ts
import uWS, { App } from 'uWebSockets.js';
import {
  createSchedule,
  clockInIndividual,
  clockInBulk,
  clockOutIndividual
} from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth.middleware';


const app = App();

// Define types for request and response; replace 'any' with proper types if available.
type UWSHttpResponse = any;
type UWSHttpRequest = any;
type UWSApp = ReturnType<typeof uWS.App>;

/**
 * Registers attendance-related routes on the provided app instance.
 */
export default function attendanceRoutes(app: UWSApp): void {
  const authMiddleware = (res: UWSHttpResponse, req: UWSHttpRequest, next: () => void) => {
    authenticate(req, res);
    next();
  };

  // Schedule route: Create a new schedule
  app.post('/schedules', (res: UWSHttpResponse, req: UWSHttpRequest) => {
    authMiddleware(res, req, () => createSchedule(req, res));
  });

  // Individual attendance route: Clock in for a single user
  app.post('/schedules/:scheduleId/clock-in', (res: UWSHttpResponse, req: UWSHttpRequest) => {
    authMiddleware(res, req, () => clockInIndividual(req, res));
  });

  // Individual attendance route: Clock out for a single user
  app.post('/schedules/:scheduleId/clock-out', (res: UWSHttpResponse, req: UWSHttpRequest) => {
    authMiddleware(res, req, () => clockOutIndividual(req, res));
  });

  // Bulk attendance route: Clock in for multiple users
  app.post('/schedules/:scheduleId/clock-in/bulk', (res: UWSHttpResponse, req: UWSHttpRequest) => {
    authMiddleware(res, req, () => clockInBulk(req, res));
  });
}
