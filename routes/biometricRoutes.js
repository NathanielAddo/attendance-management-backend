import express from 'express';
import { registerVoice, registerImage, updateVoice, updateImage } from '../controllers/biometricController.js';

const router = express.Router();

router.post('/voice-register', registerVoice);
router.post('/image-register', registerImage);
router.put('/voice-register', updateVoice);
router.put('/image-register', updateImage);

export default router;

