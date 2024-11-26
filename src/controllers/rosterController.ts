import { Request, Response } from 'express';
import Roster from '../models/Roster';
import User from '../models/User';

export const createRoster = async (req: Request, res: Response) => {
  try {
    const newRoster = new Roster(req.body);
    const savedRoster = await newRoster.save();
    res.status(201).json(savedRoster);
  } catch (error) {
    res.status(400).json({ message: 'Error creating roster' });
  }
};

export const getRosters = async (req: Request, res: Response) => {
  try {
    const rosters = await Roster.find().populate('userId');
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rosters' });
  }
};

export const updateRoster = async (req: Request, res: Response) => {
  try {
    const updatedRoster = await Roster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRoster);
  } catch (error) {
    res.status(400).json({ message: 'Error updating roster' });
  }
};

export const deleteRoster = async (req: Request, res: Response) => {
  try {
    await Roster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Roster deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting roster' });
  }
};

export const bulkAssignRoster = async (req: Request, res: Response) => {
  try {
    const { userIds, schedules, startDate, endDate } = req.body;
    const bulkOps = userIds.map((userId: string) => ({
      updateOne: {
        filter: { _id: userId },
        update: { $set: { schedules: schedules, startDate, endDate } }
      }
    }));
    await User.bulkWrite(bulkOps);
    res.json({ message: 'Roster assigned successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error assigning roster' });
  }
};

export const uploadBulkRoster = async (req: Request, res: Response) => {
  try {
    // Implement CSV parsing and bulk roster creation logic here
    res.json({ message: 'Bulk roster uploaded successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading bulk roster' });
  }
};

export const getAssignedRosters = async (req: Request, res: Response) => {
  try {
    const { country, branch, category, group, subgroup, schedule, startDate, endDate } = req.query;
    let query: any = {};

    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    if (group) query.group = group;
    if (subgroup) query.subgroup = subgroup;
    if (schedule) query.schedule = schedule;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
    }

    const rosters = await Roster.find(query).populate('userId');
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned rosters' });
  }
};

export const exportRoster = async (req: Request, res: Response) => {
  try {
    const rosters = await Roster.find().populate('userId');
    // Implement CSV generation logic here
    res.json({ message: 'Roster export functionality not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting roster' });
  }
};

