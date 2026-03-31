const express = require('express');
const router = express.Router();
const goalCtrl = require('../controllers/goalController');

router.post('/', goalCtrl.createGoal);
router.get('/user/:userId', goalCtrl.getUserGoals);
router.get('/urgent/:userId', goalCtrl.getUrgent);
router.put('/progress', goalCtrl.updateGoalProgress);
router.delete('/:goalId/:userId', goalCtrl.removeGoal);

module.exports = router;