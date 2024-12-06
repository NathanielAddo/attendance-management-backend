import { Request, Response } from 'express';
import { pool } from '../db';

interface AttendanceReport {
  id: number;
  name: string;
  image_url: string | null;
  country: string;
  branch: string;
  category: string | null;
  group_name: string | null;
  subgroup: string | null;
  phone: string;
  total_clock_ins: number;
  total_clock_outs: number;
  admin_clock_ins: number;
  admin_clock_outs: number;
  total_hours: number | null;
  late_hours: number | null;
  absent_days: number;
  leave_days: number;
  early_departures: number;
}

interface AttendanceBreakdown {
  id: number;
  name: string;
  phone: string;
  country: string;
  branch: string;
  category: string | null;
  group_name: string | null;
  subgroup: string | null;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  clocked_by: string | null;
  status: string | null;
  schedule: string | null;
}

// Function to generate attendance reports
const getAttendanceReport = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate, userType, country, branch, category, group, subgroup } = req.query as {
    startDate: string;
    endDate: string;
    userType?: string;
    country?: string;
    branch?: string;
    category?: string;
    group?: string;
    subgroup?: string;
  };

  try {
    let query = `
      SELECT 
        u.id, u.name, u.image_url, u.country, u.branch, u.category, u.group_name, u.subgroup, u.phone,
        COUNT(CASE WHEN a.clock_in IS NOT NULL THEN 1 END) as total_clock_ins,
        COUNT(CASE WHEN a.clock_out IS NOT NULL THEN 1 END) as total_clock_outs,
        COUNT(CASE WHEN a.clocked_by = 'Admin' AND a.clock_in IS NOT NULL THEN 1 END) as admin_clock_ins,
        COUNT(CASE WHEN a.clocked_by = 'Admin' AND a.clock_out IS NOT NULL THEN 1 END) as admin_clock_outs,
        SUM(EXTRACT(EPOCH FROM (a.clock_out - a.clock_in))/3600) as total_hours,
        SUM(CASE WHEN a.status = 'Late' THEN EXTRACT(EPOCH FROM (a.clock_in - s.start_time))/3600 ELSE 0 END) as late_hours,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.status = 'Time Off' THEN 1 END) as leave_days,
        COUNT(CASE WHEN a.status = 'Early Departure' THEN 1 END) as early_departures
      FROM 
        users u
      LEFT JOIN 
        attendance a ON u.id = a.user_id
      LEFT JOIN 
        schedules s ON u.id = s.assigned_users
      WHERE 
        a.date BETWEEN $1 AND $2
    `;
    const values: (string | undefined)[] = [startDate, endDate];
    let valueIndex = 3;

    if (userType) {
      query += ` AND u.role = $${valueIndex++}`;
      values.push(userType);
    }
    if (country) {
      query += ` AND u.country = $${valueIndex++}`;
      values.push(country);
    }
    if (branch) {
      query += ` AND u.branch = $${valueIndex++}`;
      values.push(branch);
    }
    if (category) {
      query += ` AND u.category = $${valueIndex++}`;
      values.push(category);
    }
    if (group) {
      query += ` AND u.group_name = $${valueIndex++}`;
      values.push(group);
    }
    if (subgroup) {
      query += ` AND u.subgroup = $${valueIndex++}`;
      values.push(subgroup);
    }

    query += ' GROUP BY u.id';

    const { rows }: { rows: AttendanceReport[] } = await pool.query(query, values);

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

// Function to generate attendance breakdown for a specific user
const getAttendanceBreakdown = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate, userId } = req.query as {
    startDate: string;
    endDate: string;
    userId: string;
  };

  try {
    const query = `
      SELECT 
        u.id, u.name, u.phone, u.country, u.branch, u.category, u.group_name, u.subgroup,
        a.date, a.clock_in, a.clock_out, a.clocked_by, a.status,
        s.name as schedule
      FROM 
        users u
      LEFT JOIN 
        attendance a ON u.id = a.user_id
      LEFT JOIN 
        schedules s ON u.id = s.assigned_users
      WHERE 
        u.id = $1 AND a.date BETWEEN $2 AND $3
      ORDER BY 
        a.date
    `;
    const { rows }: { rows: AttendanceBreakdown[] } = await pool.query(query, [userId, startDate, endDate]);

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

export { getAttendanceReport, getAttendanceBreakdown };
