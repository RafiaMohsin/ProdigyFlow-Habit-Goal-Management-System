const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/performanceController');

router.post('/', ctrl.addReport);
router.get('/:userId', ctrl.getUserReports);
router.get('/stats/:userId', ctrl.getDashboardStats); 

module.exports = router;