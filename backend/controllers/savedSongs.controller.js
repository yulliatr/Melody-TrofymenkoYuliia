const savedSongsService = require('../services/savedSongs.service');

module.exports = {
  async saveSong(req, res) {
    const songData = req.body;
    try {
      const newSong = await savedSongsService.saveSong(songData);
      res.status(201).json(newSong);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getSavedSongs(req, res) {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId query parameter.' });
    }

    try {
      const songs = await savedSongsService.getSongsByUserId(userId);
      res.status(200).json(songs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch saved songs.' });
    }
  },

  async deleteSong(req, res) {
    const { id } = req.params;
    try {
      await savedSongsService.deleteSong(id);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: 'Song record not found' });
    }
  },
};
