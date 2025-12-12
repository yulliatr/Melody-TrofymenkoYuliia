describe('Navigation', () => {
  it('redirects to 404 on invalid page', () => {
    cy.visit('/thispagedoesnotexist', { failOnStatusCode: false });
    cy.contains('404').should('exist');
  });

  it('protects /profile route', () => {
    cy.visit('/profile');
    cy.url().should('include', '/signin');
  });
});
