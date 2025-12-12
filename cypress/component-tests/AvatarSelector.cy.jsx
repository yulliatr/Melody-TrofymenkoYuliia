import React from 'react';
import AvatarSelector from '../../src/components/AvatarSelector';
import { mount } from 'cypress/react';

describe('AvatarSelector', () => {
  const options = ['avatar1.png', 'avatar2.png'];
  const currentUrl = 'avatar1.png';

  it('renders all avatar options and highlights selected', () => {
    mount(
      <AvatarSelector
        options={options}
        currentUrl={currentUrl}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    cy.get('.avatar-option').should('have.length', 2);
    cy.get('.avatar-option.selected').should('have.length', 1);
  });

  it('calls onSelect when avatar clicked', () => {
    const onSelect = cy.stub();

    mount(
      <AvatarSelector
        options={options}
        currentUrl={currentUrl}
        onSelect={onSelect}
        onClose={() => {}}
      />
    );

    cy.get('.avatar-option')
      .eq(1)
      .click()
      .then(() => {
        expect(onSelect).to.be.calledWith('avatar2.png');
      });
  });

  it('calls onClose when Close button clicked', () => {
    const onClose = cy.stub();

    mount(
      <AvatarSelector
        options={options}
        currentUrl={currentUrl}
        onSelect={() => {}}
        onClose={onClose}
      />
    );

    cy.contains('Close')
      .click()
      .then(() => {
        expect(onClose).to.be.called;
      });
  });

  it('renders the modal backdrop', () => {
    mount(
      <AvatarSelector
        options={options}
        currentUrl={currentUrl}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    cy.get('.modal-backdrop').should('exist');
    cy.get('.modal-content').should('exist');
  });

  it('renders avatar images inside options', () => {
    mount(
      <AvatarSelector
        options={options}
        currentUrl={currentUrl}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    cy.get('.avatar-image-preview').should('have.length', 2);
    cy.get('.avatar-image-preview')
      .first()
      .should('have.attr', 'src', 'avatar1.png');
  });
});
