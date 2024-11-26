import { Request, Response } from 'express';
import Location from '../models/Location';

export const createLocation = async (req: Request, res: Response) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating location' });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations' });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating location' });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting location' });
  }
};

