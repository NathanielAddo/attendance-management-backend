import { Request, Response } from 'express';
import { pool } from '../db';

// Helper function to validate latitude and longitude
const isValidLocation = (location: { latitude: number; longitude: number }): boolean => {
  return !isNaN(location.latitude) && !isNaN(location.longitude);
};

// Clock in for an individual user
const clockInIndividual = async (req: Request, res: Response): Promise<Response> => {
  const { scheduleId, userId, location, deviceInfo } = req.body;

  // Validate the location (latitude and longitude)
  if (!isValidLocation(location)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid location: Latitude or longitude is not a valid number.',
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO attendance_attendance (schedule_id, user_id, clock_in_time, coordinates, device_info)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
      ON CONFLICT (schedule_id, user_id) DO UPDATE
      SET clock_in_time = EXCLUDED.clock_in_time
      RETURNING *;
      `,
      [scheduleId, userId, JSON.stringify(location), JSON.stringify(deviceInfo)]
    );

    return res.json({
      success: true,
      message: 'User clocked in successfully.',
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Clock in for multiple users (Bulk)
const clockInBulk = async (req: Request, res: Response): Promise<Response> => {
  const { scheduleId, users } = req.body;

  // Validate locations for all users
  for (const user of users) {
    if (!isValidLocation(user.location)) {
      return res.status(400).json({
        success: false,
        error: `Invalid location value for user ${user.userId}.`,
      });
    }
  }

  try {
    const values = users
      .map(
        (user: { userId: number; location: { latitude: number; longitude: number }; deviceInfo: any }) =>
          `(${scheduleId}, ${user.userId}, CURRENT_TIMESTAMP, '${JSON.stringify(user.location)}', '${JSON.stringify(user.deviceInfo)}')`
      )
      .join(',');

    const query = `
      INSERT INTO attendance_attendance (schedule_id, user_id, clock_in_time, coordinates, device_info)
      VALUES ${values}
      ON CONFLICT (schedule_id, user_id) DO UPDATE
      SET clock_in_time = EXCLUDED.clock_in_time;
    `;

    await pool.query(query);

    return res.json({
      success: true,
      message: 'Users clocked in successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Clock out for an individual user
const clockOutIndividual = async (req: Request, res: Response): Promise<Response> => {
  const { userId, scheduleId, location, deviceInfo } = req.body;

  // Check if location is defined and has latitude and longitude properties
  if (!location || typeof location.latitude === 'undefined' || typeof location.longitude === 'undefined') {
    return res.status(400).json({
      success: false,
      error: 'Invalid location: Latitude or longitude is missing.',
    });
  }

  // Validate location (latitude and longitude)
  if (!isValidLocation(location)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid location: Latitude or longitude is not a valid number.',
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE attendance_attendance
      SET clock_out_time = CURRENT_TIMESTAMP, coordinates = $3, device_info = $4
      WHERE user_id = $1 AND schedule_id = $2
      RETURNING *;
      `,
      [userId, scheduleId, JSON.stringify(location), JSON.stringify(deviceInfo)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User clocked out successfully.',
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
};
