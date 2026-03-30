const { poolPromise, sql } = require('../config/db');

class Habit {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Habits');
    return result.recordset;
  }

  static async create(habit) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('HabitName', sql.VarChar, habit.HabitName)
      .input('Difficulty', sql.VarChar, habit.Difficulty)
      .input('Priority', sql.VarChar, habit.Priority)
      .input('UserID', sql.Int, habit.UserID)
      .input('CategoryID', sql.Int, habit.CategoryID)
      .query(`
        INSERT INTO Habits (HabitName, Difficulty, Priority, CreatedDate, UserID, CategoryID)
        OUTPUT inserted.*
        VALUES (@HabitName, @Difficulty, @Priority, GETDATE(), @UserID, @CategoryID)
      `);
    return result.recordset[0];
  }
}

module.exports = Habit;
