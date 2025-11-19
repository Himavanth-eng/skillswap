
const Skill = require('../models/Skill');
const User = require('../models/User');

exports.list = async (req, res) => {
  const skills = await Skill.find().populate('teacher').sort({ createdAt: -1 }).limit(50);
  res.render('skills', { skills });
};

exports.showAdd = (req, res) => {
  res.render('addSkill');
};

exports.create = async (req, res) => {
  try {
    const { title, description, category, hourlyRate } = req.body;
    let image = '';
    if (req.file) image = '/uploads/' + req.file.filename;
    const teacherId = req.session.user.id;
    const skill = await Skill.create({ title, description, category, hourlyRate: hourlyRate || 1, teacher: teacherId, image });
    res.redirect('/skills/' + skill._id);
  } catch (err) {
    console.error(err);
    res.render('addSkill', { error: 'Error creating skill' });
  }
};

exports.details = async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate('teacher');
  if (!skill) return res.redirect('/skills');
  res.render('skillDetails', { skill });
};