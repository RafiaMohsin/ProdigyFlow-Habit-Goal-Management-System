const HabitLog = require('../models/HabitLog');

module.exports = {
    logActivity: async (req, res) => {
        try {
            await HabitLog.create(req.body);
            res.status(201).json({ message: "Habit activity logged successfully" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    getLogsByHabit: async (req, res) => {
        try {
            const logs = await HabitLog.getByHabitId(req.params.habitId);
            res.json(logs);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    updateLog: async (req, res) => {
        try {
            const { logId, status } = req.body;
            await HabitLog.updateStatus(logId, status);
            res.json({ message: "Log status corrected" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    deleteLog: async (req, res) => {
        try {
            await HabitLog.delete(req.params.logId);
            res.json({ message: "Log entry removed" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    cleanupLogs: async (req, res) => {
        try {
            await HabitLog.deleteOldPending();
            res.json({ message: "Old pending logs cleaned up" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    getFailures: async (req, res) => {
        try {
            const failures = await HabitLog.getRecentFailures();
            res.json(failures);
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};