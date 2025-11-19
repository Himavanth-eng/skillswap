
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, required: true },
  durationHours: { type: Number, default: 1 },
  status: { type: String, enum: ['requested','accepted','rejected','completed','cancelled'], default: 'requested' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);