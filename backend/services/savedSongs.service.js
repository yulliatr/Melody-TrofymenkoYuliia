import SavedSong from '../models/SavedSong.js';
import Song from '../models/Song.js';
import mongoose from 'mongoose';

const BASE_URL = 'http://localhost:3000';

export default {
  async getSongsByUserId(userId) {
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const savedRecords = await SavedSong.find({ userId: userIdObj }).populate(
      'songId'
    );

    return savedRecords.map((record) => ({
      id: record.id,
      userId: record.userId,
      songId: record.songId.id,
      title: record.songId.title,
      artist: record.songId.artist,
      audioSrc: BASE_URL + record.songId.audioSrc,
    }));
  },

  async saveSong(userId, songId) {
    const songIdObj = new mongoose.Types.ObjectId(songId);
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const song = await Song.findById(songIdObj);
    if (!song) throw new Error('Song not found');

    const exists = await SavedSong.findOne({
      userId: userIdObj,
      songId: songIdObj,
    });
    if (exists) throw new Error('Song already saved');

    const saved = await SavedSong.create({
      userId: userIdObj,
      songId: songIdObj,
      title: song.title,
      artist: song.artist,
      audioSrc: song.audioSrc,
    });

    return saved;
  },

  async deleteSong(savedSongId) {
    const savedSongIdObj = new mongoose.Types.ObjectId(savedSongId);

    const deleted = await SavedSong.findByIdAndDelete(savedSongIdObj);
    if (!deleted) throw new Error('Saved song not found');
  },
};
