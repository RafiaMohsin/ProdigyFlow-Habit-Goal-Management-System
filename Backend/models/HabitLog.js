const sql = require('mssql');
const { config } = require('../config/db');

class HabitLog {
    // Original: Log activity via Stored Procedure
    static async create(logData) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('HabitID', sql.Int, logData.habitId)
                .input('Status', sql.VarChar, logData.status) 
                .execute('sp_LogHabitActivity'); 
        } catch (err) { throw err; }
    }

    // Original: Get logs for a specific habit
    static async getByHabitId(habitId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('HabitID', sql.Int, habitId)
                .query('SELECT * FROM HabitLogs WHERE HabitID = @HabitID ORDER BY CompletionDate DESC');
            return result.recordset;
        } catch (err) { throw err; }
    }

    // NEW: Update a specific log status (Correction Feature)
    static async updateStatus(logId, newStatus) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('LogID', sql.Int, logId)
                .input('Status', sql.VarChar, newStatus)
                .query('UPDATE HabitLogs SET Status = @Status WHERE LogID = @LogID');
        } catch (err) { throw err; }
    }

    // NEW: Delete a specific accidental log
    static async delete(logId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('LogID', sql.Int, logId)
                .query('DELETE FROM HabitLogs WHERE LogID = @LogID');
        } catch (err) { throw err; }
    }

    // Original: Maintenance cleanup
    static async deleteOldPending() {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .execute('sp_CleanupPendingLogs'); 
        } catch (err) { throw err; }
    }

    // Original: Last 7 days failure report
    static async getRecentFailures() {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().query(`
                SELECT DISTINCT H.HabitName, H.Difficulty, L.CompletionDate
                FROM Habits H
                JOIN HabitLogs L ON H.HabitID = L.HabitID
                WHERE L.Status = 'Failed' AND L.CompletionDate > (GETDATE() - 7)
            `); 
            return result.recordset;
        } catch (err) { throw err; }
    }
}

module.exports = HabitLog;