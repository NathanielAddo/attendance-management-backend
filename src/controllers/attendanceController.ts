import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance data' });
  }
};

export const createAttendance = async (req: Request, res: Response) => {
  try {
    const newAttendance = new Attendance(req.body);
    const savedAttendance = await newAttendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: 'Error creating attendance record' });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: 'Error updating attendance record' });
  }
};

export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting attendance record' });
  }
};

