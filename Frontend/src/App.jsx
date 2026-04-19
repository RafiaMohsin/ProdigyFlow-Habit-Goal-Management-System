import React, { useState } from 'react';
import Users from './components/Users';
import AddUser from './components/AddUser';
import Roles from './components/Roles';
import Habits from './components/Habits';
import AddHabit from './components/AddHabit';
import './App.css';

function App() {
  const [userRefresh, setUserRefresh] = useState(0);
  const [habitRefresh, setHabitRefresh] = useState(0);

  const handleUserAdded = () => setUserRefresh(prev => prev + 1);
  const handleHabitAdded = () => setHabitRefresh(prev => prev + 1);

  return (
    <div className="App">
      <h1>ProdigyFlow Management System</h1>
      
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

export default App;
