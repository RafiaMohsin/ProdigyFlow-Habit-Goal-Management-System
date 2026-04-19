import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [urgentGoals, setUrgentGoals] = useState([]);
  const [userId, setUserId] = useState('1'); // Defaulting to 1 for demo
  const [goalName, setGoalName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/goals/user/${userId}`);
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
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/goals/urgent/${userId}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goalName, targetDate })
      });
      if (response.ok) {
        setGoalName('');
        setTargetDate('');
        fetchGoals();
      } else {
        console.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateProgress = async (goalId, currentProgress) => {
    const newProgress = prompt('Enter new progress (0-100):', currentProgress);
    if (newProgress !== null && !isNaN(newProgress)) {
      try {
        const response = await fetch(`${API_BASE_URL}/goals/progress`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goalId, progress: parseInt(newProgress) })
        });
        if (response.ok) {
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
          method: 'DELETE'
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
    <div className="component-container">
      <h2>Goals Management</h2>
      
      <div className="control-group">
        <label>View Goals for User ID: </label>
        <input 
          type="number" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          placeholder="Enter User ID"
        />
      </div>

      <hr />

      <form onSubmit={handleCreateGoal} className="add-form">
        <h3>Create New Goal</h3>
        <input 
          type="text" 
          placeholder="Goal Name" 
          value={goalName} 
          onChange={(e) => setGoalName(e.target.value)} 
          required 
        />
        <input 
          type="datetime-local" 
          value={targetDate} 
          onChange={(e) => setTargetDate(e.target.value)} 
          required 
        />
        <button type="submit">Create Goal</button>
      </form>

      <hr />

      <h3>User Goals</h3>
      {loading ? <p>Loading goals...</p> : (
        <ul className="item-list">
          {goals.map(goal => (
            <li key={goal.GoalID}>
              <strong>{goal.GoalName}</strong> - Target: {new Date(goal.TargetDate).toLocaleString()} - Progress: {goal.Progress}%
              <div style={{marginTop: '5px'}}>
                <button onClick={() => handleUpdateProgress(goal.GoalID, goal.Progress)} style={{marginRight: '10px'}}>Update Progress</button>
                <button onClick={() => handleDeleteGoal(goal.GoalID)} style={{backgroundColor: '#e74c3c'}}>Delete</button>
              </div>
            </li>
          ))}
          {goals.length === 0 && <p>No goals found for this user.</p>}
        </ul>
      )}

      <hr />

      <h3>Urgent Goals (Due within 7 days)</h3>
      <ul className="item-list">
        {urgentGoals.map(goal => (
          <li key={goal.GoalID} style={{borderLeft: '4px solid #e74c3c'}}>
            <strong>{goal.GoalName}</strong> - Target: {new Date(goal.TargetDate).toLocaleString()} - Progress: {goal.Progress}%
          </li>
        ))}
        {urgentGoals.length === 0 && <p>No urgent goals.</p>}
      </ul>
    </div>
  );
}

export default Goals;
