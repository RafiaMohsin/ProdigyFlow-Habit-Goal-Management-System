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
                SELECT U.Username, H.HabitName, S.CurrentStreak 
                FROM StreakHistory S
                JOIN Habits H ON S.HabitID = H.HabitID
                JOIN Users U ON H.UserID = U.UserID
                WHERE S.CurrentStreak >= @Days
                ORDER BY S.CurrentStreak DESC
            `);
        return result.recordset;
    } catch (err) { throw err; }
}

    static async recalculateStreak(habitId) {
        try {
            let pool = await sql.connect(config);
            let logsResult = await pool.request()
                .input('HabitID', sql.Int, habitId)
                .query('SELECT Status, CompletionDate FROM HabitLogs WHERE HabitID = @HabitID ORDER BY CompletionDate ASC');
            
            let logs = logsResult.recordset;
            let currentStreak = 0;
            let longestStreak = 0;
            let lastUpdated = null;
            let streakByDay = new Map();

            for (let log of logs) {
                let dateKey = new Date(log.CompletionDate).toISOString().split('T')[0];
                streakByDay.set(dateKey, log.Status);
            }

            let sortedDates = Array.from(streakByDay.keys()).sort();
            
            if (sortedDates.length > 0) {
                let prevDate = null;
                for (let i = 0; i < sortedDates.length; i++) {
                    let dateStr = sortedDates[i];
                    let status = streakByDay.get(dateStr);
                    let currDate = new Date(dateStr);
                    currDate.setHours(0,0,0,0);

                    if (status === 'Completed') {
                        if (prevDate) {
                            let diffTime = Math.abs(currDate - prevDate);
                            let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
                            if (diffDays === 1) {
                                currentStreak++;
                            } else if (diffDays > 1) {
                                currentStreak = 1;
                            }
                        } else {
                            currentStreak = 1;
                        }
                    } else if (status === 'Failed' || status === 'Skipped') {
                        currentStreak = 0;
                    }
                    
                    if (currentStreak > longestStreak) longestStreak = currentStreak;
                    prevDate = currDate;
                    lastUpdated = currDate;
                }
            }

            if (lastUpdated) {
                let today = new Date();
                today.setHours(0,0,0,0);
                let lastDate = new Date(lastUpdated);
                lastDate.setHours(0,0,0,0);
                let diffTime = Math.abs(today - lastDate);
                let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 1) {
                    currentStreak = 0;
                }
            }
            
            let lastUpdatedDate = lastUpdated ? lastUpdated : new Date();

            await pool.request()
                .input('HabitID', sql.Int, habitId)
                .input('CurrentStreak', sql.Int, currentStreak)
                .input('LongestStreak', sql.Int, longestStreak)
                .input('LastUpdated', sql.DateTime, lastUpdatedDate)
                .query(`
                    IF EXISTS (SELECT 1 FROM StreakHistory WHERE HabitID = @HabitID)
                        UPDATE StreakHistory 
                        SET CurrentStreak = @CurrentStreak, LongestStreak = @LongestStreak, LastUpdated = @LastUpdated 
                        WHERE HabitID = @HabitID
                    ELSE
                        INSERT INTO StreakHistory (HabitID, CurrentStreak, LongestStreak, LastUpdated)
                        VALUES (@HabitID, @CurrentStreak, @LongestStreak, @LastUpdated)
                `);
                
            return { currentStreak, longestStreak };
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
                ORDER BY S.LongestStreak DESC
            `); 
            return result.recordset;
        } catch (err) { throw err; }
    }
}
module.exports = StreakHistory;
