import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Reminders = () => {
    const [habitIdForList, setHabitIdForList] = useState('');
    const [reminders, setReminders] = useState([]);
    
    const [habitId, setHabitId] = useState('');
    const [reminderTime, setReminderTime] = useState(''); // expects HH:MM or HH:MM:SS
    const [frequency, setFrequency] = useState('Daily');

    const fetchReminders = async () => {
        if (!habitIdForList) return;
        try {
            const res = await fetch(`${API_BASE_URL}/reminders/habit/${habitIdForList}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setReminders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const addReminder = async (e) => {
        e.preventDefault();
        try {
            // append :00 if reminderTime only has HH:MM to satisfy time string splitting in backend safely
            let formattedTime = reminderTime;
            if (formattedTime.length === 5) {
                formattedTime += ':00';
            }

            const res = await fetch(`${API_BASE_URL}/reminders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ habitId, reminderTime: formattedTime, frequency })
            });
            if (res.ok) {
                alert('Reminder set successfully');
                setHabitId('');
                setReminderTime('');
                setFrequency('Daily');
                if (habitIdForList === habitId) fetchReminders();
            } else {
                const errorText = await res.text();
                alert('Error setting reminder: ' + errorText);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (reminderId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            const res = await fetch(`${API_BASE_URL}/reminders/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ reminderId, status: newStatus })
            });
            if (res.ok) {
                fetchReminders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteReminder = async (reminderId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                fetchReminders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="premium-container">
            <div className="header-section">
                <h2>Reminders Management</h2>
                <p>Set custom alerts and schedules for your habits</p>
            </div>
            
            <div className="management-layout">
                <div className="glass-card">
                    <h3><span className="icon">⏰</span> Set New Reminder</h3>
                    <form onSubmit={addReminder} className="premium-form">
                        <div className="input-group">
                            <label>Habit ID</label>
                            <input type="number" placeholder="Enter Habit ID" value={habitId} onChange={e => setHabitId(e.target.value)} required className="premium-input" />
                        </div>
                        <div className="input-group">
                            <label>Time</label>
                            <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} required className="premium-input" />
                        </div>
                        <div className="input-group">
                            <label>Frequency</label>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="premium-input">
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="premium-button">Save Reminder</button>
                        </div>
                    </form>
                </div>

                <div className="glass-card">
                    <h3><span className="icon">📋</span> View Habit Reminders</h3>
                    <div className="search-bar">
                        <input type="number" placeholder="Enter Habit ID to view its reminders" value={habitIdForList} onChange={e => setHabitIdForList(e.target.value)} className="premium-input search-input" />
                        <button onClick={fetchReminders} className="premium-button secondary">Fetch Reminders</button>
                    </div>
                    
                    <div className="table-container">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Frequency</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reminders.length > 0 ? reminders.map((r) => (
                                    <tr key={r.ReminderID} className={r.Status === 'Inactive' ? 'inactive-row' : ''}>
                                        <td>
                                            <div className="time-display">
                                                <span className="time-icon">🕛</span>
                                                <span className="time-text">
                                                    {new Date(r.ReminderTime).toLocaleTimeString([], {timeStyle: 'short', timeZone: 'UTC'}) || 'Invalid Time'}
                                                </span>
                                            </div>
                                        </td>
                                        <td><span className={`badge ${r.Frequency?.toLowerCase()}`}>{r.Frequency}</span></td>
                                        <td>
                                            <div className="toggle-container" onClick={() => toggleStatus(r.ReminderID, r.Status)}>
                                                <div className={`toggle-switch ${r.Status === 'Active' ? 'active' : ''}`}></div>
                                                <span className={`status-label ${r.Status?.toLowerCase()}`}>{r.Status}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button onClick={() => deleteReminder(r.ReminderID)} className="action-btn danger-btn" title="Delete Reminder">
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="empty-state">No reminders set for this habit.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }

                .header-section p {
                    color: #64748b;
                    font-size: 16px;
                }

                .management-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
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

                .glass-card h3 {
                    display: flex;
                    align-items: center;
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 24px;
                }

                .icon { margin-right: 12px; font-size: 28px; }

                .premium-form {
                    display: flex;
                    gap: 20px;
                    align-items: flex-end;
                    flex-wrap: wrap;
                }

                .input-group {
                    flex: 1;
                    min-width: 200px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin-left: 4px;
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
                    width: 100%;
                    box-sizing: border-box;
                }

                .premium-input:focus {
                    background: white;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
                }

                .form-actions {
                    display: flex;
                    align-items: flex-end;
                    padding-bottom: 2px;
                }

                .premium-button {
                    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .premium-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.4);
                }

                .premium-button.secondary { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
                .premium-button.secondary:hover { box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3); }

                .search-bar {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 28px;
                    max-width: 600px;
                }

                .search-input { flex: 1; }

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

                .premium-table tr.inactive-row td { background: #fafafa; opacity: 0.8; }
                .premium-table tr:last-child td { border-bottom: none; }
                .premium-table tr:hover td { background: #f8fafc; }

                .time-display {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 16px;
                }

                .time-icon { font-size: 18px; }

                .badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-block;
                }

                .badge.daily { background: #dbeafe; color: #1e40af; }
                .badge.weekly { background: #fef08a; color: #854d0e; }
                .badge.monthly { background: #fae8ff; color: #86198f; }

                .toggle-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }

                .toggle-switch {
                    width: 44px;
                    height: 24px;
                    background: #e2e8f0;
                    border-radius: 12px;
                    position: relative;
                    transition: background 0.3s ease;
                }

                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .toggle-switch.active { background: #10b981; }
                .toggle-switch.active::after { transform: translateX(20px); }

                .status-label {
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .status-label.active { color: #10b981; }
                .status-label.inactive { color: #94a3b8; }

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

                .danger-btn { background: #fee2e2; color: #ef4444; }
                .danger-btn:hover { background: #fecaca; transform: scale(1.05); }

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

export default Reminders;
