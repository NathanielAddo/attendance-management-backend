import uWS from 'uWebSockets.js';
import { authenticate } from '../middlewares/auth.middleware';
import { getNotifications, createNotification, updateNotification, deleteNotification, sendNotification } from '../controllers/notificationController.js';

const app = uWS.App();

app.get('/notifications', (res, req) => {
    authenticate(req, res, () => getNotifications(req, res));
});

app.post('/notifications', (res, req) => {
    authenticate(req, res, () => createNotification(req, res));
});

app.put('/notifications/:id', (res, req) => {
    authenticate(req, res, () => updateNotification(req, res));
});

app.del('/notifications/:id', (res, req) => {
    authenticate(req, res, () => deleteNotification(req, res));
});

app.post('/notifications/send', (res, req) => {
    authenticate(req, res, () => sendNotification(req, res));
});

app.listen(3000, (token) => {
    if (token) {
        console.log('Listening to port 3000');
    } else {
        console.log('Failed to listen to port 3000');
    }
});
