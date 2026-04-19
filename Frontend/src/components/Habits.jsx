import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Habits = ({ refreshTrigger }) => {
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
        setHabits(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <h3>Habit List (Details)</h3>
      <table>
        <thead>
          <tr>
            <th>Habit Name</th>
            <th>User</th>
            <th>Category</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {habits.length > 0 ? habits.map((habit, index) => (
            <tr key={habit.HabitID || index}>
              <td>{habit.HabitName}</td>
              <td>{habit.Username}</td>
              <td>{habit.CategoryName}</td>
              <td>{habit.Priority}</td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No habits found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Habits;
