const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET all roles
router.get('/', roleController.getAllRoles);

// POST create role
router.post('/', roleController.createRole);

module.exports = router;
