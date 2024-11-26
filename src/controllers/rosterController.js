const { Request, Response } = require('express');
const Roster = require('../models/Roster');
const User = require('../models/User');
const csv = require('csv-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const createRoster = async (req, res) => {
  try {
    const newRoster = new Roster(req.body);
    const savedRoster = await newRoster.save();
    res.status(201).json(savedRoster);
  } catch (error) {
    res.status(400).json({ message: 'Error creating roster' });
  }
};

const getRosters = async (req, res) => {
  try {
    const rosters = await Roster.find().populate('userId');
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rosters' });
  }
};

const updateRoster = async (req, res) => {
  try {
    const updatedRoster = await Roster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRoster);
  } catch (error) {
    res.status(400).json({ message: 'Error updating roster' });
  }
};

const deleteRoster = async (req, res) => {
  try {
    await Roster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Roster deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting roster' });
  }
};

const bulkAssignRoster = async (req, res) => {
  try {
    const { userIds, schedules, startDate, endDate } = req.body;
    const bulkOps = userIds.map((userId) => ({
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

const uploadBulkRoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const bulkOps = results.map((row) => ({
          updateOne: {
            filter: { userId: row.userId },
            update: {
              $set: {
                schedules: row.schedules.split(','),
                startDate: new Date(row.startDate),
                endDate: new Date(row.endDate),
              }
            },
            upsert: true
          }
        }));

        await Roster.bulkWrite(bulkOps);
        fs.unlinkSync(req.file.path); // Delete the temporary file
        res.json({ message: 'Bulk roster uploaded successfully', count: results.length });
      });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading bulk roster' });
  }
};

const getAssignedRosters = async (req, res) => {
  try {
    const { country, branch, category, group, subgroup, schedule, startDate, endDate } = req.query;
    let query = {};

    if (country) query.country = country;
    if (branch) query.branch = branch;
    if (category) query.category = category;
    if (group) query.group = group;
    if (subgroup) query.subgroup = subgroup;
    if (schedule) query.schedule = schedule;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const rosters = await Roster.find(query).populate('userId');
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned rosters' });
  }
};

const exportRoster = async (req, res) => {
  try {
    const rosters = await Roster.find().populate('userId');

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/roster_export.csv'),
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'userName', title: 'User Name' },
        { id: 'schedules', title: 'Schedules' },
        { id: 'startDate', title: 'Start Date' },
        { id: 'endDate', title: 'End Date' },
      ]
    });

    await csvWriter.writeRecords(rosters.map(roster => ({
      userId: roster.userId._id,
      userName: roster.userId.name,
      schedules: roster.schedules.join(','),
      startDate: roster.startDate.toISOString().split('T')[0],
      endDate: roster.endDate.toISOString().split('T')[0],
    })));

    res.download(path.resolve(__dirname, '../exports/roster_export.csv'), 'roster_export.csv', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting roster' });
  }
};

module.exports = {
  createRoster,
  getRosters,
  updateRoster,
  deleteRoster,
  bulkAssignRoster,
  uploadBulkRoster,
  getAssignedRosters,
  exportRoster
};
