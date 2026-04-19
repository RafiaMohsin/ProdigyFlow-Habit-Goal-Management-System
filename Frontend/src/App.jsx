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
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goal-habits" element={<GoalHabits />} />
          <Route path="/logs" element={<HabitLogs />} />
          <Route path="/notes" element={<HabitNotes />} />
          <Route path="/streaks" element={<StreakHistory />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
