import React from 'react';
import NotFoundPage from '../../src/pages/NotFoundPage';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';

const ShowLocation = () => {
  const location = useLocation();
  return <div data-cy="location">{location.pathname}</div>;
};

describe('NotFoundPage – boosted coverage', () => {
  it('renders 404 message and home button', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    cy.contains('404').should('exist');
    cy.contains('Go to Home Page').should('exist');
  });

  it('renders subtitle text', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    cy.get('.not-found-subtitle')
      .should('exist')
      .and('contain.text', "Oops! We can't find the page you're looking for.");
  });

  it('renders background ellipses', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    cy.get('.ellipse').should('have.length', 3);
  });

  it('home button has correct href', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    cy.get('.home-button').should('have.attr', 'href', '/');
  });

  it('home button is clickable', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    cy.get('.home-button').click();
    cy.get('.home-button').should('exist');
  });

  it('renders Link component with correct DOM structure', () => {
    mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    cy.get('a.home-button')
      .should('have.length', 1)
      .and('have.attr', 'href', '/')
      .and('contain.text', 'Go to Home Page');
  });

  it('navigates to home when link is clicked', () => {
    mount(
      <MemoryRouter initialEntries={['/not-found']}>
        <Routes>
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/" element={<ShowLocation />} />
        </Routes>
      </MemoryRouter>
    );

    cy.get('.home-button').click();

    cy.get('[data-cy="location"]').should('contain.text', '/');
  });
});
