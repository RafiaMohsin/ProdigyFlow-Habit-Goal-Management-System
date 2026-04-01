const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');

router.get('/:userId', ctrl.getNotifications);
router.put('/mark-read', ctrl.updateReadStatus);
router.put('/archive', ctrl.archiveNotification); 
router.delete('/clear/:userId', ctrl.clearReadNotifications);

module.exports = router;