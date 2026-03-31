const GoalHabit = require('../models/GoalHabit');

module.exports = {
    // 1. Link a Habit to a Goal (Many-to-Many)
    link: async (req, res) => {
        try {
            const { goalId, habitId } = req.body;
            
            if (!goalId || !habitId) {
                return res.status(400).json({ error: "Both goalId and habitId are required" });
            }

            await GoalHabit.linkHabit(goalId, habitId);
            res.status(201).json({ message: "Habit successfully linked to goal" });
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    },

    // 2. Get all habits for a goal using the vw_GoalProgressDetails View
    getGoalComposition: async (req, res) => {
        try {
            const { goalId } = req.params;
            const habits = await GoalHabit.getHabitsByGoal(goalId);
            
            res.status(200).json(habits);
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    },

    // 3. Remove a specific link between a goal and a habit
    unlink: async (req, res) => {
        try {
            const { id } = req.params; // This is the GoalHabitID (Primary Key)
            await GoalHabit.removeLink(id);
            res.status(200).json({ message: "Habit successfully unlinked from goal" });
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    }
};