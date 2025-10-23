import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="ellipse ellipse1"></div>
      <div className="ellipse ellipse2"></div>
      <div className="ellipse ellipse3"></div>

      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome To Melody!</h1>
          <p className="welcome-subtitle">
            Discover how your emotions sound.
            <br />
            Choose your path — find songs that match your mood, or test your ear
            in our melody challenge!
          </p>
        </div>
      </div>
      <div className="button-section">
        <button className="main-button button1">Find a Song by Mood</button>
        <button className="main-button button2">Guess the Melody</button>
      </div>
      <div className="auth-text">
        <span>
          <a href="/signin" className="auth-link">
            Log in
          </a>{' '}
          or
          <a href="/signup" className="auth-link">
            {' '}
            sign up{' '}
          </a>
          to save your favorite songs and track your game results
        </span>
      </div>
    </div>
  );
};

export default HomePage;
