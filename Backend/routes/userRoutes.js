const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// POST create user
router.post('/', userController.createUser);

module.exports = router;
