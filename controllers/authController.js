const bcrypt = require('bcrypt');
const User = require('../models/User');

// SHOW REGISTER
exports.showRegister = (req, res) => {
  res.render('register');
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.render('register', { error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    // New user starts with 1 credit
    const user = await User.create({
      name,
      email,
      password: hash,
      credits: 1
    });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      credits: user.credits   // ← IMPORTANT
    };

    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.render('register', { error: "Server error" });
  }
};

// SHOW LOGIN
exports.showLogin = (req, res) => {
  res.render('login');
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.render('login', { error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('login', { error: "Invalid credentials" });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      credits: user.credits  // ← IMPORTANT
    };

    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.render('login', { error: "Server error" });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
