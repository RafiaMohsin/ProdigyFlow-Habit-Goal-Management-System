import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [urgentGoals, setUrgentGoals] = useState([]);
  const [roleId] = useState(parseInt(localStorage.getItem('roleId')));
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '1');
  const [goalName, setGoalName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingProgressId, setEditingProgressId] = useState(null);
  const [editProgressValue, setEditProgressValue] = useState(0);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/goals/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrgentGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/urgent/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUrgentGoals(data);
      }
    } catch (error) {
      console.error('Error fetching urgent goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchUrgentGoals();
  }, [userId]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, goalName, targetDate })
      });
      if (response.ok) {
        setGoalName('');
        setTargetDate('');
        fetchGoals();
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to create goal');
        console.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateProgressSubmit = async (goalId) => {
    if (editProgressValue >= 0 && editProgressValue <= 100) {
      try {
        const response = await fetch(`${API_BASE_URL}/goals/progress`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ goalId, progress: parseInt(editProgressValue) })
        });
        if (response.ok) {
          setEditingProgressId(null);
          fetchGoals();
          fetchUrgentGoals();
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/goals/${goalId}/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          fetchGoals();
          fetchUrgentGoals();
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  return (
    <div className="content">
      <div className="card">
        <h2>Goals Management</h2>
        
        {roleId === 1 && (
          <div className="control-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', marginRight: '10px' }}>View Goals for User ID: </label>
            <input 
              type="number" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              placeholder="Enter User ID"
              style={{ width: 'auto', display: 'inline-block', marginBottom: 0 }}
            />
          </div>
        )}

        <form onSubmit={handleCreateGoal} className="add-form" style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
          <h3>Create New Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Goal Name" 
              value={goalName} 
              onChange={(e) => setGoalName(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
            <input 
              type="datetime-local" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
          </div>
          <button type="submit" className="submit-btn" style={{ width: '100%' }}>Create Goal</button>
        </form>

        <h3>{roleId === 1 ? `Goals for User ${userId}` : 'My Personal Goals'}</h3>
        {loading ? <p>Loading goals...</p> : (
          <div className="dashboard-grid">
            {goals.map(goal => (
              <div className="stat-card" key={goal.GoalID}>
                <div className="label">Target: {new Date(goal.TargetDate).toLocaleDateString()}</div>
                <div className="value" style={{ fontSize: '20px' }}>{goal.GoalName}</div>
                <div style={{ marginTop: '10px' }}>
                  <div className="label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{goal.Progress}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${goal.Progress}%`, backgroundColor: 'var(--primary)', height: '100%', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  {editingProgressId === goal.GoalID ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="number" 
                        min="0" max="100" 
                        value={editProgressValue}
                        onChange={(e) => setEditProgressValue(e.target.value)}
                        style={{ margin: 0, padding: '8px', flex: 1 }}
                      />
                      <button onClick={() => handleUpdateProgressSubmit(goal.GoalID)} className="submit-btn" style={{ padding: '8px 12px', fontSize: '12px', flex: 1 }}>Save</button>
                      <button onClick={() => setEditingProgressId(null)} className="logout-btn" style={{ margin: 0, padding: '8px 12px', fontSize: '12px', flex: 1 }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => {
                        setEditingProgressId(goal.GoalID);
                        setEditProgressValue(goal.Progress);
                      }} className="submit-btn" style={{ padding: '8px 12px', fontSize: '12px', flex: 1 }}>Update</button>
                      <button onClick={() => handleDeleteGoal(goal.GoalID)} className="logout-btn" style={{ marginTop: 0, padding: '8px 12px', fontSize: '12px', flex: 1 }}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {goals.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No goals found.</p>}
          </div>
        )}

        {urgentGoals.length > 0 && (
          <>
            <h3 style={{ marginTop: '32px', color: '#e74c3c' }}>Urgent Goals (Due within 7 days)</h3>
            <div className="dashboard-grid">
              {urgentGoals.map(goal => (
                <div className="stat-card" key={goal.GoalID} style={{ borderLeft: '4px solid #e74c3c' }}>
                  <div className="label">Target: {new Date(goal.TargetDate).toLocaleDateString()}</div>
                  <div className="value" style={{ fontSize: '20px' }}>{goal.GoalName}</div>
                  <div style={{ marginTop: '10px', color: '#e74c3c', fontWeight: 'bold' }}>
                    Progress: {goal.Progress}%
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Goals;
