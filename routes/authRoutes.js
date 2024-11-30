import express from 'express';
import { login, renewToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/token-renewal', renewToken);

export default router;

