const sql = require('mssql');
const { config } = require('../config/db');

class GoalHabit {
    static async linkHabit(goalId, habitId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('GoalID', sql.Int, goalId)
                .input('HabitID', sql.Int, habitId)
                .query('INSERT INTO GoalHabit (GoalID, HabitID) VALUES (@GoalID, @HabitID)');
        } catch (err) { throw err; }
    }

    static async getHabitsByGoal(goalId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('GoalID', sql.Int, goalId)
                .query('SELECT * FROM vw_GoalProgressDetails WHERE GoalID = @GoalID');
            return result.recordset; 
        } catch (err) { throw err; }
    }

    static async removeLink(goalHabitId) {
    try {
        let pool = await sql.connect(config);
        return await pool.request()
            .input('ID', sql.Int, goalHabitId)
            .query('DELETE FROM GoalHabit WHERE GoalHabitID = @ID');
    } catch (err) { throw err; }
}
}
module.exports = GoalHabit;