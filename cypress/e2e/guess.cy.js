describe('Guess the Melody Quiz', () => {
  const email = `guess${Date.now()}@mail.com`;
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

    cy.visit('/guess');

    cy.intercept('GET', 'http://localhost:3000/quiz/generate').as('quizGen');

    cy.wait('@quizGen');
    cy.wait('@quizGen');

    cy.get('.option-button').should('have.length', 4);
  });

  it('loads quiz with 4 options', () => {
    cy.get('.option-button').should('have.length', 4);
  });

  it('shows result message and Play Again button after answering', () => {
    cy.get('.play-button').should('be.visible').click({ force: true });

    cy.get('audio', { timeout: 10000 }).should('exist');

    cy.wait(300);

    cy.get('.option-button').first().click({ force: true });

    cy.get('.result-message', { timeout: 10000 }).should('exist');

    cy.contains('Play Again', { timeout: 8000 }).should('exist');
  });

  it('resets after clicking Play Again', () => {
    cy.get('.play-button').click({ force: true });

    cy.get('audio', { timeout: 10000 }).should('exist');
    cy.wait(300);

    cy.get('.option-button').first().click({ force: true });

    cy.contains('Play Again', { timeout: 8000 }).click({ force: true });

    cy.get('.result-message').should('not.exist');
    cy.get('.option-button').should('have.length', 4);
  });
});
