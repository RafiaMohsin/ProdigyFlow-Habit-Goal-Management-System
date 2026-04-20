const sql = require('mssql');
const { config } = require('../config/db');

class UserAchievement {
    static async award(data) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('UserID', sql.Int, data.userId)
                .input('AchievementID', sql.Int, data.achievementId)
                .input('EarnedDate', sql.DateTime, new Date())
                .query(`
                    DECLARE @NextID INT = ISNULL((SELECT MAX(UserAchievementID) FROM UserAchievements), 0) + 1;
                    INSERT INTO UserAchievements (UserAchievementID, UserID, AchievementID, EarnedDate)
                    VALUES (@NextID, @UserID, @AchievementID, @EarnedDate)
                `);
        } catch (err) { throw err; }
    }

    static async getByUserId(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query(`
                    SELECT UA.UserAchievementID, A.Title, A.Description, UA.EarnedDate
                    FROM UserAchievements UA
                    JOIN Achievements A ON UA.AchievementID = A.AchievementID
                    WHERE UA.UserID = @UserID
                    ORDER BY UA.EarnedDate DESC
                `);
            return result.recordset;
        } catch (err) { throw err; }
    }
}

module.exports = UserAchievement;
