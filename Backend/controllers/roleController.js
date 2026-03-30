const Role = require('../models/Role');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { RoleName } = req.body;
    if (!RoleName) {
      return res.status(400).json({ error: 'RoleName is required.' });
    }
    const newRole = await Role.create(req.body);
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
