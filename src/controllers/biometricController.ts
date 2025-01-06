import { Request, Response } from 'express';
import { pool } from '../db.js';

interface User {
  id: number;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

const registerVoice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { voiceData } = req.body;
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance_biometric_data (user_id, voice_data) VALUES ($1, $2) RETURNING *',
      [userId, voiceData]
    );
    res.status(201).json({ message: 'Voice registered successfully.', voiceId: rows[0].id, uploadedAt: rows[0].created_at });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const registerImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { imageData } = req.body;
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance_biometric_data (user_id, image_data) VALUES ($1, $2) RETURNING *',
      [userId, imageData]
    );
    res.status(201).json({ message: 'Image registered successfully.', imageId: rows[0].id, uploadedAt: rows[0].created_at });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const updateVoice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { voiceData } = req.body;
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance_biometric_data SET voice_data = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [voiceData, userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Voice data not found' });
      return;
    }
    res.json({ message: 'Voice updated successfully.', voiceId: rows[0].id, updatedAt: rows[0].updated_at });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const updateImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { imageData } = req.body;
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance_biometric_data SET image_data = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [imageData, userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Image data not found' });
      return;
    }
    res.json({ message: 'Image updated successfully.', imageId: rows[0].id, updatedAt: rows[0].updated_at });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  registerVoice,
  registerImage,
  updateVoice,
  updateImage
};
