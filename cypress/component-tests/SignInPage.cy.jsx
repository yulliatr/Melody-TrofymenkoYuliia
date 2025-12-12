import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SignInPage from '../../src/pages/SignInPage';

const renderWithRouter = (hook) => {
  mount(
    <MemoryRouter initialEntries={['/signin']}>
      <Routes>
        <Route path="/signin" element={<SignInPage useAuth={() => hook} />} />
        <Route
          path="/profile"
          element={<div data-cy="profile-page">Profile Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('SignInPage (Cypress, stable)', () => {
  it('renders inputs and submit button', () => {
    renderWithRouter({ login: cy.stub(), loading: false, authError: null });

    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('shows loading state', () => {
    renderWithRouter({ login: cy.stub(), loading: true, authError: null });

    cy.contains('Signing In...').should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('shows authentication error', () => {
    renderWithRouter({
      login: cy.stub(),
      loading: false,
      authError: 'Invalid credentials',
    });

    cy.contains('Invalid credentials').should('exist');
  });

  it('does not call login when fields are empty', () => {
    const loginStub = cy.stub();
    renderWithRouter({ login: loginStub, loading: false, authError: null });

    cy.get('form').submit();

    cy.wrap(loginStub).should('not.be.called');
  });

  it('calls login and navigates on success', () => {
    const loginStub = cy.stub().resolves(true);
    renderWithRouter({ login: loginStub, loading: false, authError: null });

    cy.get('input[type="email"]').type('user@test.com');
    cy.get('input[type="password"]').type('123456');

    cy.get('form').submit();

    cy.wrap(loginStub).should('be.calledWith', 'user@test.com', '123456');

    cy.get('[data-cy="profile-page"]').should('exist');
  });

  it('does not navigate when login returns false', () => {
    const loginStub = cy.stub().resolves(false);
    renderWithRouter({ login: loginStub, loading: false, authError: null });

    cy.get('input[type="email"]').type('fail@test.com');
    cy.get('input[type="password"]').type('badpass');

    cy.get('form').submit();

    cy.wrap(loginStub).should('be.called');

    cy.get('[data-cy="profile-page"]').should('not.exist');
  });

  it('shows authError when login returns false and authError present', () => {
    const loginStub = cy.stub().resolves(false);
    renderWithRouter({
      login: loginStub,
      loading: false,
      authError: 'Server says no',
    });

    cy.get('input[type="email"]').type('err@test.com');
    cy.get('input[type="password"]').type('111111');

    cy.get('form').submit();

    cy.wrap(loginStub).should('be.called');
    cy.contains('Server says no').should('exist');
    cy.get('[data-cy="profile-page"]').should('not.exist');
  });
});
