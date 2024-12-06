import { pool } from '../db.js';

export const getSchedules = async (req, res) => {
  const { date, branchId, scheduleType } = req.query;
  try {
    let query = 'SELECT * FROM schedules WHERE date = $1';
    const values = [date];
    let valueIndex = 2;

    if (branchId) {
      query += ` AND branch_id = $${valueIndex++}`;
      values.push(branchId);
    }
    if (scheduleType) {
      query += ` AND schedule_type = $${valueIndex++}`;
      values.push(scheduleType);
    }

    const { rows } = await pool.query(query, values);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClockInLimit = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const { rows } = await pool.query('SELECT id as schedule_id, title, date, clock_in_limit FROM schedules WHERE id = $1', [scheduleId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

