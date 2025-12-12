describe('Authentication Flow', () => {
  const email = `test${Date.now()}@mail.com`;
  const password = '123456';

  before(() => {
    cy.task('deleteUser', email);
  });

  it('registers a new user', () => {
    cy.visit('/signup');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/profile');

    cy.contains('Hi,').should('exist');
  });

  it('logs in an existing user', () => {
    cy.visit('/signin');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/profile');

    cy.contains('Hi,').should('exist');
  });
});
