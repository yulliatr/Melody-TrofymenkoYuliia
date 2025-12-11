import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GuessPage from '../../src/pages/GuessPage';
import * as useAuthHook from '../../src/hooks/useAuth';

const mockQuiz = {
  id: 'quiz-1',
  correctAnswerId: 'song-1',
  options: [
    {
      id: 'song-1',
      title: 'House Tour',
      artist: 'Sabrina Carpenter',
      audioSrc: '/assets/songs/house_tour.mp3',
    },
    {
      id: 'song-2',
      title: 'Let It Snow!',
      artist: 'Dean Martin',
      audioSrc: '/assets/songs/let_it_snow.mp3',
    },
    {
      id: 'song-3',
      title: 'Holly Jolly Christmas',
      artist: 'Michael Buble',
      audioSrc: '/assets/songs/holly_jolly.mp3',
    },
    {
      id: 'song-4',
      title: 'Jingle Bell Rock',
      artist: 'Bobby Helms',
      audioSrc: '/assets/songs/jingle_bell.mp3',
    },
  ],
};

const MockAuthProvider = ({ children }) => {
  const mockAuth = {
    user: { _id: 'user-1', stats: { currentStrike: 0 } },
    token: 'fake-token',
    isAuthenticated: true,
    updateUserContext: () => {},
  };
  return (
    <useAuthHook.AuthContext.Provider value={mockAuth}>
      {children}
    </useAuthHook.AuthContext.Provider>
  );
};

describe('GuessPage Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/quiz/generate', {
      statusCode: 200,
      body: mockQuiz,
    }).as('getQuiz');
    cy.intercept('POST', '/quiz/submit', (req) => {
      req.reply({
        statusCode: 200,
        body: { user: { _id: 'user-1', stats: { currentStrike: 1 } } },
      });
    }).as('submitAnswer');

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <GuessPage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.wait('@getQuiz');
  });

  it('renders header icons and instructions', () => {
    cy.get('.header-icon').should('have.length', 2);
    cy.contains('GAME INSTRUCTIONS:').should('exist');
  });

  it('renders wave icons and play button', () => {
    cy.get('.wave-icon').should('have.length', 6);
    cy.get('.play-button').should('exist');
  });

  it('renders 4 option buttons with default text before playing', () => {
    cy.get('.option-button').should('have.length', 4);
    cy.get('.option-button').each(($btn, i) => {
      cy.wrap($btn).contains(`Option ${i + 1}`);
    });
  });

  it('plays and pauses audio when clicking play button', () => {
    cy.get('.play-button').click();
    cy.get('audio').should('exist');
    cy.get('.play-button').click();
    cy.get('audio').should('not.exist');
  });

  it('displays Play Again button after result', () => {
    cy.get('.play-button').click();
    cy.get('.option-button').first().click();
    cy.contains('button', 'Play Again').should('exist');
  });

  it('resets state when Play Again is clicked', () => {
    cy.get('.play-button').click();
    cy.get('.option-button').first().click();
    cy.contains('button', 'Play Again').click();
    cy.get('.option-button').each(($btn) => {
      cy.wrap($btn)
        .should('not.have.class', 'correct-answer')
        .and('not.have.class', 'wrong-selected');
    });
  });
  it('redirects to Sign In when user not authenticated', () => {
    const mockAuth = {
      user: { _id: 'user-1', stats: {} },
      isAuthenticated: false,
      updateUserContext: () => {},
    };

    cy.intercept('GET', '/quiz/generate', {
      statusCode: 200,
      body: mockQuiz,
    }).as('quiz');

    mount(
      <MemoryRouter initialEntries={['/guess']}>
        <useAuthHook.AuthContext.Provider value={mockAuth}>
          <Routes>
            <Route path="/guess" element={<GuessPage />} />
            <Route
              path="/signin"
              element={<div data-cy="sign-in">Sign In</div>}
            />
          </Routes>
        </useAuthHook.AuthContext.Provider>
      </MemoryRouter>
    );

    cy.wait('@quiz');

    cy.get('.play-button').click();

    cy.get('.option-button').first().click();

    cy.get('[data-cy="sign-in"]').should('exist');
  });

  it('prevents answering before Play is clicked', () => {
    cy.get('.option-button').first().click({ force: true });

    cy.get('.result-message').should('not.exist');
  });
  it('marks wrong and correct answers properly', () => {
    cy.get('.play-button').click();

    cy.get('.option-button').eq(1).click();

    cy.get('.wrong-selected').should('exist');
    cy.get('.correct-answer').should('exist');
  });

  it('handles submitAnswer failure gracefully', () => {
    cy.intercept('POST', '/quiz/submit', {
      statusCode: 500,
      body: {},
    }).as('submitFail');

    cy.get('.play-button').click();
    cy.get('.option-button').first().click();

    cy.wait('@submitFail');

    cy.get('.result-message').should('exist');
  });
  it('resets UI state after Play Again', () => {
    cy.get('.play-button').click();
    cy.get('.option-button').first().click();
    cy.contains('Play Again').click();

    cy.get('.option-button').each(($btn) => {
      cy.wrap($btn)
        .should('not.have.class', 'correct-answer')
        .and('not.have.class', 'wrong-selected');
    });

    cy.get('.result-message').should('not.exist');
    cy.get('audio').should('not.exist');
  });
});
