const songsService = require('../services/songs.service');

module.exports = {
  async getSongsPool(req, res) {
    try {
      const songs = await songsService.getSongs();
      res.status(200).json(songs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
