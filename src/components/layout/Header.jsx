import React from 'react';
import { Link } from 'react-router-dom';
import './Header.module.css';

const Header = () => (
  <header>
    <nav>
      <Link to="/">Home</Link> | <Link to="/mood">Mood</Link> |{' '}
      <Link to="/guess">Guess</Link>
    </nav>
  </header>
);

export default Header;
