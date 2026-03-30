const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

// GET all habits
router.get('/', habitController.getAllHabits);

// POST create habit
router.post('/', habitController.createHabit);

// GET habit details
router.get('/details', habitController.getHabitDetails);

// GET habit details from view
router.get('/view', habitController.getHabitDetailsView);

// POST create habit via stored procedure
router.post('/sp', habitController.createHabitSP);

// GET habits by user via stored procedure
router.get('/user/:id', habitController.getHabitsByUserSP);

module.exports = router;
