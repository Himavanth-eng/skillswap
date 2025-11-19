
const Message = require('../models/Message');
const Booking = require('../models/Booking');

exports.viewChat = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate('skill student teacher');
  if (!booking) return res.redirect('/bookings');
  const messages = await Message.find({ booking: booking._id }).populate('from to').sort({ createdAt: 1 });
  res.render('chat', { booking, messages });
};

exports.sendMessage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.redirect('/bookings');
    const from = req.session.user.id;
    const to = (from == booking.student.toString()) ? booking.teacher : booking.student;
    const text = req.body.text;
    await Message.create({ booking: booking._id, from, to, text });
    res.redirect('/chat/' + booking._id);
  } catch (err) {
    console.error(err);
    res.redirect('/bookings');
  }
};