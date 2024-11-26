const { Request, Response } = require('express');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error registering user' });
  }
};

const bulkRegisterUsers = async (req, res) => {
  try {
    const users = req.body;
    const savedUsers = await User.insertMany(users);
    res.status(201).json(savedUsers);
  } catch (error) {
    res.status(400).json({ message: 'Error bulk registering users' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  registerUser,
  bulkRegisterUsers,
  getUsers,
  updateUser,
  deleteUser
};
