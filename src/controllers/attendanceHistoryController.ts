// import { Request, Response } from 'express';
// // import AttendanceReport from '../models/AttendanceReport';
// // import DailyBreakdown from '../models/DailyBreakdown';
// import { Parser } from 'json2csv';

// const getAttendanceSummary = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const reports = await AttendanceReport.find();
//     res.json(reports);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching attendance summary' });
//   }
// };

// const getAttendanceBreakdown = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId } = req.params;
//     const breakdown = await DailyBreakdown.find({ userId });
//     res.json(breakdown);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching attendance breakdown' });
//   }
// };

// const filterAttendance = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userType, schedule, startDate, endDate, search } = req.body;
//     let query: any = {};

//     if (userType) query.userType = userType;
//     if (schedule) query.schedule = schedule;
//     if (startDate && endDate) {
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }
//     if (search) {
//       query.$or = [
//         { userName: { $regex: search, $options: 'i' } },
//         { userId: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const reports = await AttendanceReport.find(query);
//     res.json(reports);
//   } catch (error) {
//     res.status(500).json({ message: 'Error filtering attendance data' });
//   }
// };

// const validateReport = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { reportId } = req.params;
//     const updatedReport = await AttendanceReport.findByIdAndUpdate(
//       reportId,
//       { validated: true },
//       { new: true }
//     );
//     res.json(updatedReport);
//   } catch (error) {
//     res.status(400).json({ message: 'Error validating report' });
//   }
// };

// const exportAttendanceReport = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const reports = await AttendanceReport.find();
//     const fields = ['userId', 'userName', 'date', 'status', 'validated'];
//     const opts = { fields };

//     try {
//       const parser = new Parser(opts);
//       const csv = parser.parse(reports);
//       res.header('Content-Type', 'text/csv');
//       res.attachment('attendance_report.csv');
//       res.send(csv);
//     } catch (err) {
//       res.status(500).json({ message: 'Error generating CSV file' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error exporting attendance report' });
//   }
// };

// export {
//   getAttendanceSummary,
//   getAttendanceBreakdown,
//   filterAttendance,
//   validateReport,
//   exportAttendanceReport
// };
