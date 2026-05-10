import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Notifications = () => {
    const [userId, setUserId] = useState('');
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/notifications/${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/notifications/mark-read`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ notificationId, userId })
            });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const archiveNotification = async (notificationId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/notifications/archive`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
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
            const res = await fetch(`${API_BASE_URL}/notifications/clear/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="premium-container">
            <div className="header-section">
                <h2>Notifications Management</h2>
                <p>Stay updated with alerts, reminders, and system messages</p>
            </div>
            
            <div className="glass-card">
                <div className="action-header">
                    <h3><span className="icon">🔔</span> View User Notifications</h3>
                    <div className="action-buttons">
                        {notifications.length > 0 && notifications.some(n => n.Status === 'Read') && (
                            <button onClick={clearReadNotifications} className="premium-button danger">Clear Read</button>
                        )}
                    </div>
                </div>

                <div className="search-bar">
                    <input type="number" placeholder="Enter User ID" value={userId} onChange={e => setUserId(e.target.value)} className="premium-input search-input" />
                    <button onClick={fetchNotifications} className="premium-button secondary">Fetch Notifications</button>
                </div>
                
                <div className="table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length > 0 ? notifications.map((n) => (
                                <tr key={n.NotificationID} className={n.Status === 'Unread' ? 'unread-row' : ''}>
                                    <td>
                                        <span className={`status-badge ${n.Status?.toLowerCase()}`}>
                                            {n.Status === 'Unread' ? '🔴' : n.Status === 'Read' ? '🟢' : '⚪'} {n.Status}
                                        </span>
                                    </td>
                                    <td className={`message-cell ${n.Status === 'Unread' ? 'font-bold' : ''}`}>
                                        {n.Message}
                                    </td>
                                    <td className="date-cell">{new Date(n.CreatedDate).toLocaleString()}</td>
                                    <td>
                                        <div className="action-group">
                                            {n.Status !== 'Read' && n.Status !== 'Archived' && (
                                                <button onClick={() => markAsRead(n.NotificationID)} className="action-btn success-btn" title="Mark Read">✓</button>
                                            )}
                                            {n.Status !== 'Archived' && (
                                                <button onClick={() => archiveNotification(n.NotificationID)} className="action-btn archive-btn" title="Archive">📦</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="empty-state">No notifications found for this user.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .premium-container {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: 'Inter', system-ui, sans-serif;
                    animation: fadeIn 0.6s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .header-section {
                    margin-bottom: 32px;
                    text-align: center;
                }

                .header-section h2 {
                    font-size: 36px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }

                .header-section p {
                    color: #64748b;
                    font-size: 16px;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .glass-card:hover {
                    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.1);
                }

                .action-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .action-header h3 {
                    display: flex;
                    align-items: center;
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }

                .icon { margin-right: 12px; font-size: 28px; }

                .search-bar {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 28px;
                    max-width: 500px;
                }

                .premium-input {
                    background: #f8fafc;
                    border: 2px solid transparent;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-size: 15px;
                    color: #334155;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .premium-input:focus {
                    background: white;
                    border-color: #ec4899;
                    box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
                }

                .search-input { flex: 1; }

                .premium-button {
                    background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .premium-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(236, 72, 153, 0.4);
                }

                .premium-button.secondary { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
                .premium-button.secondary:hover { box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3); }
                .premium-button.danger { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 10px 20px; font-size: 14px; }
                .premium-button.danger:hover { box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.3); }

                .table-container {
                    overflow-x: auto;
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                }

                .premium-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .premium-table th {
                    background: #f8fafc;
                    padding: 16px 24px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }

                .premium-table td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    font-size: 15px;
                    vertical-align: middle;
                }

                .premium-table tr.unread-row td { background: #fdf2f8; }
                .premium-table tr:hover td { background: #f8fafc; }
                .premium-table tr.unread-row:hover td { background: #fce7f3; }
                .premium-table tr:last-child td { border-bottom: none; }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-badge.unread { background: white; color: #be185d; border: 1px solid #fbcfe8; }
                .status-badge.read { background: #dcfce7; color: #16a34a; }
                .status-badge.archived { background: #f1f5f9; color: #64748b; }

                .message-cell { line-height: 1.5; color: #1e293b; }
                .font-bold { font-weight: 600; }
                .date-cell { color: #64748b; font-size: 14px; }

                .action-group {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 16px;
                }

                .success-btn { background: #dcfce7; color: #16a34a; }
                .success-btn:hover { background: #bbf7d0; transform: scale(1.05); }

                .archive-btn { background: #f1f5f9; color: #475569; }
                .archive-btn:hover { background: #e2e8f0; transform: scale(1.05); }

                .empty-state {
                    text-align: center;
                    padding: 48px !important;
                    color: #94a3b8 !important;
                    font-size: 16px !important;
                }
            `}</style>
        </div>
    );
};

export default Notifications;
