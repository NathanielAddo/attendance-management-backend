import { Request, Response } from 'express';
import User from '../models/User';
import Attendance from '../models/Attendance';

export const getSummaryReport = async (req: Request, res: Response) => {
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

export const getBreakdownReport = async (req: Request, res: Response) => {
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
          clockIn: a.clockIn,
          clockOut: a.clockOut,
          clockedBy: a.source,
        })),
      };
    });

    res.json(breakdownReport);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breakdown report' });
  }
};

export const validateUsers = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    const updatedUsers = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { validated: true, validatedBy: req.user.id } }
    );
    res.json({ message: 'Users validated successfully', updatedCount: updatedUsers.nModified });
  } catch (error) {
    res.status(400).json({ message: 'Error validating users' });
  }
};

export const downloadSummaryReport = async (req: Request, res: Response) => {
  try {
    // Implement CSV/Excel generation logic for summary report
    res.json({ message: 'Summary report download not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Error downloading summary report' });
  }
};

export const downloadBreakdownReport = async (req: Request, res: Response) => {
  try {
    // Implement CSV/Excel generation logic for breakdown report
    res.json({ message: 'Breakdown report download not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Error downloading breakdown report' });
  }
};

