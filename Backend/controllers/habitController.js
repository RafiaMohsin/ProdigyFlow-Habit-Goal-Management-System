const Habit = require('../models/Habit');

exports.getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.getAll();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { HabitName, UserID, CategoryID } = req.body;
    if (!HabitName || !UserID || !CategoryID) {
      return res.status(400).json({ error: 'HabitName, UserID, and CategoryID are required.' });
    }
    const newHabit = await Habit.create(req.body);
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
