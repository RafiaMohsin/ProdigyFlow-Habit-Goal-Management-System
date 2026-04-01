const sql = require('mssql');
const { config } = require('../config/db');

class Achievement {
    static async getAll() {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().query('SELECT * FROM Achievements');
            return result.recordset;
        } catch (err) { throw err; }
    }

    static async getEarnedByUser(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query(`SELECT A.Title, A.Description, UA.EarnedDate 
                        FROM UserAchievements UA 
                        JOIN Achievements A ON UA.AchievementID = A.AchievementID 
                        WHERE UA.UserID = @UserID`);
            return result.recordset;
        } catch (err) { throw err; }
    }

    static async getLockedAchievements(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query(`
                    SELECT * FROM Achievements 
                    WHERE AchievementID NOT IN (
                        SELECT AchievementID FROM UserAchievements WHERE UserID = @UserID
                    )
                `);
            return result.recordset;
        } catch (err) { throw err; }
    }
}
module.exports = Achievement;