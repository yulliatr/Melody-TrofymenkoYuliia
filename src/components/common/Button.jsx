import React from 'react';
import './Button.module.css';

const Button = ({ children, onClick }) => (
  <button onClick={onClick} className="button">
    {children}
  </button>
);

export default Button;
