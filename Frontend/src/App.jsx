import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Users from './components/Users';
import AddUser from './components/AddUser';
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
import './App.css';

function Home() {
  const [userRefresh, setUserRefresh] = useState(0);
  const [habitRefresh, setHabitRefresh] = useState(0);

  const handleUserAdded = () => setUserRefresh(prev => prev + 1);
  const handleHabitAdded = () => setHabitRefresh(prev => prev + 1);

  return (
    <div>
      <section>
        <h2>Users Management</h2>
        <AddUser onUserAdded={handleUserAdded} />
        <Users refreshTrigger={userRefresh} />
      </section>

      <hr />

      <section>
        <h2>Roles</h2>
        <Roles />
      </section>

      <hr />

      <section>
        <h2>Habits Management</h2>
        <AddHabit onHabitAdded={handleHabitAdded} />
        <Habits refreshTrigger={habitRefresh} />
      </section>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>ProdigyFlow Management System</h1>
      
      <nav className="navbar">
        <Link to="/">Dashboard</Link> |{' '}
        <Link to="/goals">Goals</Link> |{' '}
        <Link to="/goal-habits">Goal Habits</Link> |{' '}
        <Link to="/logs">Habit Logs</Link> |{' '}
        <Link to="/notes">Habit Notes</Link> |{' '}
        <Link to="/streaks">Streak History</Link>
        <Link to="/performance">Performance</Link> |{' '}
        <Link to="/reminders">Reminders</Link> |{' '}
        <Link to="/achievements">Achievements</Link> |{' '}
        <Link to="/user-achievements">User Achievements</Link> |{' '}
        <Link to="/notifications">Notifications</Link>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goal-habits" element={<GoalHabits />} />
          <Route path="/logs" element={<HabitLogs />} />
          <Route path="/notes" element={<HabitNotes />} />
          <Route path="/streaks" element={<StreakHistory />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/user-achievements" element={<UserAchievements />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
