import React from 'react';
import NotFoundPage from '../../src/pages/NotFoundPage';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';

describe('NotFoundPage', () => {
  it('renders 404 message and home button', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    cy.contains('404').should('exist');
    cy.contains('Go to Home Page').should('exist').click();
  });
});
