import { Request, Response } from 'express';
import Event from '../models/Event';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event' });
  }
};

export const createBulkEvents = async (req: Request, res: Response) => {
  try {
    const events = req.body;
    const savedEvents = await Event.insertMany(events);
    res.status(201).json(savedEvents);
  } catch (error) {
    res.status(400).json({ message: 'Error creating bulk events' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting event' });
  }
};

