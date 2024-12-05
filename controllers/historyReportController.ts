import { Request, Response } from 'express';
import { pool } from '../db';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { getSummaryReportQuery, getBreakdownReportQuery, validateUsersQuery } from '../utils/historyReportQueries';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

const getSummaryReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    const { rows } = await pool.query(getSummaryReportQuery, [
      startDate, endDate, userType, country, branch, category, group, subgroup, schedule,
      search ? `%${search}%` : null
    ]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching summary report:', error);
    res.status(500).json({ message: 'Error fetching summary report' });
  }
};

const getBreakdownReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    const { rows } = await pool.query(getBreakdownReportQuery, [
      startDate, endDate, userType, country, branch, category, group, subgroup, schedule,
      search ? `%${search}%` : null
    ]);

    const breakdownReport = rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          ...row,
          records: []
        };
        delete acc[row.id].date;
        delete acc[row.id].clock_in_time;
        delete acc[row.id].clock_out_time;
        delete acc[row.id].clocked_by;
        delete acc[row.id].hours;
        delete acc[row.id].overtimeHours;
        delete acc[row.id].lateHours;
        delete acc[row.id].breakOverstayHours;
        delete acc[row.id].earlyDepartureHours;
      }
      acc[row.id].records.push({
        date: row.date,
        clockIn: row.clock_in_time,
        clockOut: row.clock_out_time,
        clockedBy: row.clocked_by,
        hours: row.hours,
        overtimeHours: row.overtimeHours,
        lateHours: row.lateHours,
        breakOverstayHours: row.breakOverstayHours,
        earlyDepartureHours: row.earlyDepartureHours
      });
      return acc;
    }, {});

    res.json(Object.values(breakdownReport));
  } catch (error) {
    console.error('Error fetching breakdown report:', error);
    res.status(500).json({ message: 'Error fetching breakdown report' });
  }
};

const validateUsers = async (req: Partial<Request> | Partial<AuthenticatedRequest>, res: Response) => {
  try {
    if ('user' in req && req.user?.id && req.body?.userIds) {
      const { userIds } = req.body;
      const { rows } = await pool.query(validateUsersQuery, [req.user.id, userIds]);
      res.json({ message: 'Users validated successfully', updatedCount: rows.length });
    }
  } catch (error) {
    console.error('Error validating users:', error);
    res.status(400).json({ message: 'Error validating users' });
  }
};

const downloadSummaryReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    const { rows } = await pool.query(getSummaryReportQuery, [
      startDate, endDate, userType, country, branch, category, group, subgroup, schedule,
      search ? `%${search}%` : null
    ]);

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/summary_report.csv'),
      header: [
        { id: 'id', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'userType', title: 'User Type' },
        { id: 'country', title: 'Country' },
        { id: 'branch', title: 'Branch' },
        { id: 'category', title: 'Category' },
        { id: 'group_name', title: 'Group' },
        { id: 'subgroup', title: 'Subgroup' },
        { id: 'schedule', title: 'Schedule' },
        { id: 'clockIns', title: 'Clock Ins' },
        { id: 'clockOuts', title: 'Clock Outs' },
        { id: 'adminClockIns', title: 'Admin Clock Ins' },
        { id: 'adminClockOuts', title: 'Admin Clock Outs' },
        { id: 'totalHours', title: 'Total Hours' },
        { id: 'overtimeHours', title: 'Overtime Hours' },
        { id: 'lateHours', title: 'Late Hours' },
        { id: 'breakOverstayHrs', title: 'Break Overstay Hours' },
        { id: 'clockOutBeforeTimeHrs', title: 'Early Departure Hours' },
      ]
    });

    await csvWriter.writeRecords(rows);

    res.download(path.resolve(__dirname, '../exports/summary_report.csv'), 'summary_report.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    console.error('Error downloading summary report:', error);
    res.status(500).json({ message: 'Error downloading summary report' });
  }
};

const downloadBreakdownReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    const { rows } = await pool.query(getBreakdownReportQuery, [
      startDate, endDate, userType, country, branch, category, group, subgroup, schedule,
      search ? `%${search}%` : null
    ]);

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/breakdown_report.csv'),
      header: [
        { id: 'id', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'userType', title: 'User Type' },
        { id: 'country', title: 'Country' },
        { id: 'branch', title: 'Branch' },
        { id: 'category', title: 'Category' },
        { id: 'group_name', title: 'Group' },
        { id: 'subgroup', title: 'Subgroup' },
        { id: 'schedule', title: 'Schedule' },
        { id: 'date', title: 'Date' },
        { id: 'clock_in_time', title: 'Clock In' },
        { id: 'clock_out_time', title: 'Clock Out' },
        { id: 'clocked_by', title: 'Clocked By' },
        { id: 'hours', title: 'Hours' },
        { id: 'overtimeHours', title: 'Overtime Hours' },
        { id: 'lateHours', title: 'Late Hours' },
        { id: 'breakOverstayHours', title: 'Break Overstay Hours' },
        { id: 'earlyDepartureHours', title: 'Early Departure Hours' },
      ]
    });

    await csvWriter.writeRecords(rows);

    res.download(path.resolve(__dirname, '../exports/breakdown_report.csv'), 'breakdown_report.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    console.error('Error downloading breakdown report:', error);
    res.status(500).json({ message: 'Error downloading breakdown report' });
  }
};

export {
  getSummaryReport,
  getBreakdownReport,
  validateUsers,
  downloadSummaryReport,
  downloadBreakdownReport,
};

