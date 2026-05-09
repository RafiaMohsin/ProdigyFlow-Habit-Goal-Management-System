const sql = require('mssql');
const { config } = require('../config/db');

class HabitNote {
    static async create(noteData) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('HabitID', sql.Int, noteData.habitId)
                .input('NoteText', sql.Text, noteData.noteText)
                .query('INSERT INTO HabitNotes (HabitID, NoteText) VALUES (@HabitID, @NoteText)');
        } catch (err) { throw err; }
    }

    static async getFullActivityHistory(habitId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('HabitID', sql.Int, habitId)
                .query('SELECT * FROM vw_HabitActivityTimeline WHERE HabitID = @HabitID ORDER BY ActivityDate DESC');
            return result.recordset; // Updated to use View
        } catch (err) { throw err; }
    }

    static async update(noteId, userId, newText) {
    try {
        let pool = await sql.connect(config);
        return await pool.request()
            .input('NoteID', sql.Int, noteId)
            .input('UserID', sql.Int, userId) // Security: Ensure only the owner can edit
            .input('NoteText', sql.Text, newText)
            .query(`
                UPDATE HN 
                SET HN.NoteText = @NoteText 
                FROM HabitNotes HN
                JOIN Habits H ON HN.HabitID = H.HabitID
                WHERE HN.NoteID = @NoteID AND H.UserID = @UserID
            `);
    } catch (err) { throw err; }
}

static async delete(noteId, userId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('NoteID', sql.Int, noteId)
                .input('UserID', sql.Int, userId)
                .query(`
                    DELETE HN
                    FROM HabitNotes HN
                    JOIN Habits H ON HN.HabitID = H.HabitID
                    WHERE HN.NoteID = @NoteID AND H.UserID = @UserID
                `);
        } catch (err) { throw err; }
    }

}
module.exports = HabitNote;