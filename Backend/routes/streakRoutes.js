const express = require('express');
const router = express.Router();
const streakCtrl = require('../controllers/streakController');

router.put('/sync', streakCtrl.syncStreaks);             
router.get('/habit/:habitId', streakCtrl.getHabitStreak); 
router.get('/top', streakCtrl.getLeaderboard);           

// NEW: Milestone Route (Requirement 2.8)
router.get('/milestones/:days', streakCtrl.getMilestones); 

module.exports = router;