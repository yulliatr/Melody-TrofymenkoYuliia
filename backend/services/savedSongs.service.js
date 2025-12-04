const path = require('path');
const { readFile, writeFile } = require('../utils/file');
const { v4: uuidv4 } = require('uuid');
const songsService = require('./songs.service');
const BASE_URL = 'http://localhost:3000';

const SAVED_SONGS_PATH = path.join(__dirname, '..', 'db', 'savedsongs.json');

module.exports = {
  async getSongsByUserId(userId) {
    const savedRecords = await readFile(SAVED_SONGS_PATH);

    const allSongsPool = await songsService.getSongs();
    const songMap = allSongsPool.reduce((acc, song) => {
      acc[song.id] = song;
      return acc;
    }, {});

    const userSavedRecords = savedRecords.filter(
      (record) => String(record.userId) === String(userId)
    );

    return userSavedRecords.map((record) => {
      const fullSongData = songMap[record.songId];

      if (!fullSongData) {
        return {
          ...record,
          title: record.title + ' (Audio Unavailable)',
          audioSrc: null,
        };
      }

      return {
        ...fullSongData,
        audioSrc: BASE_URL + fullSongData.audioSrc,
        id: record.id,
        songId: fullSongData.id,
        userId: record.userId,
      };
    });
  },

  async saveSong(songData) {
    const songs = await readFile(SAVED_SONGS_PATH);
    const { userId, songId } = songData;

    const allSongsPool = await songsService.getSongs();
    const fullSongDetails = allSongsPool.find(
      (s) => String(s.id) === String(songId)
    );

    if (!fullSongDetails || !fullSongDetails.audioSrc) {
      throw new Error('Song data missing or audio source not found.');
    }

    const isDuplicate = songs.some(
      (song) =>
        String(song.userId) === String(userId) &&
        String(song.songId) === String(songId)
    );

    if (isDuplicate) {
      throw new Error('Song already saved by this user.');
    }

    const newSavedSong = {
      id: uuidv4(),
      userId: String(userId),
      songId: String(songId),
      title: fullSongDetails.title,
      artist: fullSongDetails.artist,
      audioSrc: fullSongDetails.audioSrc,
    };

    songs.push(newSavedSong);

    await writeFile(SAVED_SONGS_PATH, songs);

    return newSavedSong;
  },

  async deleteSong(id) {
    let songs = await readFile(SAVED_SONGS_PATH);

    const initialLength = songs.length;

    songs = songs.filter((song) => song.id !== id);

    if (songs.length === initialLength) {
      throw new Error('Song not found');
    }

    await writeFile(SAVED_SONGS_PATH, songs);
  },
};
