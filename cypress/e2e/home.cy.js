describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders homepage correctly', () => {
    cy.contains('Welcome To Melody!').should('exist');
    cy.contains('Find a Song by Mood').should('exist');
    cy.contains('Guess the Melody').should('exist');
  });

  it('navigates to SignIn/SignUp', () => {
    cy.contains('Log in').click();
    cy.url().should('include', '/signin');

    cy.visit('/');
    cy.contains('sign up').click();
    cy.url().should('include', '/signup');
  });

  it('navigates to Mood page', () => {
    cy.contains('Find a Song by Mood').click();
    cy.url().should('include', '/mood');
  });

  it('navigates to Guess page', () => {
    cy.contains('Guess the Melody').click();
    cy.url().should('include', '/guess');
  });
});
