const fs = require('fs');
const path = require('path');
const USERS_PATH = path.join(__dirname, '..', 'db', 'users.json');
const SONGS_PATH = path.join(__dirname, '..', 'db', 'songs.json');

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

exports.generateQuiz = (req, res) => {
  const songs = JSON.parse(fs.readFileSync(SONGS_PATH, 'utf-8'));
  if (songs.length < 4)
    return res.status(500).json({ error: 'Not enough songs' });

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
};

exports.submitAnswer = (req, res) => {
  const { userId, selectedId, correctId, isCorrect } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ error: 'User not found' });

  const user = users[userIndex];
  user.stats = user.stats || {
    gamesPlayed: 0,
    correctAnswers: 0,
    longestStrike: 0,
    currentStrike: 0,
  };

  user.stats.gamesPlayed += 1;
  if (isCorrect) {
    user.stats.correctAnswers += 1;
    user.stats.currentStrike += 1;
    if (user.stats.currentStrike > user.stats.longestStrike) {
      user.stats.longestStrike = user.stats.currentStrike;
    }
  } else {
    user.stats.currentStrike = 0;
  }

  users[userIndex] = user;
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

  res.json({
    currentStreak: user.stats.currentStrike,
    correctAnswers: user.stats.correctAnswers,
    longestStrike: user.stats.longestStrike,
    user,
  });
};
