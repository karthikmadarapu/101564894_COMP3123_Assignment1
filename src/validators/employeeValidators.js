const {body, param , query} = require('express-validator');

const eidParam = param('eid').isMongoId().withMessage('Invalid employee id');
const eidQuery = query('eid').isMongoId().withMessage('Invalid employee id');

const createRules = [
  body('first_name').trim().notEmpty().withMessage('first_name is required'),
  body('last_name').trim().notEmpty().withMessage('last_name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('position').trim().notEmpty().withMessage('position is required'),
  body('salary').isFloat({ gt: 0 }).withMessage('salary must be a positive number').toFloat(),
  body('date_of_joining').isISO8601().withMessage('date_of_joining must be a valid date (YYYY-MM-DD)').toDate(),
  body('department').trim().notEmpty().withMessage('department is required'),
];

// Same rules, but every field is optional for updates
const updateRules = [
  eidParam,
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('position').optional().trim().notEmpty(),
  body('salary').optional().isFloat({ gt: 0 }).toFloat(),
  body('date_of_joining').optional().isISO8601().toDate(),
  body('department').optional().trim().notEmpty(),
];

module.exports = { createRules, updateRules, eidParam, eidQuery };