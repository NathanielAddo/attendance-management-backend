import { Request, Response } from 'express';
import Schedule from '../models/Schedule';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const newSchedule = new Schedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error creating schedule' });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const { country, branch, category } = req.query;
    let query: any = { isArchived: false };
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    const schedules = await Schedule.find(query);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules' });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error updating schedule' });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting schedule' });
  }
};

export const archiveSchedule = async (req: Request, res: Response) => {
  try {
    const archivedSchedule = await Schedule.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
    res.json(archivedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error archiving schedule' });
  }
};

export const getArchivedSchedules = async (req: Request, res: Response) => {
  try {
    const archivedSchedules = await Schedule.find({ isArchived: true });
    res.json(archivedSchedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching archived schedules' });
  }
};

export const addAgenda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { agenda } = req.body;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { $push: { agendas: agenda } },
      { new: true }
    );
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error adding agenda to schedule' });
  }
};

