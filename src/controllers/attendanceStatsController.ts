import { Request, Response } from 'express';
import AttendanceStats from '../models/AttendanceStat';

export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { dateInterval, schedule, country, region, branch, category, group, subgroup } = req.query;
    let query: any = {};
    // Implement query logic based on filters
    const stats = await AttendanceStats.findOne(query).sort({ date: -1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
};

export const getChartData = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const chartData = await AttendanceStats.find({
      date: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
    }).sort({ date: 1 });
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

export const getTableData = async (req: Request, res: Response) => {
  try {
    const tableData = await AttendanceStats.find().sort({ date: -1 }).limit(8);
    res.json(tableData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table data' });
  }
};

export const exportAttendanceData = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await AttendanceStats.find({
      date: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
    }).sort({ date: 1 });
    // Implement CSV generation logic here
    res.json({ message: 'Export functionality not implemented yet', data });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting attendance data' });
  }
};

