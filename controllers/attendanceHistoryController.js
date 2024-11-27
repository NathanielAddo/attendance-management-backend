const { Request, Response } = require('express');
const AttendanceReport = require('../models/AttendanceReport');
const DailyBreakdown = require('../models/DailyBreakdown');

const getAttendanceSummary = async (req, res) => {
  try {
    const reports = await AttendanceReport.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
};

const getAttendanceBreakdown = async (req, res) => {
  try {
    const { userId } = req.params;
    const breakdown = await DailyBreakdown.find({ userId });
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance breakdown' });
  }
};

const filterAttendance = async (req, res) => {
  try {
    const { userType, schedule, startDate, endDate, search } = req.body;
    let query = {};

    if (userType) query.userType = userType;
    if (schedule) query.schedule = schedule;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
      ];
    }

    const reports = await AttendanceReport.find(query);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering attendance data' });
  }
};

const validateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updatedReport = await AttendanceReport.findByIdAndUpdate(
      reportId,
      { validated: true },
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: 'Error validating report' });
  }
};

const exportAttendanceReport = async (req, res) => {
  try {
    // Implement export logic here
    // This could involve generating a CSV or Excel file with the attendance data
    res.json({ message: 'Export functionality not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting attendance report' });
  }
};

module.exports = {
  getAttendanceSummary,
  getAttendanceBreakdown,
  filterAttendance,
  validateReport,
  exportAttendanceReport
};
