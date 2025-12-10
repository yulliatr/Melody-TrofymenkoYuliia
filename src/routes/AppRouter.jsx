import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MoodPage from '../pages/MoodPage';
import GuessPage from '../pages/GuessPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import ScrollToTop from '../components/ScrollToTop';

import { AuthProvider } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => (
  <Router>
    <AuthProvider>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/guess" element={<GuessPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default AppRouter;
