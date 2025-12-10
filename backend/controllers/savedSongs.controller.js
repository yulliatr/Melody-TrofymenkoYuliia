import SavedSong from '../models/SavedSong.js';
import mongoose from 'mongoose';

import Song from '../models/Song.js';

const savedSongsController = {
  async saveSong(req, res) {
    try {
      const { userId, songId } = req.body;
      if (!userId || !songId)
        return res.status(400).json({ error: 'Missing userId or songId' });

      const song = await Song.findById(songId);
      if (!song) return res.status(404).json({ error: 'Song not found' });

      const exists = await SavedSong.findOne({ userId, songId });
      if (exists) return res.status(400).json({ error: 'Song already saved' });

      const saved = await SavedSong.create({
        userId,
        songId,
        title: song.title,
        artist: song.artist,
        audioSrc: song.audioSrc,
      });

      res.json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save song' });
    }
  },

  async getSavedSongs(req, res) {
    try {
      const { userId } = req.query;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
      }

      const savedSongs = await SavedSong.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).populate('songId');

      res.json(
        savedSongs.map((s) => ({
          id: s.id,
          title: s.songId.title,
          artist: s.songId.artist,
          audioSrc: s.songId.audioSrc,
        }))
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch saved songs' });
    }
  },

  async deleteSong(req, res) {
    try {
      const { id } = req.params;
      const deleted = await SavedSong.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: 'Saved song not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete saved song' });
    }
  },
};

export default savedSongsController;
