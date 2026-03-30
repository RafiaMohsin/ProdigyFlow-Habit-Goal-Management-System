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
}

module.exports = User;
