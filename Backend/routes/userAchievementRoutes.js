const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userAchievementController');

router.post('/award', ctrl.awardBadge);
router.get('/:userId', ctrl.getUserBadges);

module.exports = router;