import express from 'express';
import { registerVoice, registerImage, updateVoice, updateImage } from '../controllers/biometricController.js';
import { authenticate } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/voice-register', authenticate, (req, res) => registerVoice(req, res));
router.post('/image-register', authenticate, (req, res) => registerImage(req, res));
router.put('/voice-register', authenticate, (req, res) => updateVoice(req, res));
router.put('/image-register', authenticate, (req, res) => updateImage(req, res));

export default router;
