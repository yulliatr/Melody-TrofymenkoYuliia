import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define MONGO_URI in your .env file');
}

const USERS_PATH = path.join(process.cwd(), 'backend/db/users.json');
const SONGS_PATH = path.join(process.cwd(), 'backend/db/songs.json');
const SAVED_SONGS_PATH = path.join(process.cwd(), 'backend/db/savedsongs.json');

const userSchema = new mongoose.Schema({
  id: Number,
  email: String,
  username: String,
  password: String,
  joined: String,
  avatarUrl: String,
  stats: {
    gamesPlayed: Number,
    correctAnswers: Number,
    longestStrike: Number,
    currentStrike: Number,
  },
});

const songSchema = new mongoose.Schema({
  id: Number,
  title: String,
  artist: String,
  mood: String,
  audioSrc: String,
});

const savedSongSchema = new mongoose.Schema({
  id: String,
  userId: Number,
  songId: Number,
  title: String,
  artist: String,
  audioSrc: String,
});

const User = mongoose.model('User', userSchema);
const Song = mongoose.model('Song', songSchema);
const SavedSong = mongoose.model('SavedSong', savedSongSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Song.deleteMany({});
    await SavedSong.deleteMany({});

    const usersData = JSON.parse(await fs.readFile(USERS_PATH, 'utf-8'));
    await User.insertMany(usersData);
    console.log(`Migrated ${usersData.length} users`);

    const songsData = JSON.parse(await fs.readFile(SONGS_PATH, 'utf-8'));
    await Song.insertMany(songsData);
    console.log(`Migrated ${songsData.length} songs`);

    const savedSongsData = JSON.parse(
      await fs.readFile(SAVED_SONGS_PATH, 'utf-8')
    );
    const savedSongsToInsert = savedSongsData.map((s) => ({
      ...s,
      userId: Number(s.userId),
      songId: Number(s.songId),
    }));
    await SavedSong.insertMany(savedSongsToInsert);
    console.log(`Migrated ${savedSongsData.length} saved songs`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
