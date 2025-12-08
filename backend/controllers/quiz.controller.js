import Song from '../models/Song.js';
import User from '../models/User.js';

const quizController = {
  async generateQuiz(req, res) {
    try {
      const allSongs = await Song.find();
      if (allSongs.length < 4)
        return res.status(500).json({ error: 'Not enough songs' });

      const shuffled = allSongs.sort(() => Math.random() - 0.5);
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

      options = options.sort(() => Math.random() - 0.5);
      const correctAnswerId = options.find((o) => o.isCorrect).id;

      res.json({ options, correctAnswerId, correctSong });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  },

  async submitAnswer(req, res) {
    try {
      const { userId, isCorrect } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

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

      await user.save();

      const { password, ...safeUser } = user.toObject();

      res.json({
        currentStreak: safeUser.stats.currentStrike,
        correctAnswers: safeUser.stats.correctAnswers,
        longestStrike: safeUser.stats.longestStrike,
        user: safeUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit answer' });
    }
  },
};

export default quizController;
