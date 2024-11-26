const { Request, Response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event' });
  }
};

const createBulkEvents = async (req, res) => {
  try {
    const events = req.body;
    const savedEvents = await Event.insertMany(events);
    res.status(201).json(savedEvents);
  } catch (error) {
    res.status(400).json({ message: 'Error creating bulk events' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting event' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  createBulkEvents,
  updateEvent,
  deleteEvent
};
