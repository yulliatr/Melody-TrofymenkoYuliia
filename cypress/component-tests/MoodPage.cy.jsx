import React from 'react';
import MoodPage from '../../src/pages/MoodPage';
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

describe('MoodPage', () => {
  it('renders mood buttons', () => {
    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <MoodPage />
        </MockAuthProvider>
      </MemoryRouter>
    );
    cy.get('.emotion-button').should('have.length', 6);
  });

  it('generates song after mood selected', () => {
    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <MoodPage />
        </MockAuthProvider>
      </MemoryRouter>
    );
    cy.get('.emotion-button').first().click();
    cy.get('.generate-button').click();
    cy.get('.generated-track-text').should('exist');
  });
});
