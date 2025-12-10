import Song from '../models/Song.js';

export default {
  async getSongs() {
    return Song.find();
  },

  async getSongById(id) {
    return Song.findById(id);
  },
};
