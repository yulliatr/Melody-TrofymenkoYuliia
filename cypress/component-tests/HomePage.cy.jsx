import React from 'react';
import HomePage from '../../src/pages/HomePage';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';

describe('HomePage', () => {
  it('renders navigation buttons', () => {
    mount(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    cy.contains('Find a Song by Mood').should('exist');
    cy.contains('Guess the Melody').should('exist');
  });

  it('navigates on button click', () => {
    const navigate = cy.stub();
    mount(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    cy.contains('Find a Song by Mood').click();
    cy.contains('Guess the Melody').click();
  });
});
