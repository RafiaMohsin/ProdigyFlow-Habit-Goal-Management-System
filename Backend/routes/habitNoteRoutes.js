const express = require('express');
const router = express.Router();
const noteCtrl = require('../controllers/habitNoteController');

router.post('/', noteCtrl.addNote);
router.get('/history/:habitId', noteCtrl.getTimeline);
router.put('/edit', noteCtrl.editNote);
router.delete('/:noteId/:userId', noteCtrl.deleteNote);

module.exports = router;