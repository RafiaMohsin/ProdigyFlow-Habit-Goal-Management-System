import React, { useState } from 'react';

const ROOT_URL = 'http://localhost:3000';

const Notifications = () => {
    const [userId, setUserId] = useState('');
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${ROOT_URL}/notifications/${userId}`);
            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const res = await fetch(`${ROOT_URL}/notifications/mark-read`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId, userId })
            });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const archiveNotification = async (notificationId) => {
        try {
            const res = await fetch(`${ROOT_URL}/notifications/archive`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId, userId })
            });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const clearReadNotifications = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${ROOT_URL}/notifications/clear/${userId}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Notifications Management</h2>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>View User Notifications</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
                    <button onClick={fetchNotifications}>Fetch Notifications</button>
                    <button onClick={clearReadNotifications} style={{ background: '#dc3545', color: 'white' }}>Clear Read Notifications</button>
                </div>
                
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc' }}>
                            <th>ID</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length > 0 ? notifications.map((n) => (
                            <tr key={n.NotificationID} style={{ borderBottom: '1px solid #eee' }}>
                                <td>{n.NotificationID}</td>
                                <td>{n.Message}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                        backgroundColor: n.Status === 'Unread' ? '#ffe4e6' : n.Status === 'Read' ? '#dcfce7' : '#f1f5f9',
                                        color: n.Status === 'Unread' ? '#e11d48' : n.Status === 'Read' ? '#16a34a' : '#475569'
                                    }}>
                                        {n.Status}
                                    </span>
                                </td>
                                <td>{new Date(n.CreatedDate).toLocaleString()}</td>
                                <td>
                                    {n.Status !== 'Read' && n.Status !== 'Archived' && (
                                        <button onClick={() => markAsRead(n.NotificationID)} style={{ marginRight: '5px' }}>Mark Read</button>
                                    )}
                                    {n.Status !== 'Archived' && (
                                        <button onClick={() => archiveNotification(n.NotificationID)}>Archive</button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5">No notifications found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Notifications;
