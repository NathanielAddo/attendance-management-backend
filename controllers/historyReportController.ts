import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}
import User from '../models/User';
import Attendance from '../models/Attendance';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import mongoose from 'mongoose';

const getSummaryReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    let query: any = {};
    if (userType) query.userType = userType;
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    if (group) query.group = group;
    if (subgroup) query.subgroup = subgroup;
    if (schedule) query.schedule = schedule;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query);
    const userIds = users.map(user => user._id);

    const attendanceData = await Attendance.aggregate([
      { $match: { userId: { $in: userIds }, date: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) } } },
      { $group: {
        _id: '$userId',
        clockIns: { $sum: { $cond: [{ $eq: ['$type', 'clockIn'] }, 1, 0] } },
        clockOuts: { $sum: { $cond: [{ $eq: ['$type', 'clockOut'] }, 1, 0] } },
        adminClockIns: { $sum: { $cond: [{ $and: [{ $eq: ['$type', 'clockIn'] }, { $eq: ['$source', 'admin'] }] }, 1, 0] } },
        adminClockOuts: { $sum: { $cond: [{ $and: [{ $eq: ['$type', 'clockOut'] }, { $eq: ['$source', 'admin'] }] }, 1, 0] } },
        totalHours: { $sum: '$hours' },
        overtimeHours: { $sum: '$overtimeHours' },
        lateHours: { $sum: '$lateHours' },
        breakOverstayHrs: { $sum: '$breakOverstayHours' },
        clockOutBeforeTimeHrs: { $sum: '$earlyDepartureHours' },
      }},
    ]);

    const summaryReport = users.map(user => {
      const attendance = attendanceData.find(a => a._id.toString() === user._id.toString()) || {};
      return {
        ...user.toObject(),
        ...attendance,
      };
    });

    res.json(summaryReport);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary report' });
  }
};

const getBreakdownReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    let query: any = {};
    if (userType) query.userType = userType;
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    if (group) query.group = group;
    if (subgroup) query.subgroup = subgroup;
    if (schedule) query.schedule = schedule;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query);
    const userIds = users.map(user => user._id);

    const attendanceData = await Attendance.find({
      userId: { $in: userIds },
      date: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) },
    }).sort({ date: 1 });

    const breakdownReport = users.map(user => {
      const userAttendance = attendanceData.filter(a => a.userId.toString() === user._id.toString());
      return {
        ...user.toObject(),
        records: userAttendance.map(a => ({
          date: a.date,
          clockIn: a.type === 'clockIn' ? a.date : null,
          clockOut: a.type === 'clockOut' ? a.date : null,
          clockedBy: a.source,
        })),
      };
    });

    res.json(breakdownReport);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breakdown report' });
  }
};

const validateUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userIds } = req.body;
    const updatedUsers = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { validated: true, validatedBy: req.user.id } }
    );
    res.json({ message: 'Users validated successfully', updatedCount: updatedUsers.modifiedCount });
  } catch (error) {
    res.status(400).json({ message: 'Error validating users' });
  }
};

const downloadSummaryReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    let query: any = {};
    if (userType) query.userType = userType;
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    if (group) query.group = group;
    if (subgroup) query.subgroup = subgroup;
    if (schedule) query.schedule = schedule;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query);
    const userIds = users.map(user => user._id);

    const attendanceData = await Attendance.aggregate([
      { $match: { userId: { $in: userIds }, date: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) } } },
      { $group: {
        _id: '$userId',
        clockIns: { $sum: { $cond: [{ $eq: ['$type', 'clockIn'] }, 1, 0] } },
        clockOuts: { $sum: { $cond: [{ $eq: ['$type', 'clockOut'] }, 1, 0] } },
        adminClockIns: { $sum: { $cond: [{ $and: [{ $eq: ['$type', 'clockIn'] }, { $eq: ['$source', 'admin'] }] }, 1, 0] } },
        adminClockOuts: { $sum: { $cond: [{ $and: [{ $eq: ['$type', 'clockOut'] }, { $eq: ['$source', 'admin'] }] }, 1, 0] } },
        totalHours: { $sum: '$hours' },
        overtimeHours: { $sum: '$overtimeHours' },
        lateHours: { $sum: '$lateHours' },
        breakOverstayHrs: { $sum: '$breakOverstayHours' },
        clockOutBeforeTimeHrs: { $sum: '$earlyDepartureHours' },
      }},
    ]);

    const summaryReport = users.map(user => {
      const attendance = attendanceData.find(a => a._id.toString() === user._id.toString()) || {};
      return {
        ...user.toObject(),
        ...attendance,
      };
    });

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/summary_report.csv'),
      header: [
        { id: 'id', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'userType', title: 'User Type' },
        { id: 'country', title: 'Country' },
        { id: 'branch', title: 'Branch' },
        { id: 'category', title: 'Category' },
        { id: 'group', title: 'Group' },
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

    await csvWriter.writeRecords(summaryReport);

    res.download(path.resolve(__dirname, '../exports/summary_report.csv'), 'summary_report.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error downloading summary report' });
  }
};

const downloadBreakdownReport = async (req: Request, res: Response) => {
  try {
    const { userType, country, branch, category, group, subgroup, schedule, startDate, endDate, search } = req.query;

    let query: any = {};
    if (userType) query.userType = userType;
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    if (group) query.group = group;
    if (subgroup) query.subgroup = subgroup;
    if (schedule) query.schedule = schedule;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query);
    const userIds = users.map(user => user._id);

    const attendanceData = await Attendance.find({
      userId: { $in: userIds },
      date: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) },
    }).sort({ date: 1 });

    const breakdownReport = users.flatMap(user => {
      const userAttendance = attendanceData.filter(a => a.userId.toString() === user._id.toString());
      return userAttendance.map(a => ({
        userId: user.id,
        name: user.name,
        userType: user.userType,
        country: user.country,
        branch: user.branch,
        category: user.category,
        group: user.group,
        subgroup: user.subgroup,
        schedule: user.schedule,
        date: a.date,
        clockIn: a.type === 'clockIn' ? a.date : null,
        clockOut: a.type === 'clockOut' ? a.date : null,
        clockedBy: a.source,
        hours: a.hours,
        overtimeHours: a.overtimeHours,
        lateHours: a.lateHours,
        breakOverstayHours: a.breakOverstayHours,
        earlyDepartureHours: a.earlyDepartureHours,
      }));
    });

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/breakdown_report.csv'),
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'userType', title: 'User Type' },
        { id: 'country', title: 'Country' },
        { id: 'branch', title: 'Branch' },
        { id: 'category', title: 'Category' },
        { id: 'group', title: 'Group' },
        { id: 'subgroup', title: 'Subgroup' },
        { id: 'schedule', title: 'Schedule' },
        { id: 'date', title: 'Date' },
        { id: 'clockIn', title: 'Clock In' },
        { id: 'clockOut', title: 'Clock Out' },
        { id: 'clockedBy', title: 'Clocked By' },
        { id: 'hours', title: 'Hours' },
        { id: 'overtimeHours', title: 'Overtime Hours' },
        { id: 'lateHours', title: 'Late Hours' },
        { id: 'breakOverstayHours', title: 'Break Overstay Hours' },
        { id: 'earlyDepartureHours', title: 'Early Departure Hours' },
      ]
    });

    await csvWriter.writeRecords(breakdownReport);

    res.download(path.resolve(__dirname, '../exports/breakdown_report.csv'), 'breakdown_report.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
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
