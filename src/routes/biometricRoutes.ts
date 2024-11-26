import express from 'express';
import * as biometricController from '../controllers/biometricController';

const router = express.Router();

router.post('/voice', biometricController.registerVoice);
router.post('/image', biometricController.registerImage);
router.get('/users', biometricController.getBiometricUsers);
router.put('/users/:id', biometricController.updateBiometricUser);
router.delete('/users/:id', biometricController.deleteBiometricUser);

export default router;

