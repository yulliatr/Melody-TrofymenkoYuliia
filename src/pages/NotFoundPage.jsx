import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="background">
        <div className="ellipse ellipse1"></div>
        <div className="ellipse ellipse2"></div>
        <div className="ellipse ellipse3"></div>
      </div>

      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">
          Oops! We can't find the page you're looking for.
        </p>

        <Link to="/" className="home-button">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
