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
      .input('Difficulty', sql.Int, habit.Difficulty)
      .input('Priority', sql.Int, habit.Priority)
      .input('UserID', sql.Int, habit.UserID)
      .input('CategoryID', sql.Int, habit.CategoryID)
      .query(`
        INSERT INTO Habits (HabitName, Difficulty, Priority, CreatedDate, UserID, CategoryID)
        OUTPUT inserted.*
        VALUES (@HabitName, @Difficulty, @Priority, GETDATE(), @UserID, @CategoryID)
      `);
    return result.recordset[0];
  }

  static async getDetails() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
          h.HabitID,
          h.HabitName,
          h.UserID,
          u.Username,
          c.CategoryName,
          h.Priority,
          h.Difficulty
      FROM Habits h
      JOIN Users u ON h.UserID = u.UserID
      JOIN Categories c ON h.CategoryID = c.CategoryID;
    `);
    return result.recordset;
  }

  static async getDetailsFromView() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM vw_HabitDetails');
    return result.recordset;
  }

  static async createWithSP(habit) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('HabitName', sql.VarChar, habit.HabitName)
      .input('Difficulty', sql.TinyInt, habit.Difficulty)
      .input('Priority', sql.TinyInt, habit.Priority)
      .input('UserID', sql.Int, habit.UserID)
      .input('CategoryID', sql.Int, habit.CategoryID)
      .execute('sp_AddHabit');
    return result;
  }

  static async getByUserSP(userID) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserID', sql.Int, userID)
      .execute('sp_GetHabitsByUser');
    return result.recordset;
  }
}

module.exports = Habit;
