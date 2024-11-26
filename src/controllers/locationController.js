const { Request, Response } = require('express');
const Location = require('../models/Location');

const createLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating location' });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating location' });
  }
};

const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting location' });
  }
};

module.exports = {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation
};
