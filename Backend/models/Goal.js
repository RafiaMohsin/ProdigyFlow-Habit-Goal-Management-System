const sql = require('mssql');
const { config } = require('../config/db');

class Goal {
    static async create(goalData) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('UserID', sql.Int, goalData.userId)
                .input('GoalName', sql.VarChar, goalData.goalName)
                .input('TargetDate', sql.DateTime, goalData.targetDate)
                .input('Progress', sql.Decimal(5, 2), goalData.progress || 0.00) // DECIMAL(5,2)
                .query('INSERT INTO Goals (UserID, GoalName, TargetDate, Progress) VALUES (@UserID, @GoalName, @TargetDate, @Progress)');
        } catch (err) { throw err; }
    }

    static async getByUserId(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query('SELECT * FROM Goals WHERE UserID = @UserID ORDER BY TargetDate ASC');
            return result.recordset;
        } catch (err) { throw err; }
    }

    static async delete(goalId, userId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('GoalID', sql.Int, goalId)
                .input('UserID', sql.Int, userId)
                .query('DELETE FROM Goals WHERE GoalID = @GoalID AND UserID = @UserID');
        } catch (err) { throw err; }
    }

    static async updateProgress(goalId, progress) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('GoalID', sql.Int, goalId)
                .input('Progress', sql.Decimal(5, 2), progress)
                .query('UPDATE Goals SET Progress = @Progress WHERE GoalID = @GoalID');
        } catch (err) { throw err; }
    }

    static async getUrgentGoals(userId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT * FROM Goals WHERE UserID = @UserID AND TargetDate <= (GETDATE() + 7) AND Progress < 100');
        return result.recordset;
    } catch (err) { throw err; }
}
}
module.exports = Goal;