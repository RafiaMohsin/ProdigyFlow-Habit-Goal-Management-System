const express = require('express');
const router = express.Router();
const logCtrl = require('../controllers/habitLogController');

router.post('/', logCtrl.logActivity);               // Create
router.get('/:habitId', logCtrl.getLogsByHabit);     // Read
router.patch('/correction', logCtrl.updateLog);      // Update
router.delete('/:logId', logCtrl.deleteLog);         // Delete
router.delete('/maintenance/cleanup', logCtrl.cleanupLogs); // Bulk Delete
router.get('/report/failures', logCtrl.getFailures); // Analytics

module.exports = router;