import uWS from 'uWebSockets.js';
import { authenticate } from '../middlewares/auth.middleware';
import { getSchedules, getClockInLimit } from '../controllers/scheduleController.js';

const app = uWS.App();

app.get('/', (res, req) => {
    authenticate(req, res, () => getSchedules(req, res));
});

app.get('/:scheduleId/clock-in-limit', (res, req) => {
    authenticate(req, res, () => getClockInLimit(req, res));
});

