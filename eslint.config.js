import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import cypress from 'eslint-plugin-cypress';
import babelParser from '@babel/eslint-parser';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },

  js.configs.recommended,

  {
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },

  {
    files: ['cypress.config.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  {
    files: ['src/**/*.{js,jsx}', 'cypress/component/**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],

      'react/jsx-no-undef': 'off',
    },
  },

  {
    files: [
      'cypress/**/*.{js,jsx}',
      'src/tests/**/*.{js,jsx}',
      '**/*.test.{js,jsx}',
    ],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ['@babel/preset-react'] },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,

        cy: 'readonly',
        Cypress: 'readonly',

        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: { cypress },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
    },
  },
];
