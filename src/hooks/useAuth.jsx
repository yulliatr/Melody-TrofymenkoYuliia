import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3000';

const generateUsername = (email) => {
  if (!email) return 'Guest';
  return email.split('@')[0];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const updateUserContext = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        usernameOrEmail: email,
        password,
      });

      const { accessToken, user: serverUserData } = response.data;

      if (serverUserData.id) {
        const username = serverUserData.username || generateUsername(email);

        const finalUserData = {
          ...serverUserData,
          email: email,
          username: username,
        };

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(finalUserData));

        setToken(accessToken);
        setUser(finalUserData);
        return true;
      }
      setAuthError('Invalid credentials or user data missing.');
      return false;
    } catch (error) {
      setAuthError('Invalid email or password.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const dataToSend = { email: userData.email, password: userData.password };

      const userCreationResponse = await axios.post(
        `${API_URL}/auth/register`,
        dataToSend
      );

      if (userCreationResponse.status === 201) {
        return await login(userData.email, userData.password);
      }
      return false;
    } catch (error) {
      let message =
        error.response?.data?.error ||
        'Registration failed. The email may already be in use.';
      setAuthError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
        authError,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
