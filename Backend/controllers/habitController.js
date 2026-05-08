const Habit = require('../models/Habit');

exports.getAllHabits = async (req, res) => {
  try {
    let habits;
    if (req.user.roleId === 1) {
      // Admin sees everything
      habits = await Habit.getAll();
    } else {
      // User sees only their own
      habits = await Habit.getByUserId(req.user.id);
    }
    res.json(habits);
  } catch (err) {
    console.error('Error in getAllHabits:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { HabitName, UserID, CategoryID } = req.body;
    if (!HabitName || !CategoryID) {
      return res.status(400).json({ error: 'HabitName and CategoryID are required.' });
    }
    
    // If UserID is not provided, use the ID from the token
    const finalUserID = UserID || req.user.id;
    
    const newHabit = await Habit.create({
      ...req.body,
      UserID: finalUserID
    });
    res.status(201).json(newHabit);
  } catch (err) {
    console.error('Error in createHabit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHabitDetails = async (req, res) => {
  try {
    let details;
    if (req.user.roleId === 1) {
      details = await Habit.getDetails();
    } else {
      // Filter details for the specific user
      const allDetails = await Habit.getDetails();
      details = allDetails.filter(h => h.UserID === req.user.id);
    }
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHabitDetailsView = async (req, res) => {
  try {
    const details = await Habit.getDetailsFromView();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHabitSP = async (req, res) => {
  try {
    const { HabitName, Difficulty, Priority, UserID, CategoryID } = req.body;
    if (!HabitName || !UserID || !CategoryID) {
      return res.status(400).json({ error: 'HabitName, UserID, and CategoryID are required.' });
    }
    await Habit.createWithSP(req.body);
    res.status(201).json({ message: 'Habit added successfully via stored procedure' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHabitsByUserSP = async (req, res) => {
  try {
    const { id } = req.params;
    const habits = await Habit.getByUserSP(id);
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
