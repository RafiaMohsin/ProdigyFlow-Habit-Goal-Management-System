const { poolPromise, sql } = require('../config/db');

class User {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
  }

  static async create(user) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Username', sql.VarChar, user.Username)
      .input('Email', sql.VarChar, user.Email)
      .input('PasswordHash', sql.VarChar, user.PasswordHash)
      .input('RoleID', sql.Int, user.RoleID || null)
      .query(`
        INSERT INTO Users (Username, Email, PasswordHash, CreatedDate, RoleID)
        OUTPUT inserted.*
        VALUES (@Username, @Email, @PasswordHash, GETDATE(), @RoleID)
      `);
    return result.recordset[0];
  }

  static async getStats() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT u.Username, COUNT(h.HabitID) AS TotalHabits
      FROM Users u
      LEFT JOIN Habits h ON u.UserID = h.UserID
      GROUP BY u.Username;
    `);
    return result.recordset;
  }

  static async getStatsFromView() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vw_UserHabitStats');
    return result.recordset;
  }

  static async findByEmail(email) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @Email');
    return result.recordset[0];
  }

  static async getDashboardStats(userId, roleId) {
    const pool = await poolPromise;
    const request = pool.request();
    
    let habitQuery = 'SELECT COUNT(*) as count FROM Habits';
    let goalQuery = 'SELECT COUNT(*) as count FROM Goals WHERE Progress < 100';
    let achievementQuery = 'SELECT COUNT(*) as count FROM UserAchievements';
    let notificationQuery = 'SELECT COUNT(*) as count FROM Notifications WHERE Status = \'Unread\'';
    let userQuery = 'SELECT COUNT(*) as count FROM Users';

    if (roleId !== 1) {
      request.input('userId', sql.Int, userId);
      habitQuery += ' WHERE UserID = @userId';
      goalQuery += ' AND UserID = @userId';
      achievementQuery += ' WHERE UserID = @userId';
      notificationQuery += ' AND UserID = @userId';
    }

    const [habits, goals, achievements, notifications, users] = await Promise.all([
      request.query(habitQuery),
      request.query(goalQuery),
      request.query(achievementQuery),
      request.query(notificationQuery),
      request.query(userQuery)
    ]);

    return {
      habitCount: habits.recordset[0].count,
      goalCount: goals.recordset[0].count,
      achievementCount: achievements.recordset[0].count,
      notificationCount: notifications.recordset[0].count,
      userCount: users.recordset[0].count
    };
  }
}

module.exports = User;
