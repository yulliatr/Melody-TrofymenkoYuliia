import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  mood: String,
  audioSrc: String,
});

songSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

songSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Song', songSchema);
