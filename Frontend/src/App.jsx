import React, { useState, useEffect } from 'react';
import Users from './components/Users';
import Roles from './components/Roles';
import Habits from './components/Habits';
import AddHabit from './components/AddHabit';
import Goals from './components/Goals';
import GoalHabits from './components/GoalHabits';
import HabitLogs from './components/HabitLogs';
import HabitNotes from './components/HabitNotes';
import StreakHistory from './components/StreakHistory';
import Performance from './components/Performance';
import Reminders from './components/Reminders';
import Achievements from './components/Achievements';
import UserAchievements from './components/UserAchievements';
import Notifications from './components/Notifications';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Categories from './components/Categories';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [roleId, setRoleId] = useState(() => {
    const r = localStorage.getItem('roleId');
    return r ? parseInt(r) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const r = localStorage.getItem('roleId');
    return r && parseInt(r) === 1 ? 'users' : 'dashboard';
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('roleId');
    if (storedToken) {
      setToken(storedToken);
      const role = storedRole ? parseInt(storedRole) : null;
      setRoleId(role);
      // Ensure admin doesn't land on dashboard if they reload
      if (role === 1 && currentPage === 'dashboard') {
        setCurrentPage('users');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setToken(null);
    setRoleId(null);
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Helper to render the current page
  const renderPage = () => {
    if (!token) {
      if (currentPage === 'signup') {
        return <SignUp setToken={(t) => {
          const role = parseInt(localStorage.getItem('roleId'));
          setToken(t);
          setRoleId(role);
          setCurrentPage(role === 1 ? 'users' : 'dashboard');
        }} navigateTo={navigateTo} />;
      }
      return <Login setToken={(t) => {
        const role = parseInt(localStorage.getItem('roleId'));
        setToken(t);
        setRoleId(role);
        setCurrentPage(role === 1 ? 'users' : 'dashboard');
      }} navigateTo={navigateTo} />;
    }

    const isAdmin = roleId === 1;

    // Strict role-based page protection
    switch (currentPage) {
      case 'dashboard':
        return <Home roleId={roleId} />;
      case 'users':
        return isAdmin ? <Users /> : <Home roleId={roleId} />;
      case 'roles':
        return isAdmin ? <Roles /> : <Home roleId={roleId} />;
      case 'categories':
        return isAdmin ? <Categories /> : <Home roleId={roleId} />;
      case 'habits':
        return <Habits isAdmin={isAdmin} />;
      case 'add-habit':
        return <AddHabit onHabitAdded={() => setCurrentPage('habits')} />;
      case 'goals':
        return !isAdmin ? <Goals /> : <Users />;
      case 'goal-habits':
        return !isAdmin ? <GoalHabits /> : <Users />;
      case 'logs':
        return !isAdmin ? <HabitLogs /> : <Users />;
      case 'notes':
        return !isAdmin ? <HabitNotes /> : <Users />;
      case 'streaks':
        return !isAdmin ? <StreakHistory /> : <Users />;
      case 'performance':
        return !isAdmin ? <Performance /> : <Users />;
      case 'reminders':
        return !isAdmin ? <Reminders /> : <Users />;
      case 'achievements':
        return !isAdmin ? <Achievements /> : <Users />;
      case 'user-achievements':
        return !isAdmin ? <UserAchievements /> : <Users />;
      case 'notifications':
        return !isAdmin ? <Notifications /> : <Users />;
      default:
        return <Home roleId={roleId} />;
    }
  };

  const isAdmin = roleId === 1;

  return (
    <div className="App">
      {token ? (
        <>
          <nav className="navbar">
            <div className="logo-section">
              <h1>ProdigyFlow</h1>
            </div>
            <div className="nav-links">
              <button 
                className={currentPage === 'dashboard' ? 'active' : ''} 
                onClick={() => navigateTo('dashboard')}
              >
                Dashboard
              </button>

              <button 
                className={currentPage === 'add-habit' ? 'active' : ''} 
                onClick={() => navigateTo('add-habit')}
              >
                Add Habit
              </button>
              
              {isAdmin ? (
                <>
                  <button 
                    className={currentPage === 'users' ? 'active' : ''} 
                    onClick={() => navigateTo('users')}
                  >
                    User Management
                  </button>
                  <button 
                    className={currentPage === 'habits' ? 'active' : ''} 
                    onClick={() => navigateTo('habits')}
                  >
                    System Habits
                  </button>
                  <button 
                    className={currentPage === 'roles' ? 'active' : ''} 
                    onClick={() => navigateTo('roles')}
                  >
                    Roles
                  </button>
                  <button 
                    className={currentPage === 'categories' ? 'active' : ''} 
                    onClick={() => navigateTo('categories')}
                  >
                    Categories
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={currentPage === 'habits' ? 'active' : ''} 
                    onClick={() => navigateTo('habits')}
                  >
                    My Habits
                  </button>
                  <button 
                    className={currentPage === 'goals' ? 'active' : ''} 
                    onClick={() => navigateTo('goals')}
                  >
                    Goals
                  </button>
                  <button 
                    className={currentPage === 'goal-habits' ? 'active' : ''} 
                    onClick={() => navigateTo('goal-habits')}
                  >
                    Goal Habits
                  </button>
                  <button 
                    className={currentPage === 'logs' ? 'active' : ''} 
                    onClick={() => navigateTo('logs')}
                  >
                    Habit Logs
                  </button>
                  <button 
                    className={currentPage === 'notes' ? 'active' : ''} 
                    onClick={() => navigateTo('notes')}
                  >
                    Habit Notes
                  </button>
                  <button 
                    className={currentPage === 'streaks' ? 'active' : ''} 
                    onClick={() => navigateTo('streaks')}
                  >
                    Streak History
                  </button>
                  <button 
                    className={currentPage === 'performance' ? 'active' : ''} 
                    onClick={() => navigateTo('performance')}
                  >
                    Performance
                  </button>
                  <button 
                    className={currentPage === 'reminders' ? 'active' : ''} 
                    onClick={() => navigateTo('reminders')}
                  >
                    Reminders
                  </button>
                  <button 
                    className={currentPage === 'achievements' ? 'active' : ''} 
                    onClick={() => navigateTo('achievements')}
                  >
                    Achievements
                  </button>
                  <button 
                    className={currentPage === 'user-achievements' ? 'active' : ''} 
                    onClick={() => navigateTo('user-achievements')}
                  >
                    User Achievements
                  </button>
                  <button 
                    className={currentPage === 'notifications' ? 'active' : ''} 
                    onClick={() => navigateTo('notifications')}
                  >
                    Notifications
                  </button>
                </>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </nav>

          <div className="main-wrapper">
            <header className="app-header">
              <div className="header-content">
                <span className="user-role-badge">
                  {roleId === 1 ? 'Administrator' : 'User'}
                </span>
                <button onClick={handleLogout} className="logout-btn-header">
                  Logout
                </button>
              </div>
            </header>
            
            <div className="content">
              {renderPage()}
            </div>
          </div>
        </>
      ) : (
        <div className="auth-wrapper">
          <div className="auth-header">
            <h1>ProdigyFlow</h1>
          </div>
          {renderPage()}
        </div>
      )}
    </div>
  );
}

export default App;
