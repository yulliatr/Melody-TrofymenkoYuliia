import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import image1 from '../assets/images/image1.png';
import { useAuth } from '../hooks/useAuth';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, loading, authError } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const registrationData = { email, password };

    const success = await register(registrationData);

    if (success) {
      navigate('/profile');
    } else {
      setError(
        authError ||
          'Registration failed. Check if the email is already in use.'
      );
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
        <h1 className="auth-title">Join Us Today!</h1>
        <p className="auth-subtitle">
          Create your account to unlock personalized playlists, save favorites,
          and track your game results.
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

          <label className="auth-label">Confirm Password</label>
          <input
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {(error || authError) && (
            <p style={{ color: 'red', marginTop: '15px', fontWeight: 500 }}>
              {error || authError}
            </p>
          )}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

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
