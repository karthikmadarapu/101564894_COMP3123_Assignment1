const { body } = require('express-validator');

exports.signupRules = [
  body('username')
    .isString().withMessage('Username must be a string').bail()
    .trim()
    .notEmpty().withMessage('Username is required').bail()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),

  body('email')
    .isString().withMessage('Email must be a string').bail()
    .trim()
    .notEmpty().withMessage('Email is required').bail()
    .isEmail().withMessage('Invalid email format')
    .toLowerCase(),

  body('password')
    .isString().withMessage('Password must be a string').bail()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
    .matches(/\d/).withMessage('Password must contain a number'),
];

exports.loginRules = [
  body('email')
    .optional()
    .isString().withMessage('Email must be a string').bail()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .toLowerCase(),

  body('username')
    .optional()
    .isString().withMessage('Username must be a string').bail()
    .trim(),

  body('password')
    .isString().withMessage('Password is required').bail()
    .notEmpty().withMessage('Password is required'),

  body().custom((value) => {
    if (!value?.email && !value?.username) {
      throw new Error('Email or username is required');
    }
    return true;
  }),
];