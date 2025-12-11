import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { AuthContext } from '../../src/hooks/useAuth';

const MockAuthProvider = ({ children, value }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

describe('ProtectedRoute', () => {
  it('shows loading when loading is true', () => {
    mount(
      <MemoryRouter initialEntries={['/profile']}>
        <MockAuthProvider value={{ isAuthenticated: false, loading: true }}>
          <ProtectedRoute element={<div>Protected</div>} />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains('Loading authentication...').should('exist');
  });

  it('renders element when authenticated', () => {
    mount(
      <MemoryRouter initialEntries={['/profile']}>
        <MockAuthProvider value={{ isAuthenticated: true, loading: false }}>
          <ProtectedRoute element={<div>Protected</div>} />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains('Protected').should('exist');
  });

  it('redirects when not authenticated', () => {
    mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path="/profile"
            element={
              <MockAuthProvider
                value={{ isAuthenticated: false, loading: false }}
              >
                <ProtectedRoute element={<div>Protected</div>} />
              </MockAuthProvider>
            }
          />
          <Route path="/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    cy.contains('Sign In Page').should('exist');
  });
});
