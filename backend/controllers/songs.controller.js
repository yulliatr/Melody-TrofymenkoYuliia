import songsService from '../services/songs.service.js';

const songsController = {
  async getSongsPool(req, res) {
    try {
      const songs = await songsService.getSongs();
      res.json(songs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default songsController;
