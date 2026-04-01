const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/achievementController');

router.get('/all', ctrl.getAvailable);
router.get('/user/:userId', ctrl.getUserBadges);
router.get('/locked/:userId', ctrl.getRemainingAchievements); 

module.exports = router;