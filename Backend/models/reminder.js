const sql = require('mssql');
const { config } = require('../config/db');

class Reminder {
    static async create(data) {
    try {
        let pool = await sql.connect(config);
        
        return await pool.request()
            .input('HabitID', sql.Int, data.habitId)
            .input('ReminderTime', sql.VarChar(8), data.reminderTime) 
            .input('Frequency', sql.VarChar(50), data.frequency)
            .input('Status', sql.VarChar(20), 'Active')
            .query(`
                    DECLARE @NextID INT = ISNULL((SELECT MAX(ReminderID) FROM Reminders), 0) + 1;
                    INSERT INTO Reminders (ReminderID, HabitID, ReminderTime, Frequency, Status) 
                    VALUES (@NextID, @HabitID, @ReminderTime, @Frequency, @Status)
                `);
    } catch (err) { throw err; }
}

    static async getByHabit(habitId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('HabitID', sql.Int, habitId)
                .query('SELECT * FROM Reminders WHERE HabitID = @HabitID');
            return result.recordset;
        } catch (err) { throw err; }
    }

    static async toggleStatus(reminderId, status) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('ReminderID', sql.Int, reminderId)
                .input('Status', sql.VarChar(20), status) // Pass 'Active' or 'Inactive'
                .query("UPDATE Reminders SET Status = @Status WHERE ReminderID = @ReminderID");
        } catch (err) { throw err; }
    }

    static async delete(reminderId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('ReminderID', sql.Int, reminderId)
                .query("DELETE FROM Reminders WHERE ReminderID = @ReminderID");
        } catch (err) { throw err; }
    }
}
module.exports = Reminder;
