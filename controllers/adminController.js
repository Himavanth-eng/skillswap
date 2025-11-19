
const User = require('../models/User');
const Skill = require('../models/Skill');
const Booking = require('../models/Booking');

exports.dashboard = async (req, res) => {
  const users = await User.find().limit(200);
  const skills = await Skill.find().limit(200).populate('teacher');
  const bookings = await Booking.find().limit(200).populate('skill teacher student');
  res.render('admin', { users, skills, bookings });
};