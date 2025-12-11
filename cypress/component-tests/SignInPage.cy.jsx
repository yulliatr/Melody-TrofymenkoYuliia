import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '../../src/pages/SignInPage';

describe('SignInPage with submit', () => {
  it('calls login on submit with email and password', () => {
    const mockLogin = cy.stub().resolves(true);

    const mockUseAuth = () => ({
      login: mockLogin,
      loading: false,
      authError: null,
    });

    mount(
      <MemoryRouter>
        <SignInPage useAuth={mockUseAuth} />
      </MemoryRouter>
    );

    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').type('password123');

    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        expect(mockLogin).to.be.calledWith('test@test.com', 'password123');
      });
  });

  it('disables submit button when loading', () => {
    const mockUseAuth = () => ({
      login: async () => true,
      loading: true,
      authError: null,
    });

    mount(
      <MemoryRouter>
        <SignInPage useAuth={mockUseAuth} />
      </MemoryRouter>
    );

    cy.get('button[type="submit"]').should('be.disabled');
    cy.contains('Signing In...').should('exist');
  });

  it('renders authError if present', () => {
    const mockUseAuth = () => ({
      login: async () => false,
      loading: false,
      authError: 'Invalid credentials',
    });

    mount(
      <MemoryRouter>
        <SignInPage useAuth={mockUseAuth} />
      </MemoryRouter>
    );

    cy.contains('Invalid credentials').should('exist');
  });
});
