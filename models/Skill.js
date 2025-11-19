
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hourlyRate: { type: Number, default: 1 },
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', skillSchema);