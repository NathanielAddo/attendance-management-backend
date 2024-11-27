import { pool } from '../db.js';

export const getBiometricData = async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM biometric_data WHERE user_id = $1', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Biometric data not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBiometricData = async (req, res) => {
  const { user_id, voice_data, image_data } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO biometric_data (user_id, voice_data, image_data) VALUES ($1, $2, $3) RETURNING *',
      [user_id, voice_data, image_data]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... (updateBiometricData and deleteBiometricData implementations)

