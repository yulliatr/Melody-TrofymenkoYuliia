const path = require('path');
const { readFile } = require('../utils/file');

const SONGS_PATH = path.join(__dirname, '..', 'db', 'songs.json');

module.exports = {
  async getSongs() {
    const songs = await readFile(SONGS_PATH);
    return songs;
  },
};
