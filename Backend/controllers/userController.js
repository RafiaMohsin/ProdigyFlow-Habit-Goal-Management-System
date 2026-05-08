const User = require('../models/User');

const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    // Only Admin (roleId: 1) can see all users
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { Username, Email, PasswordHash } = req.body;
    if (!Username || !Email || !PasswordHash) {
      return res.status(400).json({ error: 'Username, Email, and PasswordHash are required.' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PasswordHash, salt);
    
    const newUser = await User.create({
      ...req.body,
      PasswordHash: hashedPassword
    });
    
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const stats = await User.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserStatsView = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const stats = await User.getStatsFromView();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await User.getDashboardStats(req.user.id, req.user.roleId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
