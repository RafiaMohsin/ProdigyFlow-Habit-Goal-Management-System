import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function GoalHabits() {
  const [goalId, setGoalId] = useState('1');
  const [habitId, setHabitId] = useState('');
  const [composition, setComposition] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComposition = async () => {
    if (!goalId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/goal-habits/composition/${goalId}`);
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
        headers: { 'Content-Type': 'application/json' },
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
          method: 'DELETE'
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
    <div className="component-container">
      <h2>Goal Habits Composition</h2>
      
      <div className="control-group">
        <label>View Goal Habits for Goal ID: </label>
        <input 
          type="number" 
          value={goalId} 
          onChange={(e) => setGoalId(e.target.value)} 
          placeholder="Enter Goal ID"
        />
      </div>

      <hr />

      <form onSubmit={handleLinkHabit} className="add-form">
        <h3>Link Habit to Goal</h3>
        <input 
          type="number" 
          placeholder="Habit ID" 
          value={habitId} 
          onChange={(e) => setHabitId(e.target.value)} 
          required 
        />
        <button type="submit">Link Habit</button>
      </form>

      <hr />

      <h3>Associated Habits</h3>
      {loading ? <p>Loading habits...</p> : (
        <ul className="item-list">
          {composition.map((item, index) => (
            <li key={index}>
              <strong>{item.HabitName}</strong> - Difficulty: {item.Difficulty}
              {item.GoalHabitID && (
                <div style={{marginTop: '5px'}}>
                  <button onClick={() => handleUnlink(item.GoalHabitID)} style={{backgroundColor: '#e74c3c'}}>Unlink</button>
                </div>
              )}
            </li>
          ))}
          {composition.length === 0 && <p>No habits linked to this goal yet.</p>}
        </ul>
      )}
    </div>
  );
}

export default GoalHabits;
