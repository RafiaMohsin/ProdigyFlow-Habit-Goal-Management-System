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

    getTimeline: async (req, res) => {
        try {
            const timeline = await HabitNote.getFullActivityHistory(req.params.habitId);
            
            // Fetch raw notes to get NoteIDs which might be missing from the view
            const sql = require('mssql');
            const { config } = require('../config/db');
            let pool = await sql.connect(config);
            let rawNotesResult = await pool.request()
                .input('HabitID', sql.Int, req.params.habitId)
                .query('SELECT NoteID, NoteText FROM HabitNotes WHERE HabitID = @HabitID');
            
            const enrichedTimeline = timeline.map(item => {
                if (item.ActivityDetails && item.ActivityDetails.startsWith('Note: ')) {
                    const actualText = item.ActivityDetails.substring(6);
                    const matchedNote = rawNotesResult.recordset.find(rn => rn.NoteText === actualText);
                    if (matchedNote) {
                        return { ...item, NoteID: matchedNote.NoteID };
                    }
                }
                return item;
            });
            
            res.json(enrichedTimeline);
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
