import React from 'react';
import ScrollToTop from '../../src/components/ScrollToTop';
import { mount } from 'cypress/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('ScrollToTop – stable coverage test', () => {
  it('calls scrollTo on mount and on route change (via remount)', () => {
    const scrollStub = cy.stub(window, 'scrollTo');

    mount(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/about" element={<div>About</div>} />
        </Routes>
      </MemoryRouter>
    );

    cy.wrap(scrollStub).should('be.calledOnceWith', 0, 0);

    mount(
      <MemoryRouter initialEntries={['/about']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/about" element={<div>About</div>} />
        </Routes>
      </MemoryRouter>
    );

    cy.wrap(scrollStub).should('have.been.calledTwice');
  });
});
