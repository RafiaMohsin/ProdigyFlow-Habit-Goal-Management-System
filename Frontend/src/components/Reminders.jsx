import React, { useState } from 'react';

const ROOT_URL = 'http://localhost:3000';

const Reminders = () => {
    const [habitIdForList, setHabitIdForList] = useState('');
    const [reminders, setReminders] = useState([]);
    
    const [habitId, setHabitId] = useState('');
    const [reminderTime, setReminderTime] = useState(''); // expects HH:MM or HH:MM:SS
    const [frequency, setFrequency] = useState('Daily');

    const fetchReminders = async () => {
        if (!habitIdForList) return;
        try {
            const res = await fetch(`${ROOT_URL}/reminders/habit/${habitIdForList}`);
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

            const res = await fetch(`${ROOT_URL}/reminders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const res = await fetch(`${ROOT_URL}/reminders/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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
            const res = await fetch(`${ROOT_URL}/reminders/${reminderId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchReminders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Reminders Management</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Add Reminder</h3>
                <form onSubmit={addReminder} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="number" placeholder="Habit ID" value={habitId} onChange={e => setHabitId(e.target.value)} required />
                    <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} required />
                    <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                    <button type="submit">Set Reminder</button>
                </form>
            </div>

            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>View Habit Reminders</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input type="number" placeholder="Habit ID" value={habitIdForList} onChange={e => setHabitIdForList(e.target.value)} />
                    <button onClick={fetchReminders}>Fetch</button>
                </div>
                
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc' }}>
                            <th>ID</th>
                            <th>Time</th>
                            <th>Frequency</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminders.length > 0 ? reminders.map((r) => (
                            <tr key={r.ReminderID} style={{ borderBottom: '1px solid #eee' }}>
                                <td>{r.ReminderID}</td>
                                <td>{new Date(r.ReminderTime).toLocaleTimeString([], {timeStyle: 'short', timeZone: 'UTC'}) || 'Invalid Time'}</td>
                                <td>{r.Frequency}</td>
                                <td>{r.Status}</td>
                                <td>
                                    <button onClick={() => toggleStatus(r.ReminderID, r.Status)} style={{ marginRight: '5px' }}>Toggle Status</button>
                                    <button onClick={() => deleteReminder(r.ReminderID)}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5">No reminders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reminders;
