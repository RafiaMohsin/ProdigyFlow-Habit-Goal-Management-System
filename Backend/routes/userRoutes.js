const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// POST create user
router.post('/', userController.createUser);

// GET user stats
router.get('/stats', userController.getUserStats);

// GET user stats from view
router.get('/stats-view', userController.getUserStatsView);

module.exports = router;
