import express from 'express';
import { getBiometricData, createBiometricData, updateBiometricData, deleteBiometricData } from '../controllers/biometricController.js';

const router = express.Router();

router.get('/:userId', getBiometricData);
router.post('/', createBiometricData);
router.put('/:userId', updateBiometricData);
router.delete('/:userId', deleteBiometricData);

export default router;

