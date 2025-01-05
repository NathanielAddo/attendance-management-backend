import express from 'express';
import { registerVoice, registerImage, updateVoice, updateImage } from '../controllers/biometricController.js';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.post('/voice-register', verifyToken, (req, res) => registerVoice(req, res));
router.post('/image-register', verifyToken, (req, res) => registerImage(req, res));
router.put('/voice-register', verifyToken, (req, res) => updateVoice(req, res));
router.put('/image-register', verifyToken, (req, res) => updateImage(req, res));

export default router;
