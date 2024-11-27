import { pool } from '../db.js';

export const getAttendance = async (req, res) => {
  const { startDate, endDate, userType, country, branch, category, group, subgroup, location, gender, schedule, status } = req.query;
  try {
    let query = 'SELECT a.*, u.name, u.image_url FROM attendance a JOIN users u ON a.user_id = u.id WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    if (startDate && endDate) {
      query += ` AND a.date BETWEEN $${valueIndex++} AND $${valueIndex++}`;
      values.push(startDate, endDate);
    }
    if (userType) {
      query += ` AND u.role = $${valueIndex++}`;
      values.push(userType);
    }
    if (country) {
      query += ` AND u.country = $${valueIndex++}`;
      values.push(country);
    }
    if (branch) {
      query += ` AND u.branch = $${valueIndex++}`;
      values.push(branch);
    }
    if (category) {
      query += ` AND u.category = $${valueIndex++}`;
      values.push(category);
    }
    if (group) {
      query += ` AND u.group_name = $${valueIndex++}`;
      values.push(group);
    }
    if (subgroup) {
      query += ` AND u.subgroup = $${valueIndex++}`;
      values.push(subgroup);
    }
    if (location) {
      query += ` AND a.location = $${valueIndex++}`;
      values.push(location);
    }
    if (gender) {
      query += ` AND u.gender = $${valueIndex++}`;
      values.push(gender);
    }
    if (schedule) {
      query += ` AND a.schedule = $${valueIndex++}`;
      values.push(schedule);
    }
    if (status) {
      query += ` AND a.status = $${valueIndex++}`;
      values.push(status);
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttendanceStats = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const query = `
      SELECT 
        COUNT(*) as total_employees,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_arrivals,
        SUM(CASE WHEN status = 'On Time' THEN 1 ELSE 0 END) as on_time,
        SUM(CASE WHEN status = 'Early Departure' THEN 1 ELSE 0 END) as early_departures,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'Time Off' THEN 1 ELSE 0 END) as time_off
      FROM attendance
      WHERE date BETWEEN $1 AND $2
    `;
    const { rows } = await pool.query(query, [startDate, endDate]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAttendance = async (req, res) => {
  const { user_id, date, clock_in, clock_out, status, location, coordinates, landmark, clocked_by } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance (user_id, date, clock_in, clock_out, status, location, coordinates, landmark, clocked_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [user_id, date, clock_in, clock_out, status, location, coordinates, landmark, clocked_by]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { user_id, date, clock_in, clock_out, status, location, coordinates, landmark, clocked_by } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance SET user_id = $1, date = $2, clock_in = $3, clock_out = $4, status = $5, location = $6, coordinates = $7, landmark = $8, clocked_by = $9 WHERE id = $10 RETURNING *',
      [user_id, date, clock_in, clock_out, status, location, coordinates, landmark, clocked_by, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM attendance WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkClockIn = async (req, res) => {
  const { userIds, date, time, reason } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const userId of userIds) {
        await client.query(
          'INSERT INTO attendance (user_id, date, clock_in, status, clocked_by) VALUES ($1, $2, $3, $4, $5)',
          [userId, date, time, 'On Time', 'Admin']
        );
      }
      await client.query('COMMIT');
      res.status(201).json({ message: 'Bulk clock-in successful' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkClockOut = async (req, res) => {
  const { userIds, date, time, reason } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const userId of userIds) {
        await client.query(
          'UPDATE attendance SET clock_out = $1, clocked_by = $2 WHERE user_id = $3 AND date = $4',
          [time, 'Admin', userId, date]
        );
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Bulk clock-out successful' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkCancel = async (req, res) => {
  const { userIds, date, reason } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const userId of userIds) {
        await client.query(
          'DELETE FROM attendance WHERE user_id = $1 AND date = $2',
          [userId, date]
        );
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Bulk cancellation successful' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

