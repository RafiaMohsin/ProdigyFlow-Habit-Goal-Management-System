const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// POST create user
router.post('/', userController.createUser);

// GET dashboard stats (real-time counts)
router.get('/dashboard-stats', userController.getDashboardStats);

module.exports = router;
