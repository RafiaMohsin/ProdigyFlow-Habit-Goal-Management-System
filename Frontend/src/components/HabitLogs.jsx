import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function HabitLogs() {
  const [userId] = useState(localStorage.getItem('userId') || '1');
  const [habitId, setHabitId] = useState('');
  const [userHabits, setUserHabits] = useState([]);
  const [status, setStatus] = useState('Completed');
  const [logs, setLogs] = useState([]);
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/habits`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (res.ok) {
          const habits = await res.json();
          setUserHabits(habits);
          if (habits.length > 0) setHabitId(habits[0].HabitID);
        }
      } catch (err) { console.error('Error fetching habits:', err); }
    };
    fetchHabits();
  }, [userId]);

  const fetchLogs = async () => {
    if (!habitId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${habitId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching habit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchFailures();
  }, [habitId]);

  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ habitId, status })
      });
      if (response.ok) {
        fetchLogs();
      } else {
        console.error('Failed to log activity');
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleUpdateLog = async (logId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/correction`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ logId, status: newStatus })
      });
      if (response.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${logId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (response.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleCleanupLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/maintenance/cleanup`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (response.ok) {
        alert('Old pending logs cleaned up');
        fetchLogs();
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    }
  };

  const fetchFailures = async () => {
    if (!habitId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/logs/report/failures/${habitId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (response.ok) {
        const data = await response.json();
        setFailures(data);
      }
    } catch (error) {
      console.error('Error fetching failures:', error);
    }
  };

  // useEffect for fetching failures on mount has been merged with the habitId effect

  return (
    <div className="content">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ marginBottom: 0 }}>Habit Logs</h2>
          <button onClick={handleCleanupLogs} className="logout-btn" style={{ margin: 0, width: 'auto' }}>Cleanup Old Logs</button>
        </div>
        
        <div className="control-group" style={{ marginBottom: '24px' }}>
          <label style={{ fontWeight: '600', marginRight: '10px' }}>Select Habit: </label>
          <select 
            value={habitId} 
            onChange={(e) => setHabitId(e.target.value)} 
            style={{ width: '300px', display: 'inline-block', marginBottom: 0 }}
          >
            {userHabits.map(h => (
              <option key={h.HabitID} value={h.HabitID}>{h.HabitName}</option>
            ))}
            {userHabits.length === 0 && <option value="">No Habits Found</option>}
          </select>
        </div>

        <form onSubmit={handleLogActivity} className="add-form" style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Log New Activity</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: 0 }}>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <button type="submit" className="submit-btn" style={{ padding: '14px 32px' }}>Save Log</button>
        </form>

        <h3>Activity History</h3>
        {loading ? <p>Loading logs...</p> : (
          <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.LogID}>
                    <td>
                      <select 
                        value={log.Status} 
                        onChange={(e) => handleUpdateLog(log.LogID, e.target.value)}
                        style={{ margin: 0, padding: '6px 32px 6px 12px', width: 'auto', backgroundSize: '12px', fontSize: '13px', fontWeight: '600' }}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                        <option value="Skipped">Skipped</option>
                      </select>
                    </td>
                    <td>{new Date(log.CompletionDate).toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteLog(log.LogID)} className="logout-btn" style={{ margin: 0, padding: '6px 16px', width: 'auto', display: 'inline-block' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found for this habit.</p>}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: 0 }}>Recent Failures Report</h3>
          <button onClick={fetchFailures} className="submit-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>Refresh</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Habit Name</th>
                <th>Failure Date</th>
              </tr>
            </thead>
            <tbody>
              {failures.map((failure, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{failure.HabitName}</td>
                  <td style={{ color: '#ef4444' }}>{new Date(failure.CompletionDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {failures.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent failures found. Great job!</p>}
        </div>
      </div>
    </div>
  );
}

export default HabitLogs;
