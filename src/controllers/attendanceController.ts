import { Request, Response } from 'express';
import { pool } from '../db';

interface AttendanceRecord {
  user_id: number;
  name: string;
  status?: string;
  clock_in_time?: string;
  clock_out_time?: string;
  reason?: string;
}

interface Attendee {
  user_id: number;
  name: string;
  status?: string;
  clock_in_time?: string;
  clock_out_time?: string;
}

interface Schedule {
  id: string;
  clock_in_limit: string;
  clock_out_limit: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface DeviceInfo {
  deviceName: string;
  deviceId: string;
}

interface Absentee {
  user_id: number;
  name: string;
  reason?: string;
}

const getAttendees = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };
  const { date, status } = req.query as { date: string; status?: string };

  try {
    let query = `
      SELECT u.id as user_id, u.name, a.status, a.clock_in_time, a.clock_out_time
      FROM attendance_attendance_users u
      LEFT JOIN attendance_attendance a ON u.id = a.user_id AND a.schedule_id = $1 AND a.date = $2
      WHERE u.id IN (SELECT user_id FROM attendance_attendance_schedule_participants WHERE schedule_id = $1)
    `;
    const values: (string | undefined)[] = [scheduleId, date];

    if (status) {
      query += ' AND a.status = $3';
      values.push(status);
    }

    const { rows }: { rows: Attendee[] } = await pool.query(query, values);

    res.json({
      success: true,
      data: {
        scheduleId,
        date,
        attendees: rows,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAbsentees = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };
  const { date } = req.query as { date: string };

  try {
    const query = `
      SELECT u.id as user_id, u.name, a.reason
      FROM attendance_attendance_users u
      LEFT JOIN attendance_attendance a ON u.id = a.user_id AND a.schedule_id = $1 AND a.date = $2
      WHERE u.id IN (SELECT user_id FROM attendance_attendance_schedule_participants WHERE schedule_id = $1)
      AND (a.status IS NULL OR a.status = 'Absent')
    `;
    const { rows }: { rows: Absentee[] } = await pool.query(query, [scheduleId, date]);

    res.json({
      success: true,
      data: {
        scheduleId,
        date,
        absentees: rows,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const clockIn = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };
  const { userId, timestamp, location, deviceInfo } = req.body as {
    userId: number;
    timestamp: string;
    location?: { latitude: number; longitude: number };
    deviceInfo: { deviceName: string; deviceId: string };
  };

  try {
    // Extract time from the timestamp
    const clockInTime = new Date(timestamp).toLocaleTimeString();

    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      `
      INSERT INTO attendance_attendance 
        (user_id, schedule_id, clock_in_time, location, device_info) 
      VALUES 
        ($1, $2, $3::TIME, $4, $5) 
      RETURNING *
      `,
      [
        userId,
        scheduleId,
        clockInTime,
        location ? JSON.stringify(location) : '{}',
        JSON.stringify(deviceInfo),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'User clocked in successfully.',
      data: rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const validateClockIn = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };
  const { timestamp } = req.body as { timestamp: string };

  try {
    // Query the schedule by ID
    const { rows }: { rows: Schedule[] } = await pool.query(
      'SELECT * FROM attendance_attendance_schedules WHERE id = $1',
      [scheduleId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }

    const schedule = rows[0];
    const clockInLimit = new Date(schedule.clock_in_limit);
    const clockInTime = new Date(timestamp);

    if (clockInTime > clockInLimit) {
      res.json({
        success: true,
        data: {
          allowed: false,
          reason: 'Clock-in time exceeded limit',
        },
      });
      return;
    }

    // Add additional validation logic here (e.g., location check, user eligibility)

    res.json({
      success: true,
      data: {
        allowed: true,
        reason: null,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const clockOut = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };
  const { userId, timestamp, location, deviceInfo } = req.body as {
    userId: number;
    timestamp: string;
    location?: { latitude: number; longitude: number };
    deviceInfo: { deviceName: string; deviceId: string };
  };

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      `
      UPDATE attendance_attendance 
      SET clock_out_time = $1, location = $2, device_info = $3 
      WHERE user_id = $4 AND schedule_id = $5 
      RETURNING *
      `,
      [
        timestamp,
        location ? JSON.stringify(location) : null,
        JSON.stringify(deviceInfo),
        userId,
        scheduleId,
      ]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'User clocked out successfully.',
      data: rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const validateClockOut = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };
  const { timestamp } = req.body as { timestamp: string };

  try {
    // Fetch schedule details from the database
    const { rows }: { rows: Schedule[] } = await pool.query(
      'SELECT * FROM attendance_attendance_schedules WHERE id = $1',
      [scheduleId]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
      return;
    }

    const schedule = rows[0];
    const clockOutLimit = new Date(schedule.clock_out_limit);
    const clockOutTime = new Date(timestamp);

    if (isNaN(clockOutTime.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid timestamp format',
      });
      return;
    }

    // Validate clock-out time against the limit
    if (clockOutTime > clockOutLimit) {
      res.json({
        success: true,
        data: {
          allowed: false,
          reason: 'Clock-out time exceeded limit',
        },
      });
      return;
    }

    // Additional validation logic can be added here (e.g., location validation)

    res.json({
      success: true,
      data: {
        allowed: true,
        reason: null,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getClockingRecords = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      'SELECT * FROM attendance_attendance WHERE schedule_id = $1',
      [scheduleId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getUserClockingRecord = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId, userId } = req.params as { scheduleId: string; userId: string };

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      'SELECT * FROM attendance_attendance WHERE schedule_id = $1 AND user_id = $2',
      [scheduleId, userId]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Clocking record not found',
      });
      return;
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const exportClockingRecords = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      'SELECT * FROM attendance_attendance WHERE schedule_id = $1',
      [scheduleId]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No clocking records found for the given schedule',
      });
      return;
    }

    // Generate CSV header
    const headers = Object.keys(rows[0]).join(',');

    // Convert rows to CSV format
    const csvRows = rows.map(row =>
      Object.values(row)
        .map(value => (value !== null ? `"${value}"` : ''))
        .join(',')
    );
    const csv = [headers, ...csvRows].join('\n');

    // Set response headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment(`clocking_records_${scheduleId}.csv`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
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
