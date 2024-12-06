const express = require('express');
const { login, renewToken } = require('../controllers/authController');

const router = express.Router();

router.post('/login', (req, res) => login(req, res));
router.post('/token-renewal', (req, res) => renewToken(req, res));

module.exports = router;
