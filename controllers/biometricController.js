import { pool } from '../db.js';

export const registerVoice = async (req, res) => {
  const { voiceData } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO biometric_data (user_id, voice_data) VALUES ($1, $2) RETURNING *',
      [userId, voiceData]
    );
    res.status(201).json({ message: 'Voice registered successfully.', voiceId: rows[0].id, uploadedAt: rows[0].created_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerImage = async (req, res) => {
  const { imageData } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO biometric_data (user_id, image_data) VALUES ($1, $2) RETURNING *',
      [userId, imageData]
    );
    res.status(201).json({ message: 'Image registered successfully.', imageId: rows[0].id, uploadedAt: rows[0].created_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVoice = async (req, res) => {
  const { voiceData } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'UPDATE biometric_data SET voice_data = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [voiceData, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Voice sample not found' });
    }
    res.json({ message: 'Voice updated successfully.', voiceId: rows[0].id, updatedAt: rows[0].updated_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateImage = async (req, res) => {
  const { imageData } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'UPDATE biometric_data SET image_data = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [imageData, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile image not found' });
    }
    res.json({ message: 'Image updated successfully.', imageId: rows[0].id, updatedAt: rows[0].updated_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

