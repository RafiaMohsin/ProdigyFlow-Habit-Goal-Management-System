const Notification = require('../models/notification');

module.exports = {
    getNotifications: async (req, res) => {
        try {
            const data = await Notification.getByUserId(req.params.userId);
            res.status(200).json(data);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    updateReadStatus: async (req, res) => {
        try {
            const { notificationId, userId } = req.body;
            await Notification.markAsRead(notificationId, userId);
            res.status(200).json({ message: "Notification read" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    archiveNotification: async (req, res) => {
        try {
            const { notificationId, userId } = req.body;
            await Notification.archive(notificationId, userId);
            res.status(200).json({ message: "Notification archived" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    clearReadNotifications: async (req, res) => {
        try {
            await Notification.clearRead(req.params.userId);
            res.status(200).json({ message: "Read notifications cleared" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};