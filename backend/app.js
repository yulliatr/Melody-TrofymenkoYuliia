require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const songRoutes = require('./routes/songs.routes');
const savedSongsRoutes = require('./routes/savedSongs.routes');
const userRoutes = require('./routes/user.routes');
const quizRoutes = require('./routes/quiz.routes');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/saved_songs', savedSongsRoutes);
app.use('/users', userRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/quiz', quizRoutes);

const SONGS_PATH = path.join(__dirname, 'db', 'songs.json');

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

app.get('/quiz/generate', (req, res) => {
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
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
