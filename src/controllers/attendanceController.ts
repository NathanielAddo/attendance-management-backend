// attendanceController.ts
import { dataSource } from "../db";
import uWS, { HttpResponse, HttpRequest } from "uWebSockets.js";

// Use our own alias types for convenience.
type UWSHttpResponse = any;
type UWSHttpRequest = any;
type UWSApp = ReturnType<typeof uWS.App>;

/**
 * Helper function to read and parse the JSON request body in uWS.
 * Note: The parameters must be in the order (res, req) as required by uWS.
 */
function getRequestBody(res: uWS.HttpResponse, req: uWS.HttpRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    // req is assumed to have onData method for receiving the body.
    req.onData((chunk: ArrayBuffer, isLast: boolean) => {
      body += Buffer.from(chunk).toString();
      if (isLast) {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (err) {
          res.writeStatus('400 Bad Request').end('Invalid JSON');
          reject(new Error("Invalid JSON"));
        }
      }
    });
    // IMPORTANT: Use res.onAborted (not req.onAborted) to handle aborted requests.
    res.onAborted(() => {
      reject(new Error("Request aborted"));
    });
  });
}

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

// Helper function to validate clock-in time
const validateClockInTime = (schedule: any) => {
  const now = new Date();
  const clockInTime = new Date(schedule.clock_in_time);
  if (now < clockInTime) {
    throw new Error('Clock-in time is not valid.');
  }
};

// Helper function to validate schedule details on creation
const validateScheduleDetails = (scheduleDetails: any) => {
  const { attendanceScheduleName, country, branch } = scheduleDetails;
  if (!attendanceScheduleName || !Array.isArray(country) || !Array.isArray(branch)) {
    throw new Error('Invalid schedule details');
  }
};

// Create a new schedule
const createSchedule = async (res: uWS.HttpResponse, req: uWS.HttpRequest) => {
  try {
    // Note: Passing (res, req) is critical.
    const body = await getRequestBody(res, req);
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
      unlimitedShadow // when true the schedule never “expires”
    } = body;

    // Validate schedule details
    validateScheduleDetails(body);

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

// Clock in for an individual user
const clockInIndividual = async (res: uWS.HttpResponse, req: uWS.HttpRequest) => {
  try {
    const body = await getRequestBody(res, req);
    const { scheduleId, userId, location, deviceInfo } = body;

    if (!isValidLocation(location)) {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: 'Invalid location: Latitude or longitude is not a valid number.',
      }));
      return;
    }

    const schedule = await getScheduleById(scheduleId);
    validateClockInTime(schedule);

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

// Clock in for multiple users (Bulk)
const clockInBulk = async (res: uWS.HttpResponse, req: uWS.HttpRequest) => {
  try {
    const body = await getRequestBody(res, req);
    const { scheduleId, users } = body;

    for (const user of users) {
      if (!isValidLocation(user.location)) {
        res.writeStatus('400 Bad Request').end(JSON.stringify({
          success: false,
          error: `Invalid location value for user ${user.userId}.`,
        }));
        return;
      }
    }

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

// Clock out for an individual user
const clockOutIndividual = async (res: UWSHttpResponse, req: UWSHttpRequest) => {
  try {
    const body = await getRequestBody(res, req);
    const { userId, scheduleId, location, deviceInfo } = body;

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
    const schedule = await getScheduleById(scheduleId);

    if (!schedule.unlimited_shadow) {
      const allowedDeadline = new Date(
        clockInTime.getTime() + (parseInt(schedule.schedule_span, 10) || 1) * 24 * 60 * 60 * 1000
      );
      const now = new Date();
      if (now > allowedDeadline) {
        res.writeStatus('400 Bad Request').end(JSON.stringify({
          success: false,
          error: 'Clock out period has expired.',
        }));
        return;
      }
    }

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
