import React from 'react';
import HomePage from '../../src/pages/HomePage';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('HomePage', () => {
  const mountWithRouter = () => {
    mount(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/mood"
            element={<div data-cy="mood-page">Mood Page</div>}
          />
          <Route
            path="/guess"
            element={<div data-cy="guess-page">Guess Page</div>}
          />
          <Route
            path="/signin"
            element={<div data-cy="signin-page">Sign In</div>}
          />
          <Route
            path="/signup"
            element={<div data-cy="signup-page">Sign Up</div>}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mountWithRouter();
  });

  it('renders welcome title and subtitle', () => {
    cy.get('.welcome-title').should('contain.text', 'Welcome To Melody!');
    cy.get('.welcome-subtitle').should(
      'contain.text',
      'Discover how your emotions sound'
    );
  });

  it('renders navigation buttons', () => {
    cy.contains('Find a Song by Mood').should('exist');
    cy.contains('Guess the Melody').should('exist');
  });

  it('renders authentication links', () => {
    cy.get('.auth-link').contains('Log in').should('exist');
    cy.get('.auth-link').contains('sign up').should('exist');
  });

  it('navigates to Mood Page when clicking the mood button', () => {
    cy.contains('Find a Song by Mood').click();
    cy.get('[data-cy="mood-page"]').should('exist');
  });

  it('navigates to Guess Page when clicking the guess button', () => {
    cy.contains('Guess the Melody').click();
    cy.get('[data-cy="guess-page"]').should('exist');
  });

  it('navigates to Sign In when clicking login link', () => {
    cy.get('.auth-link').contains('Log in').click();
    cy.get('[data-cy="signin-page"]').should('exist');
  });

  it('navigates to Sign Up when clicking sign up link', () => {
    cy.get('.auth-link').contains('sign up').click();
    cy.get('[data-cy="signup-page"]').should('exist');
  });

  it('renders background ellipses', () => {
    cy.get('.ellipse.ellipse1').should('exist');
    cy.get('.ellipse.ellipse2').should('exist');
    cy.get('.ellipse.ellipse3').should('exist');
  });

  it('buttons have correct classes', () => {
    cy.get('.button-section .main-button.button1').should('exist');
    cy.get('.button-section .main-button.button2').should('exist');
  });
});
