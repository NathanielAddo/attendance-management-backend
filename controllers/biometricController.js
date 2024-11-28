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

export const updateBiometricData = async (req, res) => {
  const { userId } = req.params;
  const { voice_data, image_data } = req.body;
  try {
    const { rowCount } = await pool.query(
      'UPDATE biometric_data SET voice_data = $1, image_data = $2 WHERE user_id = $3',
      [voice_data, image_data, userId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Biometric data not found' });
    }
    res.json({ message: 'Biometric data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBiometricData = async (req, res) => {
  const { userId } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM biometric_data WHERE user_id = $1', [userId]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Biometric data not found' });
    }
    res.json({ message: 'Biometric data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};