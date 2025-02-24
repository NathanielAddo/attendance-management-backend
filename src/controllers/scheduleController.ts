import { App } from 'uWebSockets.js';
import { pool } from '../db';

// Define interfaces for the returned data
interface Schedule {
  id: number;
  title: string;
  date: string; // Assuming the date is stored as a string in the format 'YYYY-MM-DD'
  branch_id: number | null;
  schedule_type: string | null;
  clock_in_limit: string | null; // Assuming clock_in_limit is stored as a string (e.g., 'HH:MM:SS')
}

interface ScheduleClockInLimit {
  schedule_id: number;
  title: string;
  date: string;
  clock_in_limit: string;
}

// Function to get schedules with optional filters
const getSchedules = async (res: any, req: any): Promise<void> => {
  const queryParams = req.getQuery();
  const urlParams = new URLSearchParams(queryParams);
  const date = urlParams.get('date') as string;
  const branchId = urlParams.get('branchId');
  const scheduleType = urlParams.get('scheduleType');

  try {
    let query = 'SELECT * FROM attendance_schedules WHERE date = $1';
    const values: (string | number)[] = [date];
    let valueIndex = 2;

    if (branchId) {
      query += ` AND branch_id = $${valueIndex++}`;
      values.push(parseInt(branchId));
    }
    if (scheduleType) {
      query += ` AND schedule_type = $${valueIndex++}`;
      values.push(scheduleType);
    }

    const { rows }: { rows: Schedule[] } = await pool.query(query, values);

    res.writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      data: rows,
    }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
};

// Function to get clock-in limit for a specific schedule
const getClockInLimit = async (res: any, req: any): Promise<void> => {
  const scheduleId = req.getParameter(0);

  try {
    const { rows }: { rows: ScheduleClockInLimit[] } = await pool.query(
      'SELECT id as schedule_id, title, date, clock_in_limit FROM attendance_schedules WHERE id = $1',
      [parseInt(scheduleId)]
    );

    if (rows.length === 0) {
      res.writeStatus('404 Not Found').writeHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        message: 'Schedule not found',
      }));
      return;
    }

    res.writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      data: rows[0],
    }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
};

const app = App();

app.get('/schedules', (res, req) => {
  getSchedules(res, req);
});

app.get('/schedules/:scheduleId/clock-in-limit', (res, req) => {
  getClockInLimit(res, req);
});

app.listen(3000, (token) => {
  if (token) {
    console.log('Listening to port 3000');
  } else {
    console.log('Failed to listen to port 3000');
  }
});
