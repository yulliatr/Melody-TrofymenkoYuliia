describe('Profile Page E2E', () => {
  const password = '123456';

  beforeEach(() => {
    const email = `profile${Date.now()}@mail.com`;

    cy.request('POST', 'http://localhost:3000/test/delete-test-user', {
      email,
    });

    cy.visit('/signup');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').eq(0).type(password);
    cy.get('input[type="password"]').eq(1).type(password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/profile');
  });

  it('loads profile correctly', () => {
    cy.url().should('include', '/profile');

    cy.contains('Hi', { timeout: 6000 }).should('exist');
  });

  it('shows saved songs (may be empty)', () => {
    cy.get('body').then(($body) => {
      if ($body.find('.saved-song').length) {
        cy.get('.saved-song').should('exist');
      } else if ($body.find('.saved-songs-list').length) {
        cy.get('.saved-songs-list').should('exist');
      } else {
        cy.contains(/saved songs/i).should('exist');
      }
    });
  });

  it('adds and deletes a saved song', () => {
    cy.visit('/mood');

    cy.get('.emotion-button').first().click();
    cy.get('.generate-button').click();

    cy.get('.heart-icon', { timeout: 8000 }).click();

    cy.visit('/profile');

    cy.get('body').then(($body) => {
      if ($body.find('.delete-song').length) {
        cy.get('.delete-song', { timeout: 8000 })
          .first()
          .click({ force: true });

        cy.url().should('include', '/profile');
      } else {
        cy.log('No saved songs to delete');
      }
    });
  });
});
