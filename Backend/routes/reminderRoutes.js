const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reminderController');

router.post('/', ctrl.setReminder);
router.get('/habit/:habitId', ctrl.getReminders);
router.put('/status', ctrl.updateReminderStatus); 
router.delete('/:reminderId', ctrl.removeReminder); 

module.exports = router;