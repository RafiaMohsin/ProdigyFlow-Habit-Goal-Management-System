import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function AddHabit({ onHabitAdded }) {
  const [roleId] = useState(parseInt(localStorage.getItem('roleId')));
  const [formData, setFormData] = useState({
    HabitName: '',
    Difficulty: 1,
    Priority: 1,
    UserID: '',
    CategoryID: ''
  });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch users if user is Admin
    if (roleId === 1) {
      fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Error fetching users:', err));
    }

    fetch(`${API_BASE_URL}/categories`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, [roleId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (roleId === 1 && !formData.UserID) {
      setError('Please select a user.');
      return;
    }
    if (!formData.CategoryID) {
      setError('Please select a category.');
      return;
    }
    setError(null);

    fetch(`${API_BASE_URL}/habits`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        ...formData,
        UserID: roleId === 1 ? parseInt(formData.UserID) : undefined, // Backend will use token ID if undefined
        Difficulty: parseInt(formData.Difficulty),
        Priority: parseInt(formData.Priority),
        CategoryID: parseInt(formData.CategoryID)
      })
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to add habit');
        return data;
      })
      .then(() => {
        setFormData({ HabitName: '', Difficulty: 1, Priority: 1, UserID: '', CategoryID: '' });
        onHabitAdded();
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="card">
      <h3>Add New Habit</h3>
      <form onSubmit={handleSubmit}>
        <input name="HabitName" placeholder="Habit Name" value={formData.HabitName} onChange={handleChange} required />
        
        <div className="form-group">
          <label>Difficulty (1-3): </label>
          <input name="Difficulty" type="number" min="1" max="3" value={formData.Difficulty} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Priority (1-5): </label>
          <input name="Priority" type="number" min="1" max="5" value={formData.Priority} onChange={handleChange} required />
        </div>

        {roleId === 1 && (
          <select name="UserID" value={formData.UserID} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u.UserID} value={u.UserID}>{u.Username}</option>
            ))}
          </select>
        )}

        <select name="CategoryID" value={formData.CategoryID} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
          ))}
        </select>

        <button type="submit">Add Habit</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default AddHabit;
