import { App } from 'uWebSockets.js';
import { authenticate } from '../middlewares/auth.middleware';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';

const app = App();

app.get('/*', (res, req) => {
    authenticate(req, res, () => getLocations(req, res));
});

app.post('/*', (res, req) => {
    authenticate(req, res, () => createLocation(req, res));
});

app.put('/*', (res, req) => {
    authenticate(req, res, () => updateLocation(req, res));
});

app.del('/*', (res, req) => {
    authenticate(req, res, () => deleteLocation(req, res));
});

app.listen(3000, (token) => {
    if (token) {
        console.log('Listening to port 3000');
    } else {
        console.log('Failed to listen to port 3000');
    }
});
