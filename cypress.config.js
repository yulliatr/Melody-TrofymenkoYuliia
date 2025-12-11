import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task.js';

export default defineConfig({
  e2e: {},
  component: {
    indexHtmlFile: 'cypress/support/cypress-component-index.html',

    devServer: {
      framework: 'react',
      bundler: 'vite',
    },

    supportFile: 'cypress/support/component.js',

    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },
});
