const Reminder = require('../models/reminder');

module.exports = {
    setReminder: async (req, res) => {
        try {
            await Reminder.create(req.body);
            res.status(201).json({ message: "Reminder set" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    getReminders: async (req, res) => {
        try {
            const data = await Reminder.getByHabit(req.params.habitId);
            res.status(200).json(data);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    updateReminderStatus: async (req, res) => {
        try {
            const { reminderId, status } = req.body;
            await Reminder.toggleStatus(reminderId, status);
            res.status(200).json({ message: `Reminder is now ${status}` });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    removeReminder: async (req, res) => {
        try {
            await Reminder.delete(req.params.reminderId);
            res.status(200).json({ message: "Reminder deleted" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};