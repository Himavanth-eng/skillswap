
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

router.get('/', async (req, res) => {
  const recent = await Skill.find().populate('teacher').sort({ createdAt: -1 }).limit(6);
  res.render('index', { recent });
});

module.exports = router;