const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');



// POST /api/v1/user/signup
exports.signup = asyncHandler(async (req, res) => {
  
    const { username, email, password } = req.body || {};

   

      const existing = await User.findOne({ $or: [{ email }, { username }] });
  
      if (existing) {
    throw new AppError('Username or email already exists', 409);
  
    }

   const user = await User.create({ username, email, password });
  logger.info('User registered', { userId: user._id.toString(), ip: req.ip });

  res.status(201).json({ message: 'User created successfully.', user_id: user._id });
});


// POST /api/v1/user/login
exports.login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const query = email ? { email } : { username };

  const user = await User.findOne(query).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    logger.warn('Login failed', { identifier: email || username, ip: req.ip });
    throw new AppError('Invalid Username and password', 401);
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  logger.info('Login succeeded', { userId: user._id.toString(), ip: req.ip });
  res.status(200).json({ message: 'Login successful.', jwt_token: token });
});