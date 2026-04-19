import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function StreakHistory() {
  const [habitId, setHabitId] = useState('1');
  const [streakData, setStreakData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [milestoneDays, setMilestoneDays] = useState('7');
  const [milestones, setMilestones] = useState(null);
  const [loadingMilestones, setLoadingMilestones] = useState(false);

  const fetchStreak = async () => {
    if (!habitId) return;
    setLoadingStreak(true);
    try {
      const response = await fetch(`${API_BASE_URL}/streaks/habit/${habitId}`);
      if (response.ok) {
        const data = await response.json();
        setStreakData(data);
      } else {
        setStreakData(null);
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setStreakData(null);
    } finally {
      setLoadingStreak(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const response = await fetch(`${API_BASE_URL}/streaks/top`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleSyncStreaks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/streaks/sync`, { method: 'PUT' });
      if (response.ok) {
        alert('Streaks synced successfully');
        fetchStreak();
        fetchLeaderboard();
      }
    } catch (error) {
      console.error('Error syncing streaks:', error);
    }
  };

  const fetchMilestones = async () => {
    if (!milestoneDays) return;
    setLoadingMilestones(true);
    try {
      const response = await fetch(`${API_BASE_URL}/streaks/milestones/${milestoneDays}`);
      if (response.ok) {
        const data = await response.json();
        setMilestones(data);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoadingMilestones(false);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, [habitId]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="component-container">
      <h2>Streak History</h2>
      
      <div className="control-group">
        <label>View Streak for Habit ID: </label>
        <input 
          type="number" 
          value={habitId} 
          onChange={(e) => setHabitId(e.target.value)} 
          placeholder="Enter Habit ID"
        />
        <button onClick={handleSyncStreaks} className="action-button">Sync All Streaks</button>
      </div>

      <hr />

      <h3>Habit Streak Data</h3>
      {loadingStreak ? <p>Loading streak...</p> : streakData ? (
        <div className="streak-stats">
          <p><strong>Current Streak:</strong> {streakData.CurrentStreak} days</p>
          <p><strong>Longest Streak:</strong> {streakData.LongestStreak} days</p>
          <p><strong>Last Updated:</strong> {new Date(streakData.LastUpdated).toLocaleString()}</p>
        </div>
      ) : (
        <p>No streak data found for this habit.</p>
      )}

      <hr />

      <h3>Global Leaderboard (Top Streaks)</h3>
      {loadingLeaderboard ? <p>Loading leaderboard...</p> : (
        <ul className="item-list">
          {leaderboard.map((user, index) => (
            <li key={index}>
              <strong>{user.Username}</strong> - {user.HabitName}: {user.LongestStreak} days
            </li>
          ))}
          {leaderboard.length === 0 && <p>No leaderboard data available.</p>}
        </ul>
      )}

      <hr />

      <h3>Milestone Achievers</h3>
      <div className="control-group">
        <input 
          type="number" 
          value={milestoneDays} 
          onChange={(e) => setMilestoneDays(e.target.value)} 
          placeholder="Milestone Days (e.g. 7)"
        />
        <button onClick={fetchMilestones}>View Milestone</button>
      </div>
      {loadingMilestones ? <p>Loading milestones...</p> : milestones && milestones.users ? (
        <ul className="item-list">
          {milestones.users.map((user, index) => (
            <li key={index}>
              <strong>{user.Username}</strong> - {user.HabitName}: {user.CurrentStreak} days
            </li>
          ))}
          {milestones.users.length === 0 && <p>No users reached this milestone yet.</p>}
        </ul>
      ) : null}
    </div>
  );
}

export default StreakHistory;
