const StreakHistory = require('../models/StreakHistory');

module.exports = {
    syncStreaks: async (req, res) => {
        try {
            await StreakHistory.resetExpired();
            res.json({ message: "Daily streak synchronization complete" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    getHabitStreak: async (req, res) => {
        try {
            const streak = await StreakHistory.getByHabitId(req.params.habitId);
            res.json(streak);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    getLeaderboard: async (req, res) => {
        try {
            const leader = await StreakHistory.getGlobalLeaderboard();
            res.json(leader);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    // NEW: The 4th Function for Requirement 2.8 (Badges)
    getMilestones: async (req, res) => {
        try {
            const days = req.params.days || 7; // Default to 7-day milestone
            const achievers = await StreakHistory.getMilestoneAchievers(days);
            res.json({
                milestone: `${days} Days`,
                count: achievers.length,
                users: achievers
            });
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};