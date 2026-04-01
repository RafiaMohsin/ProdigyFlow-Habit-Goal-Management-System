const PerformanceReport = require('../models/performance');

module.exports = {
    addReport: async (req, res) => {
        try {
            await PerformanceReport.create(req.body);
            res.status(201).json({ message: "Performance report created" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    getUserReports: async (req, res) => {
        try {
            const reports = await PerformanceReport.getByUserId(req.params.userId);
            res.status(200).json(reports);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    getDashboardStats: async (req, res) => {
        try {
            const stats = await PerformanceReport.getUserStats(req.params.userId);
            res.status(200).json(stats);
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};