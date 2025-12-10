import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3000';

const generateUsername = (email) => (email ? email.split('@')[0] : 'Guest');

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const fixedStoredUser = storedUser
    ? { ...storedUser, _id: storedUser._id || storedUser.id }
    : null;

  const [user, setUser] = useState(
    storedUser ? { ...storedUser, _id: storedUser._id || storedUser.id } : null
  );
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { accessToken, user: serverUserData } = response.data;

      if (!serverUserData || (!serverUserData.id && !serverUserData._id)) {
        setAuthError('Invalid credentials or user data missing.');
        return false;
      }

      const finalUserData = {
        ...serverUserData,
        _id: serverUserData._id || serverUserData.id,
        username: serverUserData.username || generateUsername(email),
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(finalUserData));
      setToken(accessToken);
      setUser(finalUserData);

      return true;
    } catch {
      setAuthError('Invalid email or password.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      if (response.status === 201) {
        return await login(email, password);
      }
      setAuthError('Registration failed.');
      return false;
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Registration failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserContext = async (updates) => {
    if (!user) return;
    const userId = user._id || user.id;
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}`, updates);
      const updatedUser = {
        ...response.data,
        _id: response.data._id || response.data.id,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const refreshUser = async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(`${API_URL}/users/${user._id}`);
      const freshUser = {
        ...response.data,
        _id: response.data._id || response.data.id,
      };

      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        login,
        register,
        logout,
        loading,
        authError,
        updateUserContext,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
