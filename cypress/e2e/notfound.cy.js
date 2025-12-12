describe('Not Found Page', () => {
  it('shows 404 page', () => {
    cy.visit('/no-such-page', { failOnStatusCode: false });
    cy.contains('404').should('exist');
    cy.contains('Go to Home Page').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
