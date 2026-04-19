import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Users = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/users`)
      .then(response => {
        if (!response.ok) throw new Error('API unreachable. Is the backend running?');
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading) return <p>Loading users...</p>;
  if (error) return (
    <div className="error-box">
      <p style={{ color: 'red' }}>Error: {error}</p>
      <small>Check if your backend is running at {API_BASE_URL}</small>
    </div>
  );

  return (
    <div>
      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role ID</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((user, index) => (
            <tr key={user.UserID || index}>
              <td>{user.Username}</td>
              <td>{user.Email}</td>
              <td>{user.RoleID}</td>
            </tr>
          )) : (
            <tr><td colSpan="3" style={{ textAlign: 'center' }}>No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
