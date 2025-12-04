const path = require('path');
const { readFile, writeFile } = require('../utils/file');

const USERS_PATH = path.join(__dirname, '..', 'db', 'users.json');

module.exports = {
  async updateUser(userId, updates) {
    const users = await readFile(USERS_PATH);

    const targetId = String(userId);

    const userIndex = users.findIndex((u) => String(u.id) === targetId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[userIndex],
      ...updates,
    };

    users[userIndex] = updatedUser;

    await writeFile(USERS_PATH, users);

    const { password, ...safeUser } = updatedUser;
    return safeUser;
  },
};
