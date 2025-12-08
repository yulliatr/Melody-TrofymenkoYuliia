import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { connectDB } from './db/mongo.js';

import authRoutes from './routes/auth.routes.js';
import songRoutes from './routes/songs.routes.js';
import savedSongsRoutes from './routes/savedSongs.routes.js';
import userRoutes from './routes/user.routes.js';
import quizRoutes from './routes/quiz.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/saved_songs', savedSongsRoutes);
app.use('/users', userRoutes);
app.use('/quiz', quizRoutes);

const SONGS_PATH = path.join(__dirname, 'db', 'songs.json');

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

app.get('/quiz/generate', (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync(SONGS_PATH, 'utf-8'));

    if (songs.length < 4) {
      return res.status(500).json({ error: 'Not enough songs for quiz' });
    }

    const shuffled = shuffleArray([...songs]);
    const correctSong = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);

    let options = [
      {
        id: 1,
        title: correctSong.title,
        artist: correctSong.artist,
        audioSrc: correctSong.audioSrc,
        isCorrect: true,
      },
      {
        id: 2,
        title: wrongOptions[0].title,
        artist: wrongOptions[0].artist,
        audioSrc: wrongOptions[0].audioSrc,
      },
      {
        id: 3,
        title: wrongOptions[1].title,
        artist: wrongOptions[1].artist,
        audioSrc: wrongOptions[1].audioSrc,
      },
      {
        id: 4,
        title: wrongOptions[2].title,
        artist: wrongOptions[2].artist,
        audioSrc: wrongOptions[2].audioSrc,
      },
    ];

    options = shuffleArray(options);
    const correctAnswerId = options.find((opt) => opt.isCorrect).id;

    res.json({ options, correctAnswerId, correctSong });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
