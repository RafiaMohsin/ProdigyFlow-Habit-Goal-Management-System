const sql = require('mssql');
const { config } = require('../config/db');

class StreakHistory {
    // Original: Syncs streaks based on LastUpdated
    static async resetExpired() {
        try {
            let pool = await sql.connect(config);
            return await pool.request().execute('sp_SyncExpiredStreaks'); 
        } catch (err) { throw err; }
    }

    // NEW: Requirement 2.6 - Get specific user's streak data
    static async getByHabitId(habitId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('HabitID', sql.Int, habitId)
                .query('SELECT CurrentStreak, LongestStreak, LastUpdated FROM StreakHistory WHERE HabitID = @HabitID');
            return result.recordset[0];
        } catch (err) { throw err; }
    }

    // NEW: Requirement 2.8 - Identify users for "Badges" (e.g., 30-day streak)
    static async getMilestoneAchievers(days) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Days', sql.Int, days)
            .query(`
                SELECT H.UserID, S.HabitID, S.CurrentStreak 
                FROM StreakHistory S
                JOIN Habits H ON S.HabitID = H.HabitID
                WHERE S.CurrentStreak >= @Days
            `); // Joined with Habits to access UserID
        return result.recordset;
    } catch (err) { throw err; }
}

    // Original: Global Top Performer
    static async getGlobalLeaderboard() {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().query(`
                SELECT U.Username, H.HabitName, S.LongestStreak
                FROM Users U
                JOIN Habits H ON U.UserID = H.UserID
                JOIN StreakHistory S ON H.HabitID = S.HabitID
                WHERE S.LongestStreak = (SELECT MAX(LongestStreak) FROM StreakHistory)
            `); 
            return result.recordset;
        } catch (err) { throw err; }
    }
}
module.exports = StreakHistory;