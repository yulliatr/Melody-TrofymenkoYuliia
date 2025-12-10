import mongoose from 'mongoose';

const savedSongSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },

  title: String,
  artist: String,
  audioSrc: String,
});

savedSongSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

savedSongSchema.set('toJSON', { virtuals: true });

export default mongoose.model('SavedSong', savedSongSchema);
