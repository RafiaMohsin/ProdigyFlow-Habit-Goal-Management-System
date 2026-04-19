import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function HabitLogs() {
  const [habitId, setHabitId] = useState('1');
  const [status, setStatus] = useState('Completed');
  const [logs, setLogs] = useState([]);
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!habitId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${habitId}`);
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
  }, [habitId]);

  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch(`${API_BASE_URL}/logs/${logId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleCleanupLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/maintenance/cleanup`, { method: 'DELETE' });
      if (response.ok) {
        alert('Old pending logs cleaned up');
        fetchLogs();
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    }
  };

  const fetchFailures = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/report/failures`);
      if (response.ok) {
        const data = await response.json();
        setFailures(data);
      }
    } catch (error) {
      console.error('Error fetching failures:', error);
    }
  };

  useEffect(() => {
    fetchFailures();
  }, []);

  return (
    <div className="component-container">
      <h2>Habit Logs</h2>
      
      <div className="control-group">
        <label>View Logs for Habit ID: </label>
        <input 
          type="number" 
          value={habitId} 
          onChange={(e) => setHabitId(e.target.value)} 
          placeholder="Enter Habit ID"
        />
        <button onClick={handleCleanupLogs} className="action-button" style={{marginLeft: '10px', backgroundColor: '#e74c3c'}}>Cleanup Old Logs</button>
      </div>

      <hr />

      <form onSubmit={handleLogActivity} className="add-form">
        <h3>Log Activity</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Skipped">Skipped</option>
        </select>
        <button type="submit">Log Status</button>
      </form>

      <hr />

      <h3>Activity History</h3>
      {loading ? <p>Loading logs...</p> : (
        <ul className="item-list">
          {logs.map(log => (
            <li key={log.LogID}>
              <strong>{log.Status}</strong> - Date: {new Date(log.CompletionDate).toLocaleString()}
              <div style={{marginTop: '5px'}}>
                <select 
                  value={log.Status} 
                  onChange={(e) => handleUpdateLog(log.LogID, e.target.value)}
                  style={{marginRight: '10px'}}
                >
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Skipped">Skipped</option>
                </select>
                <button onClick={() => handleDeleteLog(log.LogID)} style={{backgroundColor: '#e74c3c'}}>Delete</button>
              </div>
            </li>
          ))}
          {logs.length === 0 && <p>No logs found for this habit.</p>}
        </ul>
      )}

      <hr />
      
      <h3>Recent Failures Report</h3>
      <button onClick={fetchFailures} style={{marginBottom: '10px'}}>Refresh Failures</button>
      <ul className="item-list">
        {failures.map((failure, index) => (
          <li key={index}>
            Habit ID: {failure.HabitID} - Failed on {new Date(failure.CompletionDate).toLocaleString()}
          </li>
        ))}
        {failures.length === 0 && <p>No recent failures found.</p>}
      </ul>
    </div>
  );
}

export default HabitLogs;
