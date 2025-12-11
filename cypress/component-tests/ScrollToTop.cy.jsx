import React from 'react';
import ScrollToTop from '../../src/components/ScrollToTop';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('ScrollToTop', () => {
  it('calls window.scrollTo on route change', () => {
    cy.stub(window, 'scrollTo');
    mount(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/about" element={<div>About</div>} />
        </Routes>
      </MemoryRouter>
    );

    cy.contains('About').should('not.exist');
    window.history.pushState({}, '', '/about');
    cy.wait(50).then(() => {
      expect(window.scrollTo).to.be.calledWith(0, 0);
    });
  });
});
