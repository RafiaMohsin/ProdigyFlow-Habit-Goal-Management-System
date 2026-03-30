const { poolPromise, sql } = require('../config/db');

class Category {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Categories');
    return result.recordset;
  }

  static async create(category) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CategoryName', sql.VarChar, category.CategoryName)
      .query(`
        INSERT INTO Categories (CategoryName)
        OUTPUT inserted.*
        VALUES (@CategoryName)
      `);
    return result.recordset[0];
  }
  static async createWithSP(category) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CategoryName', sql.VarChar, category.CategoryName)
      .execute('sp_AddCategory');
    return result;
  }

  static async deleteWithSP(categoryId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('CategoryID', sql.Int, categoryId)
      .execute('sp_DeleteCategory');
    return result;
  }
}

module.exports = Category;
