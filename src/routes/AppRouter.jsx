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

const AppRouter = () => (
  <Router>
    <ScrollToTop />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/guess" element={<GuessPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
