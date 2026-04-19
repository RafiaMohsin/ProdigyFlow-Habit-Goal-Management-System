import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AddUser = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    PasswordHash: '',
    RoleID: ''
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/roles`)
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(err => console.error('Error fetching roles:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.RoleID) {
      setError('Please select a role.');
      return;
    }
    setError(null);

    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        RoleID: parseInt(formData.RoleID)
      })
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to add user. Ensure email and username are unique.');
        }
        return data;
      })
      .then(() => {
        setFormData({ Username: '', Email: '', PasswordHash: '', RoleID: '' });
        onUserAdded();
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="card">
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <input name="Username" placeholder="Username" value={formData.Username} onChange={handleChange} required />
        <input name="Email" type="email" placeholder="Email" value={formData.Email} onChange={handleChange} required />
        <input name="PasswordHash" type="password" placeholder="Password" value={formData.PasswordHash} onChange={handleChange} required />
        <select name="RoleID" value={formData.RoleID} onChange={handleChange} required>
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role.RoleID} value={role.RoleID}>{role.RoleName}</option>
          ))}
        </select>
        <button type="submit">Add User</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddUser;
