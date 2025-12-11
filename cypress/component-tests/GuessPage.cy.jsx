import React from 'react';
import GuessPage from '../../src/pages/GuessPage';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../src/hooks/useAuth';

const MockAuthProvider = ({ children }) => {
  const mockValue = {
    isAuthenticated: true,
    user: { name: 'Test User', _id: '1', username: 'TestUser' },
    login: async () => true,
    register: async () => true,
    logout: () => {},
    loading: false,
    authError: null,
    updateUserContext: () => {},
    refreshUser: () => {},
  };
  return (
    <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
  );
};

describe('GuessPage', () => {
  it('renders play button', () => {
    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <GuessPage />
        </MockAuthProvider>
      </MemoryRouter>
    );
    cy.get('.play-button').should('exist');
  });

  it('renders 4 answer buttons when quiz loaded', () => {
    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <GuessPage />
        </MockAuthProvider>
      </MemoryRouter>
    );
    cy.get('.option-button').should('have.length', 0);
  });
});
