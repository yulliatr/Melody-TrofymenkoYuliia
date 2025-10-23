import React from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';
import image1 from '../assets/images/image1.png';

const SignUpPage = () => {
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
        <h1 className="auth-title">Join Us Today!</h1>
        <p className="auth-subtitle">
          Create your account to unlock personalized playlists, save favorites,
          and track your game results.
        </p>

        <label className="auth-label">Email</label>
        <input
          type="email"
          className="auth-input"
          placeholder="example@gmail.com"
        />

        <label className="auth-label">Username</label>
        <input type="text" className="auth-input" />

        <label className="auth-label">Password</label>
        <input type="password" className="auth-input" />

        <label className="auth-label">Confirm Password</label>
        <input type="password" className="auth-input" />

        <button className="auth-button">Sign Up</button>

        <p className="auth-link-footer">
          Already Have An Account?{' '}
          <Link to="/signin" className="auth-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
