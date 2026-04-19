import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/roles`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch roles');
        return response.json();
      })
      .then(data => {
        setRoles(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading roles...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <h3>Roles</h3>
      <ul>
        {roles.length > 0 ? roles.map((role, index) => (
          <li key={role.RoleID || index}>{role.RoleName}</li>
        )) : (
          <p>No roles found.</p>
        )}
      </ul>
    </div>
  );
};

export default Roles;
