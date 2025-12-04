const path = require('path');
const fs = require('fs');
const { readFile, writeFile } = require('../utils/file');
const jwt = require('jsonwebtoken');

const USERS_PATH = path.join(__dirname, '..', 'db', 'users.json');
const SECRET = 'supersecret';

const generateUsername = (email) => {
  if (!email) return 'Guest';
  return email.split('@')[0];
};

module.exports = {
  async register(email, password) {
    const users = await readFile(USERS_PATH);

    if (users.find((u) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const username = generateUsername(email);

    const newUser = {
      id: Date.now(),
      email,
      username,
      password,
      joined: new Date().toLocaleDateString('en-GB'),
      stats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        longestStrike: 0,
        currentStrike: 0,
      },
    };

    users.push(newUser);
    await writeFile(USERS_PATH, users);
    return newUser;
  },

  async login(email, password) {
    const users = await readFile(USERS_PATH);

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error('Invalid email or password');

    return {
      accessToken: jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' }),
      user,
    };
  },
};
