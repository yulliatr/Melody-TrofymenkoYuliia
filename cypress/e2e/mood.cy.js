describe('Mood Page e2e', () => {
  const email = `mood${Date.now()}@mail.com`;
  const password = '123456';

  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/test/delete-test-user', {
      email,
    });

    cy.visit('/signup');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/profile');

    cy.visit('/mood');
  });

  it('enables generate button after selecting mood', () => {
    cy.get('.emotion-button').first().click();
    cy.get('.generate-button').should('not.be.disabled');
  });

  it('generates a song', () => {
    cy.get('.emotion-button').first().click();
    cy.get('.generate-button').click();

    cy.get('.generated-track-text', { timeout: 8000 }).should('exist');
  });

  it('saves a generated track', () => {
    cy.get('.emotion-button').first().click();
    cy.get('.generate-button').click();

    cy.get('.heart-icon', { timeout: 8000 }).click();

    cy.get('.heart-icon').should('have.attr', 'src').and('include', 'heart2');
  });
});
