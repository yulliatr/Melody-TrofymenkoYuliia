import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = 'supersecret';

const generateUsername = (email) => (email ? email.split('@')[0] : 'Guest');

export default {
  async register(email, password) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username: generateUsername(email),
      password: hashedPassword,
      joined: new Date(),
      avatarUrl: null,
      stats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        longestStrike: 0,
        currentStrike: 0,
      },
    });

    return {
      id: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      joined: user.joined,
      avatarUrl: user.avatarUrl,
      stats: user.stats,
    };
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });

    return {
      accessToken: token,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        joined: user.joined,
        avatarUrl: user.avatarUrl,
        stats: user.stats,
      },
    };
  },
};
