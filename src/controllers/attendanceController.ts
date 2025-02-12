import { Request, Response } from 'express';
import { pool } from '../db';

// Helper function to validate latitude and longitude
const isValidLocation = (location: { latitude: number; longitude: number }): boolean => {
  return !isNaN(location.latitude) && !isNaN(location.longitude);
};

// Helper function to validate schedule details
const validateScheduleDetails = (scheduleDetails: any) => {
  const {
    attendanceScheduleName,
    country,
    branch,
    scheduleCategory,
    scheduleSpan,
    clockInTime,
    clockOutTime,
    lateTime,
    setBreak,
    startBreakTime,
    endBreakTime,
    locationType,
    knownLocations,
    recurring,
    recurringDays,
    recurringDuration,
    nonRecurringDates,
    overtimeStatus,
    virtualMeeting,
    monthlyClockingOccurrences,
    monthlyMinClockingOccurrences
  } = scheduleDetails;

  // You can expand this function to add more specific validations as needed.
  if (!attendanceScheduleName || !Array.isArray(country) || !Array.isArray(branch)) {
    throw new Error('Invalid schedule details');
  }

  // Continue validating other fields similarly...
};

// Create a new schedule
const createSchedule = async (req: Request, res: Response): Promise<Response> => {
  const {
    attendanceScheduleName, // JSON field
    country,
    branch,
    scheduleCategory,
    scheduleSpan,
    clockInTime,
    clockOutTime,
    lateTime,
    setBreak,
    startBreakTime,
    endBreakTime,
    locationType,
    knownLocations,
    recurring,
    recurringDays,
    recurringDuration,
    nonRecurringDates,
    overtimeStatus,
    virtualMeeting,
    monthlyClockingOccurrences,
    monthlyMinClockingOccurrences
  } = req.body;

  try {
    // Validate the schedule details
    validateScheduleDetails(req.body);

    // Insert the schedule into the database
    const result = await pool.query(
      `
      INSERT INTO attendance_schedules (
        attendance_schedule_name,  -- Database column
        country, 
        branch, 
        schedule_category,
        schedule_span, 
        clock_in_time, 
        clock_out_time, 
        late_time, 
        set_break, 
        start_break_time, 
        end_break_time, 
        location_type, 
        known_locations, 
        recurring, 
        recurring_days, 
        recurring_duration, 
        non_recurring_dates, 
        overtime_status, 
        virtual_meeting, 
        monthly_clocking_occurrences, 
        monthly_min_clocking_occurrences
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *;
      `,
      [
        attendanceScheduleName, // JSON field mapped to database column
        JSON.stringify(country), 
        JSON.stringify(branch), 
        scheduleCategory,
        scheduleSpan,
        clockInTime,
        clockOutTime,
        lateTime,
        setBreak,
        startBreakTime,
        endBreakTime,
        locationType,
        JSON.stringify(knownLocations),
        recurring,
        JSON.stringify(recurringDays),
        recurringDuration,
        JSON.stringify(nonRecurringDates),
        overtimeStatus,
        virtualMeeting,
        monthlyClockingOccurrences,
        monthlyMinClockingOccurrences
      ]
    );

    return res.json({
      success: true,
      message: 'Schedule created successfully.',
      data: result.rows[0]
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Clock in for an individual user (Updated with new schedule ID logic)
const clockInIndividual = async (req: Request, res: Response): Promise<Response> => {
  const { scheduleId, userId, location, deviceInfo } = req.body;

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

// Clock in for multiple users (Bulk) - Updated
const clockInBulk = async (req: Request, res: Response): Promise<Response> => {
  const { scheduleId, users } = req.body;

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

  if (!location || typeof location.latitude === 'undefined' || typeof location.longitude === 'undefined') {
    return res.status(400).json({
      success: false,
      error: 'Invalid location: Latitude or longitude is missing.',
    });
  }

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
  createSchedule,
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
};
