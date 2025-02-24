// attendanceRoutes.ts

import uWS from 'uwebsockets.js';
import {
  createSchedule,
  clockInIndividual,
  clockInBulk,
  clockOutIndividual
} from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth.middleware';

const app = uWS.App();

// Middleware to handle authentication
const authMiddleware = (res, req, next) => {
  authenticate(req, res, next);
};

// Schedule routes
app.post('/schedules', (res, req) => {
  authMiddleware(res, req, () => createSchedule(req, res));
});

// Individual attendance routes
app.post('/schedules/:scheduleId/clock-in', (res, req) => {
  authMiddleware(res, req, () => clockInIndividual(req, res));
});

app.post('/schedules/:scheduleId/clock-out', (res, req) => {
  authMiddleware(res, req, () => clockOutIndividual(req, res));
});

// Bulk attendance routes
app.post('/schedules/:scheduleId/clock-in/bulk', (res, req) => {
  authMiddleware(res, req, () => clockInBulk(req, res));
});
