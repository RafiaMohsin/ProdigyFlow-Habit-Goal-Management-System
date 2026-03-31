const HabitNote = require('../models/HabitNote');

module.exports = {
    // Adds a new reflection note
    addNote: async (req, res) => {
        try {
            await HabitNote.create(req.body);
            res.status(201).json({ message: "Note added successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Uses vw_HabitActivityTimeline
    getTimeline: async (req, res) => {
        try {
            const timeline = await HabitNote.getFullActivityHistory(req.params.habitId);
            res.json(timeline);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteNote: async (req, res) => {
        try {
            const { noteId, userId } = req.params;
            await HabitNote.delete(noteId, userId);
            res.json({ message: "Reflection deleted" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    editNote: async (req, res) => {
    try {
        const { noteId, userId, noteText } = req.body;
        const result = await HabitNote.update(noteId, userId, noteText);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }
        
        res.json({ message: "Reflection updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
 }
};