import express from 'express';
import { registerVoice, registerImage, updateVoice, updateImage } from '../controllers/biometricController.js';

const router = express.Router();

router.post('/voice-register', (req, res) => registerVoice(req, res));
router.post('/image-register', (req, res) => registerImage(req, res));
router.put('/voice-register', (req, res) => updateVoice(req, res));
router.put('/image-register', (req, res) => updateImage(req, res));

export default router;
