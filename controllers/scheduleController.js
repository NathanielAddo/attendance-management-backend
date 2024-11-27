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

