import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import Users from './Users';
import Roles from './Roles';
import Habits from './Habits';
import AddHabit from './AddHabit';

function Home({ roleId }) {
  const username = localStorage.getItem('username') || 'User';
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    habitCount: 0,
    goalCount: 0,
    streak: 0,
    achievementCount: 0,
    userCount: 0 
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/users/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load dashboard statistics');
        }

        const data = await response.json();
        if (data && typeof data === 'object') {
          setStats({
            habitCount: data?.habitCount ?? 0,
            goalCount: data?.goalCount ?? 0,
            notificationCount: data?.notificationCount ?? 0,
            achievementCount: data?.achievementCount ?? 0,
            userCount: data?.userCount ?? 0
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger, roleId]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Synchronizing your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-card">
        <h3>Unable to Load Dashboard</h3>
        <p>{error}</p>
        <button onClick={handleRefresh} className="submit-btn">Retry</button>
      </div>
    );
  }

  const isAdmin = roleId === 1;

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h2>{isAdmin ? 'Admin Dashboard' : `Hi ${username}!`}</h2>
        <p className="subtitle">
          {isAdmin 
            ? 'Manage system performance, users, and global habit tracking.' 
            : 'Welcome back to your personalized productivity suite. Here is your progress summary.'}
        </p>
      </div>

      <div className="dashboard-grid">
        {isAdmin ? (
          <>
            <div className="stat-card admin">
              <span className="label">Total Users</span>
              <span className="value">{stats.userCount}</span>
            </div>
            <div className="stat-card">
              <span className="label">Global Habits</span>
              <span className="value">{stats.habitCount}</span>
            </div>
            <div className="stat-card">
              <span className="label">Active Goals</span>
              <span className="value">{stats.goalCount}</span>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card habits">
              <div className="icon">📝</div>
              <span className="label">Habits</span>
              <span className="value">{stats.habitCount}</span>
            </div>
            <div className="stat-card goals">
              <div className="icon">🎯</div>
              <span className="label">Goals</span>
              <span className="value">{stats.goalCount}</span>
            </div>
            <div className="stat-card notifications">
              <div className="icon">🔔</div>
              <span className="label">Notifications</span>
              <span className="value">{stats.notificationCount}</span>
            </div>
            <div className="stat-card achievements">
              <div className="icon">🏆</div>
              <span className="label">Achievements</span>
              <span className="value">{stats.achievementCount}</span>
            </div>
          </>
        )}
      </div>

      <div className="management-sections">
        {isAdmin && (
          <>
            <div className="card">
              <h3>System User Management</h3>
              <div style={{ marginTop: '20px' }}>
                <Users refreshTrigger={refreshTrigger} />
              </div>
            </div>

            <div className="card">
              <h3>Global Habits (Read Only)</h3>
              <Habits refreshTrigger={refreshTrigger} isAdmin={true} />
            </div>
          </>
        )}
      </div>

      <style jsx="true">{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-section {
          margin-bottom: 40px;
        }

        .welcome-section h2 {
          font-size: 32px;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 500;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .stat-card {
          background: white;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #e2e8f0;
        }

        .stat-card.habits::before { background: linear-gradient(to right, #6366f1, #818cf8); }
        .stat-card.goals::before { background: linear-gradient(to right, #f59e0b, #fbbf24); }
        .stat-card.notifications::before { background: linear-gradient(to right, #ec4899, #f472b6); }
        .stat-card.achievements::before { background: linear-gradient(to right, #10b981, #34d399); }
        .stat-card.admin::before { background: linear-gradient(to right, #1e293b, #475569); }

        .icon {
          font-size: 32px;
          margin-bottom: 16px;
          background: #f8fafc;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover .icon {
          transform: scale(1.1) rotate(5deg);
        }

        .label {
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .value {
          font-size: 40px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 50vh;
          gap: 16px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-card {
          padding: 48px;
          text-align: center;
          background: #fff;
          border-radius: 24px;
          border: 1px solid #fee2e2;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .error-card h3 { color: #991b1b; margin-bottom: 12px; }
        .error-card p { color: #b91c1c; margin-bottom: 24px; }
      `}</style>
    </div>
  );
}

export default Home;
