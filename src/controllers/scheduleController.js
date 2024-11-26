const { Request, Response } = require('express');
const Schedule = require('../models/Schedule');

const createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error creating schedule' });
  }
};

const getSchedules = async (req, res) => {
  try {
    const { country, branch, category } = req.query;
    let query = { isArchived: false };
    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    const schedules = await Schedule.find(query);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error updating schedule' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting schedule' });
  }
};

const archiveSchedule = async (req, res) => {
  try {
    const archivedSchedule = await Schedule.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
    res.json(archivedSchedule);
  } catch (error) {
    res.status(400).json({ message: 'Error archiving schedule' });
  }
};

const getArchivedSchedules = async (req, res) => {
  try {
    const archivedSchedules = await Schedule.find({ isArchived: true });
    res.json(archivedSchedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching archived schedules' });
  }
};

const addAgenda = async (req, res) => {
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

module.exports = {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  archiveSchedule,
  getArchivedSchedules,
  addAgenda
};
