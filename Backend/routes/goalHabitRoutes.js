const express = require('express');
const router = express.Router();
const ghCtrl = require('../controllers/goalHabitController');

router.post('/link', ghCtrl.link);
router.get('/composition/:goalId', ghCtrl.getGoalComposition);
router.delete('/unlink/:id', ghCtrl.unlink);

module.exports = router;