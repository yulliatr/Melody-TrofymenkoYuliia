Cypress.Commands.add('generateEmail', () => {
  const id = Date.now();
  return `cytest+${id}@test.com`;
});

Cypress.Commands.add('register', (email, password = '123456') => {
  return cy.request('POST', 'http://localhost:3000/auth/register', {
    email,
    password,
  });
});

Cypress.Commands.add('login', (email, password = '123456') => {
  return cy
    .request('POST', 'http://localhost:3000/auth/login', {
      email,
      password,
    })
    .then((res) => {
      window.localStorage.setItem('token', res.body.accessToken);
      return res;
    });
});

Cypress.Commands.add('cleanupUser', (email) => {
  cy.exec(`node ./scripts/deleteUser.js ${email}`, {
    failOnNonZeroExit: false,
  });
});

Cypress.Commands.add('clearSavedSongs', () => {
  cy.request('GET', 'http://localhost:3000/saved_songs?userId=*').then(
    (res) => {
      if (res.body?.length) {
        res.body.forEach((song) => {
          cy.request('DELETE', `http://localhost:3000/saved_songs/${song.id}`);
        });
      }
    }
  );
});
