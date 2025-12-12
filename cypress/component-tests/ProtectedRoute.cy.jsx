import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { AuthContext } from '../../src/hooks/useAuth';

const MockAuthProvider = ({ children, value }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

describe('ProtectedRoute – full coverage', () => {
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

  it('renders protected element when authenticated', () => {
    mount(
      <MemoryRouter initialEntries={['/profile']}>
        <MockAuthProvider value={{ isAuthenticated: true, loading: false }}>
          <ProtectedRoute element={<div data-cy="protected">Protected</div>} />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.get('[data-cy="protected"]').should('exist');
  });

  it('redirects to signin when not authenticated', () => {
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
          <Route
            path="/signin"
            element={<div data-cy="signin">Sign In Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    cy.get('[data-cy="signin"]').should('exist');
  });

  it('redirects when isAuthenticated is undefined/null', () => {
    mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path="/profile"
            element={
              <MockAuthProvider
                value={{ isAuthenticated: null, loading: false }}
              >
                <ProtectedRoute element={<div>Protected</div>} />
              </MockAuthProvider>
            }
          />
          <Route
            path="/signin"
            element={<div data-cy="signin-null">Sign In Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    cy.get('[data-cy="signin-null"]').should('exist');
  });

  it('renders nested element content when authenticated', () => {
    mount(
      <MemoryRouter>
        <MockAuthProvider value={{ isAuthenticated: true, loading: false }}>
          <ProtectedRoute
            element={
              <div>
                <h1 data-cy="nested">Nested Protected</h1>
              </div>
            }
          />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.get('[data-cy="nested"]').should('exist');
  });
});
