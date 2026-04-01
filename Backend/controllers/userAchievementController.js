const UserAchievement = require('../models/userAchievement');

module.exports = {
    awardBadge: async (req, res) => {
        try {
            await UserAchievement.award(req.body);
            res.status(201).json({ message: "Achievement awarded successfully!" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getUserBadges: async (req, res) => {
        try {
            const badges = await UserAchievement.getByUserId(req.params.userId);
            res.status(200).json(badges);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};