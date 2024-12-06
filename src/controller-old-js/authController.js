import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM devices WHERE username = $1', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const device = rows[0];
    const isValid = await bcrypt.compare(password, device.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ deviceId: device.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, message: 'Authentication successful.', token, expiresIn: 3600 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renewToken = async (req, res) => {
  const { deviceId } = req.device; // Assuming middleware attaches device info to req
  try {
    const token = jwt.sign({ deviceId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, message: 'Token renewed successfully.', newToken: token, expiresIn: 3600 });
  } catch (error) {
    res.status(401).json({ message: 'Token renewal failed' });
  }
};

