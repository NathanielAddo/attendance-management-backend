import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
  device?: { deviceId: string };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM devices WHERE username = $1', [username]);
    if (rows.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const device = rows[0];
    const isValid = await bcrypt.compare(password, device.password);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ deviceId: device.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ success: true, message: 'Authentication successful.', token, expiresIn: 3600 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renewToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const { deviceId } = req.device!;
  try {
    const token = jwt.sign({ deviceId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ success: true, message: 'Token renewed successfully.', newToken: token, expiresIn: 3600 });
  } catch (error) {
    res.status(401).json({ message: 'Token renewal failed' });
  }
};
