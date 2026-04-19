import React, { useState, useEffect } from 'react';
import Users from './components/Users';
import AddUser from './components/AddUser';
import Roles from './components/Roles';
import Habits from './components/Habits';
import AddHabit from './components/AddHabit';
import Login from './components/Login';
import './App.css';

function App() {
  const [userRefresh, setUserRefresh] = useState(0);
  const [habitRefresh, setHabitRefresh] = useState(0);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('prodigy_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('prodigy_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('prodigy_user');
  };

  const handleUserAdded = () => setUserRefresh(prev => prev + 1);
  const handleHabitAdded = () => setHabitRefresh(prev => prev + 1);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isAdmin = currentUser.RoleID === 1;

  return (
    <div className="App">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>ProdigyFlow</h1>
        <div className="user-info">
          <span>Logged in as: <strong>{currentUser.Username}</strong> ({isAdmin ? 'Overseer' : 'Participant'})</span>
          <button onClick={handleLogout} style={{ marginLeft: '15px', padding: '5px 12px', backgroundColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>
      
      {/* OVERSEER VIEW: Read-Only System Status */}
      {isAdmin && (
        <>
          <section>
            <h2>System Users</h2>
            {/* Admin can ONLY view the list, not add new users */}
            <Users refreshTrigger={userRefresh} />
          </section>

          <section>
            <h2>System Roles</h2>
            <Roles />
          </section>

          <section>
            <h2>Global Habit Overview</h2>
            <Habits refreshTrigger={habitRefresh} />
          </section>
        </>
      )}

      {/* PARTICIPANT VIEW: Managing Personal Habits */}
      {!isAdmin && (
        <section>
          <h2>My Productivity</h2>
          <AddHabit 
            onHabitAdded={handleHabitAdded} 
            fixedUserID={currentUser.UserID} 
          />
          <Habits 
            refreshTrigger={habitRefresh} 
            filterByUserID={currentUser.UserID} 
          />
        </section>
      )}
    </div>
  );
}

export default App;
