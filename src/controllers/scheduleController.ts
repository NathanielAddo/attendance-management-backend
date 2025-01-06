import { Request, Response } from 'express';
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
const getSchedules = async (req: Request, res: Response): Promise<void> => {
  const { date, branchId, scheduleType } = req.query as {
    date: string;
    branchId?: string;
    scheduleType?: string;
  };

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

    res.json({
      success: true,
      data: rows,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};

// Function to get clock-in limit for a specific schedule
const getClockInLimit = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params as { scheduleId: string };

  try {
    const { rows }: { rows: ScheduleClockInLimit[] } = await pool.query(
      'SELECT id as schedule_id, title, date, clock_in_limit FROM attendance_schedules WHERE id = $1',
      [parseInt(scheduleId)]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
      return;
    }

    res.json({
      success: true,
      data: rows[0],
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};

export { getSchedules, getClockInLimit };
