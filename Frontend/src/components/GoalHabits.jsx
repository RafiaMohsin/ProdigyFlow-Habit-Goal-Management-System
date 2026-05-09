import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function GoalHabits() {
  const [userId] = useState(localStorage.getItem('userId') || '1');
  const [goalId, setGoalId] = useState('');
  const [habitId, setHabitId] = useState('');
  const [composition, setComposition] = useState([]);
  const [userGoals, setUserGoals] = useState([]);
  const [userHabits, setUserHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [goalsRes, habitsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/goals/user/${userId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
          fetch(`${API_BASE_URL}/habits`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        ]);
        if (goalsRes.ok) {
          const goals = await goalsRes.json();
          setUserGoals(goals);
          if (goals.length > 0) setGoalId(goals[0].GoalID);
        }
        if (habitsRes.ok) {
          const habits = await habitsRes.json();
          setUserHabits(habits);
          if (habits.length > 0) setHabitId(habits[0].HabitID);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchDropdownData();
  }, [userId]);

  const fetchComposition = async () => {
    if (!goalId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/goal-habits/composition/${goalId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (response.ok) {
        const data = await response.json();
        setComposition(data);
      }
    } catch (error) {
      console.error('Error fetching goal habits composition:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComposition();
  }, [goalId]);

  const handleLinkHabit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/goal-habits/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ goalId, habitId })
      });
      if (response.ok) {
        setHabitId('');
        fetchComposition();
      } else {
        console.error('Failed to link habit');
      }
    } catch (error) {
      console.error('Error linking habit:', error);
    }
  };

  const handleUnlink = async (goalHabitId) => {
    if (!goalHabitId) {
      alert("Cannot unlink: GoalHabitID is missing from the view.");
      return;
    }
    if (window.confirm('Are you sure you want to unlink this habit from the goal?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/goal-habits/unlink/${goalHabitId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          fetchComposition();
        } else {
          console.error('Failed to unlink habit');
        }
      } catch (error) {
        console.error('Error unlinking habit:', error);
      }
    }
  };

  return (
    <div className="content">
      <div className="card">
        <h2>Link Habits to Goals</h2>
        
        <div className="control-group" style={{ marginBottom: '24px' }}>
          <label style={{ fontWeight: '600', marginRight: '10px' }}>Select Goal: </label>
          <select 
            value={goalId} 
            onChange={(e) => setGoalId(e.target.value)} 
            style={{ width: '300px', display: 'inline-block', marginBottom: 0 }}
          >
            {userGoals.map(g => (
              <option key={g.GoalID} value={g.GoalID}>{g.GoalName}</option>
            ))}
            {userGoals.length === 0 && <option value="">No Goals Found</option>}
          </select>
        </div>

        <form onSubmit={handleLinkHabit} className="add-form" style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text-muted)' }}>Habit to Link</label>
            <select 
              value={habitId} 
              onChange={(e) => setHabitId(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            >
              <option value="">-- Select Habit --</option>
              {userHabits.map(h => (
                <option key={h.HabitID} value={h.HabitID}>{h.HabitName}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-btn" style={{ padding: '14px 32px' }}>Link Habit</button>
        </form>

        <h3>Associated Habits</h3>
        {loading ? <p>Loading habits...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Habit Name</th>
                  <th>Difficulty</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {composition.map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600' }}>{item.HabitName}</td>
                    <td>
                      <span style={{ 
                        background: item.Difficulty > 2 ? '#fee2e2' : item.Difficulty > 1 ? '#fef3c7' : '#dcfce3',
                        color: item.Difficulty > 2 ? '#ef4444' : item.Difficulty > 1 ? '#f59e0b' : '#22c55e',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                      }}>
                        Level {item.Difficulty}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {item.GoalHabitID && (
                        <button onClick={() => handleUnlink(item.GoalHabitID)} className="logout-btn" style={{ margin: 0, padding: '6px 16px', width: 'auto', display: 'inline-block' }}>Unlink</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {composition.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No habits linked to this goal yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalHabits;
