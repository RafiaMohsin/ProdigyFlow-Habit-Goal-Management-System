import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Habits = ({ refreshTrigger, isAdmin }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterByUserID = !isAdmin;

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/habits/details`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
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
  }, [refreshTrigger, filterByUserID]);

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="habits-list-container">
      <h3>{filterByUserID ? 'My Habits' : 'All Habits'}</h3>
      <div className="table-wrapper">
        <table className="premium-table">
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
            {habits && habits.length > 0 ? habits.map((habit, index) => (
              <tr key={habit?.HabitID || index}>
                <td className="habit-name-cell">{habit?.HabitName || 'Unnamed Habit'}</td>
                {!filterByUserID && <td className="user-cell">{habit?.Username || 'N/A'}</td>}
                <td><span className="category-badge">{habit?.CategoryName || 'General'}</span></td>
                <td>
                  <span className={`priority-indicator priority-${habit?.Priority || 1}`}>
                    Level {habit?.Priority || 1}
                  </span>
                </td>
                <td>
                  <span className={`difficulty-indicator difficulty-${habit?.Difficulty || 1}`}>
                    {habit?.Difficulty === 1 ? 'Easy' : habit?.Difficulty === 2 ? 'Medium' : 'Hard'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No data available. Start by adding a habit!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx="true">{`
        .habits-list-container {
          margin-top: 20px;
        }

        .table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .premium-table th {
          padding: 16px;
          background: #f8fafc;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #edf2f7;
        }

        .premium-table td {
          padding: 16px;
          border-bottom: 1px solid #edf2f7;
          color: #1e293b;
          font-size: 14px;
        }

        .habit-name-cell {
          font-weight: 600;
          color: #2d3748;
        }

        .category-badge {
          background: #ebf8ff;
          color: #2b6cb0;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .priority-indicator {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .priority-1 { background: #f0fff4; color: #2f855a; }
        .priority-2 { background: #f0fff4; color: #2f855a; }
        .priority-3 { background: #fffaf0; color: #9c4221; }
        .priority-4 { background: #fff5f5; color: #9b2c2c; }
        .priority-5 { background: #fff5f5; color: #9b2c2c; }

        .difficulty-indicator {
          font-size: 12px;
          font-weight: 600;
        }

        .difficulty-1 { color: #48bb78; }
        .difficulty-2 { color: #ed8936; }
        .difficulty-3 { color: #f56565; }

        tr:hover {
          background: #f7fafc;
        }
      `}</style>
    </div>
  );
};

export default Habits;
