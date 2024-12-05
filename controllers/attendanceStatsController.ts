import { Request, Response } from 'express';
import AttendanceStats from '../models/AttendanceStat';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

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
    let query: any = {};
    // Implement query logic based on filters
    const stats = await AttendanceStats.findOne(query).sort({ date: -1 });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
};

const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const chartData = await AttendanceStats.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 });
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

const getTableData = async (req: Request, res: Response): Promise<void> => {
  try {
    const tableData = await AttendanceStats.find().sort({ date: -1 }).limit(8);
    res.json(tableData);
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ message: 'Error fetching table data' });
  }
};

const exportAttendanceData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const data = await AttendanceStats.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 });

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/attendance_stats.csv'),
      header: [
        { id: 'date', title: 'Date' },
        { id: 'totalEmployees', title: 'Total Employees' },
        { id: 'presentEmployees', title: 'Present Employees' },
        { id: 'absentEmployees', title: 'Absent Employees' },
        { id: 'lateEmployees', title: 'Late Employees' },
        { id: 'earlyDepartures', title: 'Early Departures' },
        { id: 'overtimeEmployees', title: 'Overtime Employees' },
        { id: 'totalHours', title: 'Total Hours' },
        { id: 'overtimeHours', title: 'Overtime Hours' },
      ]
    });

    await csvWriter.writeRecords(data.map(stat => ({
      date: stat.date.toISOString().split('T')[0],
      totalEmployees: stat.totalEmployees,
      presentEmployees: stat.onTime,
      absentEmployees: stat.absent,
      lateEmployees: stat.lateArrivals,
      earlyDepartures: stat.earlyDepartures,
      overtimeEmployees: stat.overtimeEmployees || 0,
      // totalHours: stat.totalHours,
      overtimeHours: stat.overtimeHours,
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
