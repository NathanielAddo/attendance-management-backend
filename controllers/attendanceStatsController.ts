import { Request, Response } from 'express';
import { pool } from '../db';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { getAttendanceSummaryQuery, getChartDataQuery, getTableDataQuery } from '../utils/sqlQueries';

interface QueryParams {
  dateInterval?: string;
  schedule?: string;
  country?: string;
  region?: string;
  branch?: string;
  category?: string;
  group?: string;
  subgroup?: string;
}

const getAttendanceSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dateInterval, schedule, country, region, branch, category, group, subgroup } = req.query as QueryParams;
    const date = new Date(dateInterval || Date.now());

    const { rows } = await pool.query(getAttendanceSummaryQuery, [
      date,
      schedule || null,
      country || null,
      branch || null,
      category || null,
      group || null,
      subgroup || null
    ]);

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
};

const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const { rows } = await pool.query(getChartDataQuery, [startDate, endDate]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

const getTableData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query(getTableDataQuery);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ message: 'Error fetching table data' });
  }
};

const exportAttendanceData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const { rows } = await pool.query(getChartDataQuery, [startDate, endDate]);

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/attendance_stats.csv'),
      header: [
        { id: 'date', title: 'Date' },
        { id: 'total_employees', title: 'Total Employees' },
        { id: 'on_time', title: 'Present Employees' },
        { id: 'absent', title: 'Absent Employees' },
        { id: 'late_arrivals', title: 'Late Employees' },
        { id: 'early_departures', title: 'Early Departures' },
        { id: 'overtime_employees', title: 'Overtime Employees' },
        { id: 'total_hours', title: 'Total Hours' },
        { id: 'overtime_hours', title: 'Overtime Hours' },
      ]
    });

    await csvWriter.writeRecords(rows.map(stat => ({
      date: stat.date.toISOString().split('T')[0],
      total_employees: stat.total_employees,
      on_time: stat.on_time,
      absent: stat.absent,
      late_arrivals: stat.late_arrivals,
      early_departures: stat.early_departures,
      overtime_employees: stat.overtime_employees,
      total_hours: parseFloat(stat.total_hours).toFixed(2),
      overtime_hours: parseFloat(stat.overtime_hours).toFixed(2),
    })));

    res.download(path.resolve(__dirname, '../exports/attendance_stats.csv'), 'attendance_stats.csv', (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    console.error('Error exporting attendance data:', error);
    res.status(500).json({ message: 'Error exporting attendance data' });
  }
};

export {
  getAttendanceSummary,
  getChartData,
  getTableData,
  exportAttendanceData
};

