import React from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';
import image1 from '../assets/images/image1.png';

const SignInPage = () => {
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

        <label className="auth-label">Email</label>
        <input
          type="email"
          className="auth-input"
          placeholder="example@gmail.com"
        />

        <label className="auth-label">Password</label>
        <input type="password" className="auth-input" />

        <div className="forgot-password-container">
          <input
            type="checkbox"
            id="forgot-checkbox"
            className="forgot-checkbox"
          />
          <label htmlFor="forgot-checkbox" className="forgot-label">
            Forgot the password
          </label>
        </div>

        <button className="auth-button">Sign In</button>

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
