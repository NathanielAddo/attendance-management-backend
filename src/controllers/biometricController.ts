import { Request, Response } from 'express';
import BiometricUser from '../models/BiometricUser';

export const registerVoice = async (req: Request, res: Response) => {
  try {
    const { userId, voiceData } = req.body;
    const user = await BiometricUser.findOneAndUpdate(
      { userId },
      { $set: { voiceData, voiceStatus: 'Available' } },
      { upsert: true, new: true }
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error registering voice' });
  }
};

export const registerImage = async (req: Request, res: Response) => {
  try {
    const { userId, imageData } = req.body;
    const user = await BiometricUser.findOneAndUpdate(
      { userId },
      { $set: { imageData, imageStatus: 'Available' } },
      { upsert: true, new: true }
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error registering image' });
  }
};

export const getBiometricUsers = async (req: Request, res: Response) => {
  try {
    const { country, branch, search } = req.query;
    let query: any = {};
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await BiometricUser.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching biometric users' });
  }
};

export const updateBiometricUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await BiometricUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating biometric user' });
  }
};

export const deleteBiometricUser = async (req: Request, res: Response) => {
  try {
    await BiometricUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Biometric user deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting biometric user' });
  }
};

