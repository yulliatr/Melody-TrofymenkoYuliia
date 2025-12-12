import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task.js';

import User from './backend/models/User.js';
import bcrypt from 'bcryptjs';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1620,
    viewportHeight: 1080,

    setupNodeEvents(on, config) {
      on('task', {
        async createUser({ email, password }) {
          if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found');
            return null;
          }

          await mongoose.connect(process.env.MONGO_URI);

          const exists = await User.findOne({ email });
          if (!exists) {
            const hashed = await bcrypt.hash(password, 10);
            await User.create({
              email,
              username: email.split('@')[0],
              password: hashed,
              stats: {
                gamesPlayed: 0,
                correctAnswers: 0,
                longestStrike: 0,
                currentStrike: 0,
              },
            });
          }

          await mongoose.disconnect();
          return null;
        },

        async deleteUser(email) {
          if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found');
            return null;
          }

          await mongoose.connect(process.env.MONGO_URI);
          await User.deleteOne({ email });
          await mongoose.disconnect();
          return null;
        },
      });

      codeCoverageTask(on, config);

      return config;
    },
  },

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
