const sql = require('mssql');
const { config } = require('../config/db');

class Notification {
    static async getByUserId(userId) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('UserID', sql.Int, userId)
                .query(`SELECT N.*, NS.StatusName AS Status
                        FROM Notifications N
                        JOIN NotificationStatuses NS ON N.StatusID = NS.StatusID
                        WHERE N.UserID = @UserID ORDER BY N.CreatedDate DESC`);
            return result.recordset;
        } catch (err) { throw err; }
    }

    static async markAsRead(notificationId, userId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('NotificationID', sql.Int, notificationId)
                .input('UserID', sql.Int, userId)
                .query("UPDATE Notifications SET StatusID = (SELECT StatusID FROM NotificationStatuses WHERE StatusName = 'Read') WHERE NotificationID = @NotificationID AND UserID = @UserID");
        } catch (err) { throw err; }
    }

    static async archive(notificationId, userId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('NotificationID', sql.Int, notificationId)
                .input('UserID', sql.Int, userId)
                .query("UPDATE Notifications SET StatusID = (SELECT StatusID FROM NotificationStatuses WHERE StatusName = 'Archived') WHERE NotificationID = @NotificationID AND UserID = @UserID");
        } catch (err) { throw err; }
    }

    static async clearRead(userId) {
        try {
            let pool = await sql.connect(config);
            return await pool.request()
                .input('UserID', sql.Int, userId)
                .query("DELETE FROM Notifications WHERE UserID = @UserID AND StatusID = (SELECT StatusID FROM NotificationStatuses WHERE StatusName = 'Read')");
        } catch (err) { throw err; }
    }
}
module.exports = Notification;
