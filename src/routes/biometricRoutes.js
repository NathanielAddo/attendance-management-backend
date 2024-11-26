const express = require('express');
const biometricController = require('../controllers/biometricController');

const router = express.Router();

router.post('/voice', biometricController.registerVoice);
router.post('/image', biometricController.registerImage);
router.get('/users', biometricController.getBiometricUsers);
router.put('/users/:id', biometricController.updateBiometricUser);
router.delete('/users/:id', biometricController.deleteBiometricUser);

module.exports = router;
