const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Skill = require('../models/Skill');
const User = require('../models/User');
const { refreshSession } = require('../utils/updateSession');
const { generateSkillPDF } = require('../utils/pdfGenerator');

// REQUEST A BOOKING
exports.requestBooking = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId).populate('teacher');
    if (!skill) return res.redirect('/skills');

    const studentId = req.session.user.id;
    const teacherId = skill.teacher._id;

    const student = await User.findById(studentId);

    // NOT ENOUGH CREDITS
    if (student.credits < 1) {
      const skills = await Skill.find().populate('teacher');
      return res.render('skills', {
        skills,
        error: "Not enough credits to book this session."
      });
    }

    const time = new Date(req.body.time);
    const duration = Number(req.body.duration) || 1;

    const booking = await Booking.create({
      skill: skill._id,
      student: studentId,
      teacher: teacherId,
      time,
      durationHours: duration
    });

    // DEDUCT CREDIT
    student.credits -= 1;
    await student.save();

    // REFRESH SESSION
    await refreshSession(req, User);

    await Notification.create({
      user: teacherId,
      text: `New booking request for "${skill.title}"`,
      url: `/bookings/${booking._id}`
    });

    res.redirect('/bookings');
  } catch (err) {
    console.log(err);
    res.redirect('/skills');
  }
};

// LIST BOOKINGS
exports.list = async (req, res) => {
  const userId = req.session.user.id;

  const asStudent = await Booking.find({ student: userId })
    .populate('skill teacher student');

  const asTeacher = await Booking.find({ teacher: userId })
    .populate('skill teacher student');

  res.render('bookings', { asStudent, asTeacher });
};

// ACCEPT BOOKING
exports.accept = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('student skill');
  if (!booking) return res.redirect('/bookings');

  booking.status = 'accepted';
  await booking.save();

  await Notification.create({
    user: booking.student._id,
    text: `Your booking for "${booking.skill.title}" was accepted`,
    url: `/bookings/${booking._id}`
  });

  res.redirect('/bookings');
};

// REJECT BOOKING
exports.reject = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('student');
  if (!booking) return res.redirect('/bookings');

  booking.status = 'rejected';
  await booking.save();

  await Notification.create({
    user: booking.student._id,
    text: "Your booking was rejected.",
    url: `/bookings/${booking._id}`
  });

  res.redirect('/bookings');
};
exports.view = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('skill teacher student');

  if (!booking) return res.redirect('/bookings');
  res.render('bookingDetails', { booking });
};

// COMPLETE BOOKING
exports.complete = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('teacher student skill');

  if (!booking) return res.redirect('/bookings');

  booking.status = 'completed';
  await booking.save();

  // Teacher gets credits
  booking.teacher.credits += booking.durationHours;
  await booking.teacher.save();

  // Refresh session if teacher
  if (req.session.user.id === booking.teacher._id.toString()) {
    await refreshSession(req, User);
  }

  // ⚡ Generate PDF for student
  const pdfUrl = await generateSkillPDF(booking.skill, booking.student, booking);

  // Notification
  await Notification.create({
    user: booking.student._id,
    text: `Your learning session is completed. Download your Skill Summary PDF.`,
    url: pdfUrl
  });

  res.redirect('/bookings');
};

// CANCEL BOOKING
exports.cancel = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('teacher');
  if (!booking) return res.redirect('/bookings');

  booking.status = 'cancelled';
  await booking.save();

  await Notification.create({
    user: booking.teacher._id,
    text: "A booking was cancelled.",
    url: `/bookings/${booking._id}`
  });

  res.redirect('/bookings');
};

