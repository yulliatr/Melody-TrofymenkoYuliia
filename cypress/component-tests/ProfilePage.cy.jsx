import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../../src/pages/ProfilePage';
import { AuthContext } from '../../src/hooks/useAuth';
import axios from 'axios';

const mockUser = {
  _id: '1',
  username: 'TestUser',
  email: 'test@test.com',
  avatarUrl: 'avatar.png',
  joined: new Date(),
  stats: { gamesPlayed: 5, correctAnswers: 10, longestStrike: 3 },
};

const MockAuthProvider = ({ children, overrides = {} }) => {
  const defaultAuth = {
    user: mockUser,
    logout: cy.stub(),
    updateUserContext: cy.stub(),
    refreshUser: cy.stub(),
    ...overrides,
  };

  return (
    <AuthContext.Provider value={defaultAuth}>{children}</AuthContext.Provider>
  );
};

describe('ProfilePage – boosted coverage', () => {
  let deleteStub;
  let patchStub;

  beforeEach(() => {
    deleteStub = cy.stub(axios, 'delete');
    patchStub = cy.stub(axios, 'patch');
  });

  afterEach(() => {
    deleteStub.restore();
    patchStub.restore();
  });

  it('renders user info and triggers refreshUser on mount', () => {
    const refreshUserStub = cy.stub();

    mount(
      <MemoryRouter>
        <MockAuthProvider overrides={{ refreshUser: refreshUserStub }}>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains('Hi, TestUser!').should('exist');

    cy.wrap(refreshUserStub).should('be.called');
  });

  it('opens avatar modal and updates avatar (useMutation success)', () => {
    // Mock PATCH success
    axios.patch.resolves({
      data: {
        username: 'TestUser',
        avatarUrl: 'avatar2.png',
        email: 'test@test.com',
        _id: '1',
      },
    });

    const updateUserContextStub = cy.stub();

    mount(
      <MemoryRouter>
        <MockAuthProvider
          overrides={{ updateUserContext: updateUserContextStub }}
        >
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.get('.edit-icon').first().click();
    cy.get('.avatar-option').first().click();

    cy.wrap(updateUserContextStub).should('be.called');
  });

  it('handles avatar update error (useMutation failure)', () => {
    axios.patch.rejects(new Error('Server fail'));

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.get('.edit-icon').first().click();
    cy.get('.avatar-option').eq(1).click();

    cy.log('Error handled without crash');
  });

  it('loads saved songs (success branch)', () => {
    cy.intercept('GET', '/saved_songs*', {
      statusCode: 200,
      body: [
        { id: 10, title: 'Song A', artist: 'Artist A', audioSrc: '/a.mp3' },
      ],
    });

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains('Song A').should('exist');
  });

  it('shows empty saved songs (empty branch)', () => {
    cy.intercept('GET', '/saved_songs*', {
      statusCode: 200,
      body: [],
    });

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains("You don't have any saved songs yet.").should('exist');
  });

  it('shows error on saved songs load (error branch)', () => {
    cy.intercept('GET', '/saved_songs*', {
      statusCode: 500,
    });

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains('Error loading songs.').should('exist');
  });

  it('removes saved song (delete mutation success)', () => {
    axios.delete.resolves({ data: {} });

    cy.intercept('GET', '/saved_songs*', {
      statusCode: 200,
      body: [{ id: 20, title: 'DeleteMe', artist: 'X', audioSrc: '/x.mp3' }],
    });

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.contains('DeleteMe').should('exist');

    cy.get('.remove-icon').click();

    cy.contains('DeleteMe').should('not.exist');
  });

  it('handles delete song error safely', () => {
    axios.delete.rejects(new Error('Delete fail'));

    cy.intercept('GET', '/saved_songs*', {
      statusCode: 200,
      body: [{ id: 30, title: 'ErrSong', artist: 'Y', audioSrc: '/y.mp3' }],
    });

    mount(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.get('.remove-icon').click();

    cy.contains('ErrSong').should('exist');
  });

  it('logs out user', () => {
    const logoutStub = cy.stub();

    mount(
      <MemoryRouter>
        <MockAuthProvider overrides={{ logout: logoutStub }}>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    cy.get('.logout-link').click();
    cy.wrap(logoutStub).should('be.called');
  });
});
