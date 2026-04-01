const sql = require('mssql');
const { config } = require('../config/db');

class PerformanceReport {
    static async create(data) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('UserID', sql.Int, data.userId)
                .input('ReportType', sql.VarChar(50), data.reportType)
                .input('CompletionRate', sql.Decimal(5, 2), data.completionRate)
                .input('ConsistencyScore', sql.Decimal(5, 2), data.consistencyScore)
                .query(`INSERT INTO PerformanceReport (UserID, ReportType, CompletionRate, ConsistencyScore) 
                        VALUES (@UserID, @ReportType, @CompletionRate, @ConsistencyScore)`);
        } catch (err) { throw err; }
    }

    static async getByUserId(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query('SELECT * FROM PerformanceReport WHERE UserID = @UserID ORDER BY GeneratedDate DESC');
            return result.recordset;
        } catch (err) { throw err; }
    }


    static async getUserStats(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query(`
                    SELECT 
                        AVG(CompletionRate) AS AvgCompletion, 
                        AVG(ConsistencyScore) AS AvgConsistency,
                        COUNT(ReportID) AS TotalReports
                    FROM PerformanceReport 
                    WHERE UserID = @UserID
                `);
            return result.recordset[0];
        } catch (err) { throw err; }
    }
}
module.exports = PerformanceReport;