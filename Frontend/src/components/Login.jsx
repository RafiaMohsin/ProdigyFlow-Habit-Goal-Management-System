import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);

    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(users => {
        console.log('--- LOGIN DEBUG ---');
        console.log('Total users fetched:', users.length);
        console.log('Database Data:', users); // This will show exact keys and values

        // Find user by comparing trimmed, lowercase values
        const user = users.find(u => {
          const dbEmail = (u.Email || u.email || '').toLowerCase().trim();
          const dbPass = (u.PasswordHash || u.passwordhash || '').trim();
          const inputEmail = email.toLowerCase().trim();
          const inputPass = password.trim();
          
          return dbEmail === inputEmail && dbPass === inputPass;
        });

        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid email or password. Please check the console (F12) for data details.');
        }
      })
      .catch((err) => {
        setError('Login failed. Ensure the backend is running.');
        console.error('Fetch error:', err);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);

    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Username: username.trim(),
        Email: email.trim(),
        PasswordHash: password.trim(),
        RoleID: 2 
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        return data;
      })
      .then(() => {
        setIsRegistering(false);
        setError('Account created! You can now log in.');
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Create Account' : 'ProdigyFlow Login'}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">{isRegistering ? 'Sign Up' : 'Login'}</button>
        </form>
        
        <p style={{ marginTop: '20px', cursor: 'pointer', color: '#3b82f6' }} 
           onClick={() => { setIsRegistering(!isRegistering); setError(null); }}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </p>
        
        {error && (
          <p className="error" style={{ color: error.includes('created') ? '#10b981' : '#ef4444' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
