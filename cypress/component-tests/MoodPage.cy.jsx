import React from 'react';
import { mount } from 'cypress/react';
import MoodPage from '../../src/pages/MoodPage';
import { AuthContext } from '../../src/hooks/useAuth';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const makeAuthValue = (overrides = {}) => ({
  isAuthenticated: true,
  user: { name: 'Test User', _id: '1', username: 'TestUser' },
  login: async () => true,
  register: async () => true,
  logout: () => {},
  loading: false,
  authError: null,
  updateUserContext: () => {},
  refreshUser: () => {},
  ...overrides,
});

const mountWithAuth = (authOverrides = {}) => {
  const value = makeAuthValue(authOverrides);

  mount(
    <MemoryRouter initialEntries={['/mood']}>
      <AuthContext.Provider value={value}>
        <MoodPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('MoodPage (clean, coverage-focused)', () => {
  it('renders mood buttons, header icons and background', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [],
    }).as('pool');

    mountWithAuth();

    cy.wait('@pool');

    cy.get('.emotion-button').should('have.length', 6);
    cy.get('.header-icon.left-icon').should('exist');
    cy.get('.header-icon.right-icon').should('exist');
    cy.get('.ellipse.ellipse1').should('exist');
    cy.get('.ellipse.ellipse2').should('exist');
    cy.get('.ellipse.ellipse3').should('exist');
  });

  it('disables generate button when no mood selected', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [],
    }).as('pool');

    mountWithAuth();
    cy.wait('@pool');

    cy.get('.generate-button').should('be.disabled');
  });

  it('enables generate button when mood selected', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [],
    }).as('pool');

    mountWithAuth();
    cy.wait('@pool');

    cy.get('.emotion-button').first().click();
    cy.get('.generate-button').should('not.be.disabled');
  });

  it('generates a song after mood selected (happy path)', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [{ id: 1, title: 'Song 1', artist: 'Artist 1', mood: 'Happy' }],
    }).as('pool');

    mountWithAuth();
    cy.wait('@pool');

    cy.get('.emotion-button').contains('Happy').click();
    cy.get('.generate-button').click();

    cy.get('.generated-track-text')
      .should('exist')
      .and('contain.text', 'Song 1');
  });

  it('displays "No songs found" when no songs match mood', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [],
    }).as('pool');

    mountWithAuth();
    cy.wait('@pool');

    cy.get('.emotion-button').contains('Christmas').click();
    cy.get('.generate-button').click();

    cy.get('.generated-track-text')
      .should('contain.text', 'No songs found')
      .and('contain.text', 'Try another mood');
  });

  it('saves song when heart clicked (success save)', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [
        { id: 2, title: 'Love Song', artist: 'Artist 2', mood: 'Romantic' },
      ],
    }).as('pool');

    cy.intercept('POST', '**/saved_songs', {
      statusCode: 200,
      body: { success: true },
    }).as('saveSong');

    mountWithAuth();
    cy.wait('@pool');

    cy.get('.emotion-button').contains('Romantic').click();
    cy.get('.generate-button').click();

    cy.get('.generated-track-text').should('contain.text', 'Love Song');

    cy.get('.heart-icon').click();
    cy.wait('@saveSong');

    cy.get('.heart-icon').should('have.attr', 'src').and('include', 'heart2');
  });

  it('shows error when songs API fails', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 500,
      body: {},
    }).as('poolErr');

    mountWithAuth();
    cy.wait('@poolErr');

    cy.contains('Error connecting to music server.').should('exist');
  });

  it('redirects to Sign In when user not authenticated and tries to save', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [{ id: 3, title: 'Chill', artist: 'A', mood: 'Relaxed' }],
    }).as('pool');

    mount(
      <MemoryRouter initialEntries={['/mood']}>
        <Routes>
          <Route
            path="/mood"
            element={
              <AuthContext.Provider
                value={makeAuthValue({ isAuthenticated: false })}
              >
                <MoodPage />
              </AuthContext.Provider>
            }
          />
          <Route
            path="/signin"
            element={<div data-cy="signin-view">Sign In Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    cy.wait('@pool');

    cy.contains('Relaxed').click();
    cy.get('.generate-button').click();
    cy.get('.heart-icon').click();

    cy.get('[data-cy="signin-view"]').should('exist');
  });

  it('handles saveSong failure safely (heart stays inactive)', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [{ id: 4, title: 'Fail Song', artist: 'B', mood: 'Sad' }],
    }).as('pool');

    cy.intercept('POST', '**/saved_songs', {
      statusCode: 500,
      body: { success: false },
    }).as('saveFail');

    mountWithAuth();
    cy.wait('@pool');

    cy.contains('Sad').click();
    cy.get('.generate-button').click();
    cy.get('.heart-icon').click();

    cy.wait('@saveFail');

    cy.get('.heart-icon').should('have.attr', 'src').and('include', 'heart1');
  });

  it('disables save visually while saving is in progress (opacity branch)', () => {
    cy.intercept('GET', '**/songs/pool', {
      statusCode: 200,
      body: [{ id: 5, title: 'Slow', artist: 'C', mood: 'Motivated' }],
    }).as('pool');

    cy.intercept('POST', '**/saved_songs', (req) => {
      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(req.reply({ statusCode: 200, body: { success: true } })),
          1500
        );
      });
    }).as('slowSave');

    mountWithAuth();
    cy.wait('@pool');

    cy.contains('Motivated').click();
    cy.get('.generate-button').click();

    cy.get('.heart-icon').click();

    cy.get('.heart-icon').should('have.css', 'opacity', '0.5');

    cy.wait('@slowSave');

    cy.get('.heart-icon').should('have.attr', 'src').and('include', 'heart2');
  });
});
