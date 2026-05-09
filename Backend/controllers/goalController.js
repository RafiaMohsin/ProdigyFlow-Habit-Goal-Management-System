const Goal = require('../models/Goal');

module.exports = {
    // 1. Create a new Goal
    createGoal: async (req, res) => {
        try {
            // goalData expected: { userId, goalName, targetDate, progress }
            const { targetDate } = req.body;
            if (targetDate && new Date(targetDate) < new Date()) {
                return res.status(400).json({ error: "Target date and time cannot be in the past" });
            }
            await Goal.create(req.body);
            res.status(201).json({ message: "Goal created successfully" });
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    },

    // 2. Fetch all goals for the logged-in user
    getUserGoals: async (req, res) => {
        try {
            // Favor logged-in user ID, but allow admin to specify another ID
            const userId = (req.user.roleId === 1 && req.params.userId) ? req.params.userId : req.user.id;
            const goals = await Goal.getByUserId(userId);
            res.status(200).json(goals);
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    },

    // 3. Update the progress percentage of a goal
    updateGoalProgress: async (req, res) => {
        try {
            const { goalId, progress } = req.body;
            // Validates that progress is provided
            if (progress === undefined) {
                return res.status(400).json({ error: "Progress value is required" });
            }
            await Goal.updateProgress(goalId, progress);
            res.status(200).json({ message: `Goal progress updated to ${progress}%` });
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    },
    
    removeGoal: async (req, res) => {
        try {
            const { goalId, userId } = req.params;
            await Goal.delete(goalId, userId);
            res.json({ message: "Goal deleted" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    // 4. Get urgent goals for the logged-in user
    getUrgent: async (req, res) => {
        try {
            const userId = (req.user.roleId === 1 && req.params.userId) ? req.params.userId : req.user.id;
            const goals = await Goal.getUrgentGoals(userId);
            res.status(200).json(goals);
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    }
};
