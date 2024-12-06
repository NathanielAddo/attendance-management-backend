import { pool } from '../db.js';

const getAttendees = async (req, res) => {
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

const getAbsentees = async (req, res) => {
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

const clockIn = async (req, res) => {
  const { scheduleId } = req.params;
  const { userId, timestamp, location, deviceInfo } = req.body;

  try {
    // Extract time from the timestamp for clock_in_time
    const { rows } = await pool.query(
      `
      INSERT INTO attendance 
        (user_id, schedule_id, clock_in_time, location, device_info) 
      VALUES 
        ($1, $2, $3::TIME, $4, $5) 
      RETURNING *
      `,
      [userId, scheduleId, new Date(timestamp).toLocaleTimeString(), location ? JSON.stringify(location) : '{}', JSON.stringify(deviceInfo)]
    );
    res.status(201).json({ success: true, message: 'User clocked in successfully.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const validateClockIn = async (req, res) => {
  const { scheduleId } = req.params;
  const { timestamp } = req.body;
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
    
    return res.json({ success: true, data: { allowed: true, reason: null } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clockOut = async (req, res) => {
  const { scheduleId } = req.params;
  const { userId, timestamp, location, deviceInfo } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance SET clock_out_time = $1, location = $2, device_info = $3 WHERE user_id = $4 AND schedule_id = $5 RETURNING *',
      [timestamp, location ? JSON.stringify(location) : null, JSON.stringify(deviceInfo), userId, scheduleId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }
    res.json({ success: true, message: 'User clocked out successfully.', data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validateClockOut = async (req, res) => {
  const { scheduleId } = req.params;
  const { timestamp } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM schedules WHERE id = $1', [scheduleId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    const schedule = rows[0];
    const clockOutLimit = new Date(schedule.clock_out_limit);
    const clockOutTime = new Date(timestamp);
    
    if (clockOutTime > clockOutLimit) {
      return res.json({ success: true, data: { allowed: false, reason: 'Clock-out time exceeded limit' } });
    }
    
    // Add additional validation logic here (e.g., location check)
    
    return res.json({ success: true, data: { allowed: true, reason: null } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClockingRecords = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM attendance WHERE schedule_id = $1',
      [scheduleId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserClockingRecord = async (req, res) => {
  const { scheduleId, userId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM attendance WHERE schedule_id = $1 AND user_id = $2',
      [scheduleId, userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Clocking record not found' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportClockingRecords = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM attendance WHERE schedule_id = $1',
      [scheduleId]
    );
    // Convert rows to CSV or any other format
    const csv = rows.map(row => Object.values(row).join(',')).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment(`clocking_records_${scheduleId}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAttendees,
  getAbsentees,
  clockIn,
  validateClockIn,
  clockOut,
  validateClockOut,
  getClockingRecords,
  getUserClockingRecord,
  exportClockingRecords
};
