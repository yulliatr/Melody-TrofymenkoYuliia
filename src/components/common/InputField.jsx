import React from 'react';
import './InputField.module.css';

const InputField = ({ type, placeholder }) => (
  <input type={type} placeholder={placeholder} className="inputField" />
);

export default InputField;
