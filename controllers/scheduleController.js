import { pool } from '../db.js';

export const getSchedules = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM schedules');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO schedules (name, branch, start_time, closing_time, assigned_users, locations, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, branch, start_time, closing_time, assigned_users, locations, duration]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... (updateSchedule and deleteSchedule implementations)

export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE schedules SET name = $1, branch = $2, start_time = $3, closing_time = $4, assigned_users = $5, locations = $6, duration = $7 WHERE id = $8 RETURNING *',
      [name, branch, start_time, closing_time, assigned_users, locations, duration, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM schedules WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};