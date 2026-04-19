import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Habits = ({ refreshTrigger, filterByUserID }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/habits/details`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch habit details');
        return response.json();
      })
      .then(data => {
        // Enforce the privacy constraint: 
        // If filterByUserID is provided (Regular User), only keep their habits.
        // Otherwise (Admin), show everything.
        const displayedHabits = filterByUserID 
          ? data.filter(habit => habit.UserID === filterByUserID)
          : data;
          
        setHabits(displayedHabits);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [refreshTrigger, filterByUserID]);

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <h3>{filterByUserID ? 'My Personal Habits' : 'All System Habits'}</h3>
      <table>
        <thead>
          <tr>
            <th>Habit Name</th>
            {!filterByUserID && <th>User</th>}
            <th>Category</th>
            <th>Priority</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {habits.length > 0 ? habits.map((habit, index) => (
            <tr key={habit.HabitID || index}>
              <td>{habit.HabitName}</td>
              {!filterByUserID && <td>{habit.Username}</td>}
              <td>{habit.CategoryName}</td>
              <td>{habit.Priority}</td>
              <td>{habit.Difficulty}</td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No habits found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Habits;
