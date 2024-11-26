const { Request, Response } = require('express');
const AttendanceStats = require('../models/AttendanceStat');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const getAttendanceSummary = async (req, res) => {
  try {
    const { dateInterval, schedule, country, region, branch, category, group, subgroup } = req.query;
    let query = {};
    // Implement query logic based on filters
    const stats = await AttendanceStats.findOne(query).sort({ date: -1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
};

const getChartData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const chartData = await AttendanceStats.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 });
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

const getTableData = async (req, res) => {
  try {
    const tableData = await AttendanceStats.find().sort({ date: -1 }).limit(8);
    res.json(tableData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table data' });
  }
};

const exportAttendanceData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
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
      presentEmployees: stat.presentEmployees,
      absentEmployees: stat.absentEmployees,
      lateEmployees: stat.lateEmployees,
      earlyDepartures: stat.earlyDepartures,
      overtimeEmployees: stat.overtimeEmployees,
      totalHours: stat.totalHours,
      overtimeHours: stat.overtimeHours,
    })));

    res.download(path.resolve(__dirname, '../exports/attendance_stats.csv'), 'attendance_stats.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting attendance data' });
  }
};

module.exports = {
  getAttendanceSummary,
  getChartData,
  getTableData,
  exportAttendanceData
};
