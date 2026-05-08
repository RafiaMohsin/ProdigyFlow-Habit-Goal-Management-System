import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const SignUp = ({ setToken, navigateTo }) => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    ConfirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.Password !== formData.ConfirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: formData.Username,
          Email: formData.Email,
          Password: formData.Password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.user && data.user.roleId) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('roleId', data.user.roleId.toString());
          localStorage.setItem('userId', data.user.id.toString());
          localStorage.setItem('username', data.user.username);
          setToken(data.token);
        } else {
          setError('Registration successful, but login failed. Please log in manually.');
          setTimeout(() => navigateTo('login'), 2000);
        }
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="app-logo">ProdigyFlow</div>
          <h2>Create Account</h2>
          <p>Join ProdigyFlow to track your goals</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              id="Username"
              name="Username"
              placeholder="johndoe"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Email Address</label>
            <input
              type="email"
              id="Email"
              name="Email"
              placeholder="name@example.com"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              name="Password"
              placeholder="••••••••"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ConfirmPassword">Confirm Password</label>
            <input
              type="password"
              id="ConfirmPassword"
              name="ConfirmPassword"
              placeholder="••••••••"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
          Already have an account? <button onClick={() => navigateTo('login')} style={{ background: 'none', border: 'none', color: '#4299e1', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>Log In</button>
        </p>
      </div>
      
      <style jsx="true">{`
        .app-logo {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(to right, #4299e1, #667eea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: #f8fafc;
        }
        
        .login-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        h2 {
          margin-bottom: 8px;
          color: #1a202c;
          font-size: 24px;
          font-weight: 700;
        }
        
        p {
          color: #718096;
          font-size: 15px;
        }
        
        .error-message {
          background: #fff5f5;
          color: #c53030;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          border: 1px solid #feb2b2;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
        }
        
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          background: #f7fafc;
          color: #333 !important; /* Force dark color for visibility */
          transition: all 0.2s;
        }
        
        input:focus {
          outline: none;
          border-color: #4299e1;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .submit-btn:hover {
          background: #3182ce;
        }
        
        .submit-btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
