const Achievement = require('../models/achievement');

module.exports = {
    getAvailable: async (req, res) => {
        try {
            const data = await Achievement.getAll();
            res.status(200).json(data);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    getUserBadges: async (req, res) => {
        try {
            const data = await Achievement.getEarnedByUser(req.params.userId);
            res.status(200).json(data);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    getRemainingAchievements: async (req, res) => {
        try {
            const data = await Achievement.getLockedAchievements(req.params.userId);
            res.status(200).json(data);
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};