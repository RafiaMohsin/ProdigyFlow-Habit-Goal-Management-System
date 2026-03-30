const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
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
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
