import uWS from 'uWebSockets.js';
import { registerVoice, registerImage, updateVoice, updateImage } from '../controllers/biometricController.js';
import { authenticate } from '../middlewares/auth.middleware';

const app = uWS.App();

app.post('/voice-register', (res, req) => {
    authenticate(req, res, () => {
        registerVoice(req, res);
    });
});

app.post('/image-register', (res, req) => {
    authenticate(req, res, () => {
        registerImage(req, res);
    });
});

app.put('/voice-register', (res, req) => {
    authenticate(req, res, () => {
        updateVoice(req, res);
    });
});

app.put('/image-register', (res, req) => {
    authenticate(req, res, () => {
        updateImage(req, res);
    });
});
