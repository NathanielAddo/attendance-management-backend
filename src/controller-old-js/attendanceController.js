import { pool } from '../db.js';

export const getAttendees = async (req, res) => {
  const { scheduleId } = req.params;
  const { date, status } = req.query;
  try {
    let query = `
      SELECT u.id as user_id, u.name, a.status, a.clock_in_time, a.clock_out_time
      FROM users u
      LEFT JOIN attendance a ON u.id = a.user_id AND a.schedule_id = $1 AND a.date = $2
      WHERE u.id IN (SELECT user_id FROM schedule_participants WHERE schedule_id = $1)
    `;
    const values = [scheduleId, date];

    if (status) {
      query += ' AND a.status = $3';
      values.push(status);
    }

    const { rows } = await pool.query(query, values);
    res.json({ success: true, data: { scheduleId, date, attendees: rows } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAbsentees = async (req, res) => {
  const { scheduleId } = req.params;
  const { date } = req.query;
  try {
    const query = `
      SELECT u.id as user_id, u.name, a.reason
      FROM users u
      LEFT JOIN attendance a ON u.id = a.user_id AND a.schedule_id = $1 AND a.date = $2
      WHERE u.id IN (SELECT user_id FROM schedule_participants WHERE schedule_id = $1)
      AND (a.status IS NULL OR a.status = 'Absent')
    `;
    const { rows } = await pool.query(query, [scheduleId, date]);
    res.json({ success: true, data: { scheduleId, date, absentees: rows } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clockIn = async (req, res) => {
  const { scheduleId } = req.params;
  const { userId, timestamp, location, deviceInfo } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance (user_id, schedule_id, clock_in_time, location, device_info) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, scheduleId, timestamp, JSON.stringify(location), JSON.stringify(deviceInfo)]
    );
    res.status(201).json({ success: true, message: 'User clocked in successfully.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateClockIn = async (req, res) => {
  const { scheduleId } = req.params;
  const { userId, timestamp, location } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM schedules WHERE id = $1', [scheduleId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    const schedule = rows[0];
    const clockInLimit = new Date(schedule.clock_in_limit);
    const clockInTime = new Date(timestamp);
    
    if (clockInTime > clockInLimit) {
      return res.json({ success: true, data: { allowed: false, reason: 'Clock-in time exceeded limit' } });
    }
    
    // Add additional validation logic here (e.g., location check)
    
    res.json({ success: true, data: { allowed: true, reason: null } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Implement clockOut, validateClockOut, getClockingRecords, getUserClockingRecord, and exportClockingRecords similarly

