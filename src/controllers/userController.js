const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// POST /api/v1/user/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (![username, email, password].every(isNonEmptyString)) {
      return res.status(400).json({
        status: false,
        message: 'username, email and password are required',
      });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ status: false, message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }],
    });
    if (existing) {
      return res.status(409).json({
        status: false,
        message: 'Username or email already exists',
      });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: 'User created successfully.',
      user_id: user._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Race condition: unique index caught a duplicate
      return res.status(409).json({
        status: false,
        message: 'Username or email already exists',
      });
    }
    console.error('Signup error:', err);
    return res.status(500).json({ status: false, message: 'Server error' });
  }
};

// POST /api/v1/user/login
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const hasIdentifier = isNonEmptyString(email) || isNonEmptyString(username);
    if (!hasIdentifier || !isNonEmptyString(password)) {
      return res.status(400).json({
        status: false,
        message: 'Email or username, and password are required',
      });
    }

    const query = isNonEmptyString(email)
      ? { email: email.toLowerCase().trim() }
      : { username: username.trim() };

    const user = await User.findOne(query).select('+password');

    // Same response whether the user is missing or the password is wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: false,
        message: 'Invalid Username and password',
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      jwt_token: token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ status: false, message: 'Server error' });
  }
};