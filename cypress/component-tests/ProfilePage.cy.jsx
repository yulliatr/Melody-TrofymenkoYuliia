import React from 'react';
import ProfilePage from '../../src/pages/ProfilePage';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/hooks/useAuth';

describe('ProfilePage', () => {
  it('renders user info and avatar', () => {
    mount(
      <MemoryRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </MemoryRouter>
    );
    cy.get('.avatar-image').should('exist');
    cy.get('.logout-link').click();
  });

  it('opens AvatarSelector on edit click', () => {
    mount(
      <MemoryRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </MemoryRouter>
    );
    cy.get('.edit-icon').first().click();
    cy.get('.modal-backdrop').should('exist');
  });
});
