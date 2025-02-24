import { App } from 'uWebSockets.js';
import { authenticate } from '../middlewares/auth.middleware';
import { getEvents, createEvent, updateEvent, deleteEvent, bulkCreateEvents } from '../controllers/eventController.js';

const app = App();

app.get('/*', (res, req) => {
    authenticate(req, res, () => getEvents(req, res));
});

app.post('/:userId', (res, req) => {
    authenticate(req, res, () => createEvent(req, res));
});

app.post('/bulk', (res, req) => {
    authenticate(req, res, () => bulkCreateEvents(req, res));
});

app.put('/:id', (res, req) => {
    authenticate(req, res, () => updateEvent(req, res));
});

app.del('/:id', (res, req) => {
    authenticate(req, res, () => deleteEvent(req, res));
});