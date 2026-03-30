const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

// GET all habits
router.get('/', habitController.getAllHabits);

// POST create habit
router.post('/', habitController.createHabit);

module.exports = router;
