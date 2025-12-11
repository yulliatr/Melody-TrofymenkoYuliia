import './commands';

import { mount } from 'cypress/react';

import '@cypress/code-coverage/support';

Cypress.Commands.add('mount', mount);
