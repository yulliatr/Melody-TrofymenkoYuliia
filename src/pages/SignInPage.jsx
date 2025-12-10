import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import image1 from '../assets/images/image1.png';
import { useAuth } from '../hooks/useAuth';

const SignInPage = () => {
  const [email, setEmail] = useState('test@user.com');
  const [password, setPassword] = useState('password123');
  const { login, loading, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const success = await login(email, password);
    if (success) {
      navigate('/profile');
    }
  };

  return (
    <div className="auth-page">
      <div className="background">
        <div className="ellipse ellipse1"></div>
        <div className="ellipse ellipse2"></div>
        <div className="ellipse ellipse3"></div>
      </div>

      <header className="header">
        <Link to="/">
          <img src={image1} alt="Home icon" className="header-icon left-icon" />
        </Link>
      </header>

      <div className="auth-container">
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">
          Sign in to access your playlists, favorite songs, and game scores.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Email</label>
          <input
            type="email"
            className="auth-input"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* <div className="forgot-password-container">
              <input
                type="checkbox"
                id="forgot-checkbox"
                className="forgot-checkbox"
              />
              <label htmlFor="forgot-checkbox" className="forgot-label">
                Forgot the password
              </label>
            </div> */}

          {authError && (
            <p style={{ color: 'red', marginTop: '10px' }}>{authError}</p>
          )}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link-footer">
          Don't Have An Account Yet?{' '}
          <Link to="/signup" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
