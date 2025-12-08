import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  gamesPlayed: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  longestStrike: { type: Number, default: 0 },
  currentStrike: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  joined: { type: Date, default: Date.now },
  avatarUrl: { type: String, default: '/src/assets/images/avatar.png' },
  stats: { type: statsSchema, default: () => ({}) },
});

export default mongoose.model('User', userSchema);
