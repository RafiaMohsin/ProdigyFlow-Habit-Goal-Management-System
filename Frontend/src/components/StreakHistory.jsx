import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function StreakHistory() {
  const [userId] = useState(localStorage.getItem('userId') || '1');
  const [habitId, setHabitId] = useState('');
  const [userHabits, setUserHabits] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [milestoneDays, setMilestoneDays] = useState('7');
  const [milestones, setMilestones] = useState(null);
  const [loadingMilestones, setLoadingMilestones] = useState(false);

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

  const fetchStreak = async () => {
    if (!habitId) return;
    setLoadingStreak(true);
    try {
      const response = await fetch(`${API_BASE_URL}/streaks/habit/${habitId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
      const response = await fetch(`${API_BASE_URL}/streaks/top`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
      const response = await fetch(`${API_BASE_URL}/streaks/sync`, { method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
      const response = await fetch(`${API_BASE_URL}/streaks/milestones/${milestoneDays}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
    <div className="content">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ marginBottom: 0 }}>Streak History</h2>
          <button onClick={handleSyncStreaks} className="submit-btn" style={{ margin: 0, width: 'auto' }}>Sync All Streaks</button>
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

        <h3 style={{ marginTop: '20px', marginBottom: '20px' }}>Habit Streak Data</h3>
        {loadingStreak ? <p>Loading streak...</p> : streakData ? (
          <div className="dashboard-grid">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)', borderColor: '#f5d0fe' }}>
              <div className="label" style={{ color: '#a21caf' }}>Current Streak</div>
              <div className="value" style={{ color: '#86198f', fontSize: '36px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                {streakData.CurrentStreak} <span style={{ fontSize: '16px', fontWeight: '600' }}>days</span>
              </div>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', borderColor: '#fde68a' }}>
              <div className="label" style={{ color: '#b45309' }}>Longest Streak</div>
              <div className="value" style={{ color: '#92400e', fontSize: '36px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                {streakData.LongestStreak} <span style={{ fontSize: '16px', fontWeight: '600' }}>days</span>
              </div>
              <div style={{ fontSize: '12px', color: '#b45309', marginTop: 'auto', paddingTop: '8px' }}>
                Updated: {new Date(streakData.LastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No streak data found for this habit.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '40px' }}>
          <div>
            <h3>Global Leaderboard</h3>
            {loadingLeaderboard ? <p>Loading leaderboard...</p> : (
              <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Habit</th>
                      <th style={{ textAlign: 'right' }}>Top Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '700' }}>{user.Username}</td>
                        <td>{user.HabitName}</td>
                        <td style={{ textAlign: 'right', fontWeight: '800', color: '#f59e0b' }}>{user.LongestStreak} <span style={{fontSize:'12px'}}>🔥</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leaderboard.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>No leaderboard data available.</p>}
              </div>
            )}
          </div>

          <div>
            <h3>Milestone Achievers</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <input 
                type="number" 
                value={milestoneDays} 
                onChange={(e) => setMilestoneDays(e.target.value)} 
                placeholder="Days (e.g. 7)"
                style={{ marginBottom: 0 }}
              />
              <button onClick={fetchMilestones} className="submit-btn" style={{ flexShrink: 0, padding: '12px 20px' }}>View Milestone</button>
            </div>
            
            {loadingMilestones ? <p>Loading milestones...</p> : milestones && milestones.users ? (
              <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Habit</th>
                      <th style={{ textAlign: 'right' }}>Current</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.users.map((user, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '700' }}>{user.Username}</td>
                        <td>{user.HabitName}</td>
                        <td style={{ textAlign: 'right', fontWeight: '800', color: '#22c55e' }}>{user.CurrentStreak} <span style={{fontSize:'12px'}}>⭐</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {milestones.users.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>No users reached this milestone yet.</p>}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakHistory;
