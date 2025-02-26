// attendanceController.ts

import { App } from 'uWebSockets.js';
import { dataSource } from "../db";

// Helper to get a schedule by ID
const getScheduleById = async (scheduleId: number) => {
  const scheduleResult = await dataSource.query(
    `SELECT * FROM attendance_schedules WHERE id = $1`,
    [scheduleId]
  );
  if (scheduleResult.rowCount === 0) {
    throw new Error('Schedule not found');
  }
  return scheduleResult.rows[0];
};

// Helper function to validate latitude and longitude
const isValidLocation = (location: { latitude: number; longitude: number }): boolean => {
  return !isNaN(location.latitude) && !isNaN(location.longitude);
};

// Helper to get today’s date string in YYYY-MM-DD format
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to validate schedule details on creation
const validateScheduleDetails = (scheduleDetails: any) => {
  const {
    attendanceScheduleName,
    country,
    branch,
    // … other validations
  } = scheduleDetails;

  if (!attendanceScheduleName || !Array.isArray(country) || !Array.isArray(branch)) {
    throw new Error('Invalid schedule details');
  }

  // Continue validating other fields as needed...
};

// Create a new schedule – note the addition of unlimitedShadow
const createSchedule = async (res: any, req: any) => {
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
    monthlyMinClockingOccurrences,
    unlimitedShadow // NEW FIELD: when true the schedule never “expires”
  } = JSON.parse(req.body);

  try {
    validateScheduleDetails(JSON.parse(req.body));

    const result = await dataSource.query(
      `
      INSERT INTO attendance_schedules (
        attendance_schedule_name,
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
        monthly_min_clocking_occurrences,
        unlimited_shadow
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *;
      `,
      [
        attendanceScheduleName,
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
        monthlyMinClockingOccurrences,
        unlimitedShadow
      ]
    );

    res.writeStatus('200 OK').end(JSON.stringify({
      success: true,
      message: 'Schedule created successfully.',
      data: result.rows[0]
    }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
};

/**
 * Validate that (unless the schedule is unlimited) the current time
 * falls within the allowed clock-in window.
 * 
 * For non-unlimited schedules, we:
 *  - (Optionally) check that today is an allowed day (using recurringDays or nonRecurringDates).
 *  - Combine today’s date with schedule.clock_in_time (a string in "HH:mm" format).
 *  - Compute the allowed cutoff as scheduled start + lateTime (in minutes).
 */
const validateClockInTime = (schedule: any): void => {
  // If schedule is marked as unlimited, skip time validation
  if (schedule.unlimited_shadow) return;

  const now = new Date();
  const todayStr = getTodayDateString();

  // If recurring, check if today is allowed (assumes recurring_days stored as JSON array of numbers: 0 (Sun) to 6 (Sat))
  if (schedule.recurring) {
    const allowedDays: number[] = JSON.parse(schedule.recurring_days);
    if (!allowedDays.includes(now.getDay())) {
      throw new Error('This schedule is not active today.');
    }
  } else if (schedule.non_recurring_dates) {
    // For non-recurring schedules, expect an array of date strings ("YYYY-MM-DD")
    const allowedDates: string[] = JSON.parse(schedule.non_recurring_dates);
    if (!allowedDates.includes(todayStr)) {
      throw new Error('This schedule is not active on today’s date.');
    }
  }

  // Build the scheduled clock-in datetime using today’s date and clockInTime (expected format "HH:mm")
  const [hours, minutes] = schedule.clock_in_time.split(':').map((p: string) => parseInt(p, 10));
  const scheduledStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

  // Calculate the allowed cutoff time (clock_in_time + late_time in minutes)
  const allowedCutoff = new Date(scheduledStart.getTime() + (parseInt(schedule.late_time, 10) || 0) * 60000);

  if (now < scheduledStart) {
    throw new Error('Clock in not allowed yet. Please wait until the scheduled time.');
  }

  if (now > allowedCutoff) {
    throw new Error('Clock in period has closed.');
  }
};

// Clock in for an individual user (with new schedule validation logic)
const clockInIndividual = async (res: any, req: any) => {
  const { scheduleId, userId, location, deviceInfo } = JSON.parse(req.body);

  if (!isValidLocation(location)) {
    res.writeStatus('400 Bad Request').end(JSON.stringify({
      success: false,
      error: 'Invalid location: Latitude or longitude is not a valid number.',
    }));
    return;
  }

  try {
    // Fetch schedule details to enforce the allowed clock-in window.
    const schedule = await getScheduleById(scheduleId);
    validateClockInTime(schedule);

    // Proceed with clock in
    const result = await dataSource.query(
      `
      INSERT INTO attendance_attendance (schedule_id, user_id, clock_in_time, coordinates, device_info)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
      ON CONFLICT (schedule_id, user_id) DO UPDATE
      SET clock_in_time = EXCLUDED.clock_in_time
      RETURNING *;
      `,
      [scheduleId, userId, JSON.stringify(location), JSON.stringify(deviceInfo)]
    );

    res.writeStatus('200 OK').end(JSON.stringify({
      success: true,
      message: 'User clocked in successfully.',
      data: result.rows[0],
    }));
  } catch (error: any) {
    res.writeStatus('400 Bad Request').end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
};

// Clock in for multiple users (Bulk) – includes schedule validation
const clockInBulk = async (res: any, req: any) => {
  const { scheduleId, users } = JSON.parse(req.body);

  // Validate each user’s location
  for (const user of users) {
    if (!isValidLocation(user.location)) {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: `Invalid location value for user ${user.userId}.`,
      }));
      return;
    }
  }

  try {
    // Fetch schedule and enforce clock in window (applies for all users)
    const schedule = await getScheduleById(scheduleId);
    validateClockInTime(schedule);

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

    await dataSource.query(query);

    res.writeStatus('200 OK').end(JSON.stringify({
      success: true,
      message: 'Users clocked in successfully.',
    }));
  } catch (error: any) {
    res.writeStatus('400 Bad Request').end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
};

/**
 * For clocking out, we enforce that (unless the schedule is unlimited) the clock out
 * must occur within the meeting span period. Here we assume that schedule.schedule_span
 * represents the number of spans (each span equals 24 hours) after clock in within which
 * clock out must occur.
 */
const clockOutIndividual = async (res: any, req: any) => {
  const { userId, scheduleId, location, deviceInfo } = JSON.parse(req.body);

  if (!location || typeof location.latitude === 'undefined' || typeof location.longitude === 'undefined') {
    res.writeStatus('400 Bad Request').end(JSON.stringify({
      success: false,
      error: 'Invalid location: Latitude or longitude is missing.',
    }));
    return;
  }

  if (!isValidLocation(location)) {
    res.writeStatus('400 Bad Request').end(JSON.stringify({
      success: false,
      error: 'Invalid location: Latitude or longitude is not a valid number.',
    }));
    return;
  }

  try {
    // First, fetch the active attendance record (with no clock_out_time) for this user & schedule.
    const attendanceResult = await dataSource.query(
      `
      SELECT * FROM attendance_attendance
      WHERE user_id = $1 AND schedule_id = $2 AND clock_out_time IS NULL
      `,
      [userId, scheduleId]
    );

    if (attendanceResult.rowCount === 0) {
      res.writeStatus('404 Not Found').end(JSON.stringify({
        success: false,
        message: 'Active clock in record not found for clocking out.',
      }));
      return;
    }

    const attendanceRecord = attendanceResult.rows[0];
    const clockInTime = new Date(attendanceRecord.clock_in_time);

    // Fetch schedule details to get meeting span and unlimited flag.
    const schedule = await getScheduleById(scheduleId);

    // If schedule is not unlimited, enforce the meeting span limit.
    if (!schedule.unlimited_shadow) {
      // We assume schedule_span is the number of 24-hour spans allowed.
      const allowedDeadline = new Date(clockInTime.getTime() + (parseInt(schedule.schedule_span, 10) || 1) * 24 * 60 * 60 * 1000);
      const now = new Date();

      if (now > allowedDeadline) {
        res.writeStatus('400 Bad Request').end(JSON.stringify({
          success: false,
          error: 'Clock out period has expired.',
        }));
        return;
      }
    }

    // Proceed with updating the attendance record for clock out.
    const result = await dataSource.query(
      `
      UPDATE attendance_attendance
      SET clock_out_time = CURRENT_TIMESTAMP, coordinates = $3, device_info = $4
      WHERE user_id = $1 AND schedule_id = $2 AND clock_out_time IS NULL
      RETURNING *;
      `,
      [userId, scheduleId, JSON.stringify(location), JSON.stringify(deviceInfo)]
    );

    res.writeStatus('200 OK').end(JSON.stringify({
      success: true,
      message: 'User clocked out successfully.',
      data: result.rows[0],
    }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
};


export {
  createSchedule,
  clockInIndividual,
  clockInBulk,
  clockOutIndividual,
};