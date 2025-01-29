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

interface Location {
  latitude: number;
  longitude: number;
}

interface DeviceInfo {
  deviceName: string;
  deviceId: string;
}

// Clock in for an individual
const clockInIndividual = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId, userId, location, deviceInfo } = req.body as {
    scheduleId: number;
    userId: number;
    location: Location;
    deviceInfo: DeviceInfo;
  };

  try {
    const result = await pool.query(
      `
      INSERT INTO attendance_attendance (schedule_id, user_id, clock_in_time, location, device_info)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
      ON CONFLICT (schedule_id, user_id) DO UPDATE
      SET clock_in_time = EXCLUDED.clock_in_time
      RETURNING *;
      `,
      [scheduleId, userId, location, deviceInfo]
    );

    res.json({
      success: true,
      message: 'User clocked in successfully.',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Clock in for multiple users
const clockInBulk = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId, users } = req.body;

  try {
    const values = users.map(
      (user: { userId: number; location: Location; deviceInfo: DeviceInfo }) => 
        `(${scheduleId}, ${user.userId}, CURRENT_TIMESTAMP, '${JSON.stringify(user.location)}', '${JSON.stringify(user.deviceInfo)}')`
    ).join(',');

    const query = `
      INSERT INTO attendance_attendance (schedule_id, user_id, clock_in_time, location, device_info)
      VALUES ${values}
      ON CONFLICT (schedule_id, user_id) DO UPDATE
      SET clock_in_time = EXCLUDED.clock_in_time;
    `;

    await pool.query(query);

    res.json({
      success: true,
      message: 'Users clocked in successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Clock out for an individual
const clockOutIndividual = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId, userId } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE attendance_attendance
      SET clock_out_time = CURRENT_TIMESTAMP
      WHERE schedule_id = $1 AND user_id = $2
      RETURNING *;
      `,
      [scheduleId, userId]
    );

    res.json({
      success: true,
      message: 'User clocked out successfully.',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Clock out for multiple users
const clockOutBulk = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId, userIds } = req.body;

  try {
    const query = `
      UPDATE attendance_attendance
      SET clock_out_time = CURRENT_TIMESTAMP
      WHERE schedule_id = $1 AND user_id = ANY($2::int[]);
    `;

    await pool.query(query, [scheduleId, userIds]);

    res.json({
      success: true,
      message: 'Users clocked out successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all attendees
const getAttendees = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params;

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      `
      SELECT a.user_id, u.name, a.status
      FROM attendance_attendance a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.schedule_id = $1;
      `,
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

// Get all absentees
const getAbsentees = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params;

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      `
      SELECT u.user_id, u.name
      FROM users u
      LEFT JOIN attendance_attendance a ON u.user_id = a.user_id AND a.schedule_id = $1
      WHERE a.user_id IS NULL;
      `,
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

// Get all clocked-in users for a schedule
const getClockedInUsers = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params;

  try {
    const { rows }: { rows: AttendanceRecord[] } = await pool.query(
      `
      SELECT a.user_id, u.name, a.clock_in_time
      FROM attendance_attendance a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.schedule_id = $1 AND a.clock_in_time IS NOT NULL
      ORDER BY a.clock_in_time ASC;
      `,
      [scheduleId]
    );

    res.json({
      success: true,
      message: 'Fetched all clocked-in users successfully.',
      data: rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Export attendance data
const exportClockingRecords = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT u.name, a.clock_in_time, a.clock_out_time, a.status
      FROM attendance_attendance a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.schedule_id = $1;
      `,
      [scheduleId]
    );

    res.json({
      success: true,
      message: 'Attendance records exported successfully.',
      data: rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Export all methods
export {
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
  clockOutBulk,
  getAttendees,
  getAbsentees,
  getClockedInUsers,
  exportClockingRecords,
};
