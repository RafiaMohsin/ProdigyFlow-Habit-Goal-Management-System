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
    </div>
  );

  return (
    <div>
      <h3>System User Status</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((user, index) => (
            <tr key={user.UserID || index}>
              <td>{user.Username}</td>
              <td>{user.Email}</td>
              <td>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  backgroundColor: user.RoleID === 1 ? '#fee2e2' : '#dcfce7',
                  color: user.RoleID === 1 ? '#991b1b' : '#166534'
                }}>
                  {user.RoleID === 1 ? 'Admin' : 'User'}
                </span>
              </td>
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
