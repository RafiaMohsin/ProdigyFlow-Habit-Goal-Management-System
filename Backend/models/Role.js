const { poolPromise, sql } = require('../config/db');

class Role {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Roles');
    return result.recordset;
  }

  static async create(role) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('RoleName', sql.VarChar, role.RoleName)
      .query(`
        INSERT INTO Roles (RoleName)
        OUTPUT inserted.*
        VALUES (@RoleName)
      `);
    return result.recordset[0];
  }
}

module.exports = Role;
