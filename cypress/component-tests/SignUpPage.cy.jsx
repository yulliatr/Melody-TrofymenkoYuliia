import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from '../../src/pages/SignUpPage';
import { AuthContext } from '../../src/hooks/useAuth';

const MockAuthProvider = ({ children, value }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

describe('SignUpPage', () => {
  const mountWithAuth = (value) =>
    mount(
      <MemoryRouter>
        <MockAuthProvider value={value}>
          <SignUpPage />
        </MockAuthProvider>
      </MemoryRouter>
    );

  it('renders all form inputs and submit button', () => {
    mountWithAuth({
      register: async () => true,
      loading: false,
      authError: null,
    });

    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('have.length', 2);
    cy.get('button[type="submit"]').should('exist').and('not.be.disabled');
  });

  it('disables submit button when loading', () => {
    mountWithAuth({
      register: async () => true,
      loading: true,
      authError: null,
    });

    cy.get('button[type="submit"]').should('be.disabled');
    cy.contains('Registering...').should('exist');
  });

  it('shows error if any field is empty', () => {
    mountWithAuth({
      register: async () => true,
      loading: false,
      authError: null,
    });

    cy.get('form').submit();
    cy.contains('Please fill in all fields.').should('exist');
  });

  it('shows error if password is too short', () => {
    mountWithAuth({
      register: async () => true,
      loading: false,
      authError: null,
    });

    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').first().type('123');
    cy.get('input[type="password"]').last().type('123');

    cy.get('form').submit();
    cy.contains('Password must be at least 6 characters long.').should('exist');
  });

  it('shows error if passwords do not match', () => {
    mountWithAuth({
      register: async () => true,
      loading: false,
      authError: null,
    });

    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').first().type('123456');
    cy.get('input[type="password"]').last().type('654321');

    cy.get('form').submit();
    cy.contains('Passwords do not match!').should('exist');
  });

  it('calls register on valid submit and navigates on success', () => {
    const registerStub = cy.stub().resolves(true);

    mountWithAuth({ register: registerStub, loading: false, authError: null });

    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').first().type('123456');
    cy.get('input[type="password"]').last().type('123456');
    cy.get('form').submit();

    cy.wrap(registerStub).should('be.calledWith', {
      email: 'test@test.com',
      password: '123456',
    });
  });

  it('shows authError if register fails', () => {
    mountWithAuth({
      register: async () => false,
      loading: false,
      authError: 'Email already used',
    });

    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').first().type('123456');
    cy.get('input[type="password"]').last().type('123456');

    cy.get('form').submit();
    cy.contains('Email already used').should('exist');
  });

  it('shows error when register fails because login returns false', () => {
    const failingRegister = async () => false;

    mountWithAuth({
      register: failingRegister,
      loading: false,
      authError: null,
    });

    cy.get('input[type="email"]').type('fail@test.com');
    cy.get('input[type="password"]').first().type('111111');
    cy.get('input[type="password"]').last().type('111111');

    cy.get('form').submit();
    cy.contains(
      'Registration failed. Check if the email is already in use.'
    ).should('exist');
  });

  it('shows generic fallback when register returns false with no authError', () => {
    mountWithAuth({
      register: async () => false,
      loading: false,
      authError: null,
    });

    cy.get('input[type="email"]').type('generic@test.com');
    cy.get('input[type="password"]').first().type('111111');
    cy.get('input[type="password"]').last().type('111111');

    cy.get('form').submit();
    cy.contains(
      'Registration failed. Check if the email is already in use.'
    ).should('exist');
  });

  it('shows backend error message from authError', () => {
    mountWithAuth({
      register: async () => false,
      loading: false,
      authError: 'Backend exploded!',
    });

    cy.get('input[type="email"]').type('err@test.com');
    cy.get('input[type="password"]').first().type('111111');
    cy.get('input[type="password"]').last().type('111111');

    cy.get('form').submit();
    cy.contains('Backend exploded!').should('exist');
  });

  it('handles register loader + error together (corner case)', () => {
    mountWithAuth({
      register: async () => false,
      loading: true,
      authError: 'Weird internal error',
    });

    cy.get('button[type="submit"]').should('be.disabled');
    cy.contains('Registering...').should('exist');
  });
});
