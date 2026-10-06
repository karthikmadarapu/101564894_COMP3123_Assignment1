const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Turn known library errors into clean AppErrors
const normalize = (err) => {
  if (err instanceof AppError) return err;
  if (err.type === 'entity.parse.failed')
    return new AppError('Malformed JSON in request body', 400);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return new AppError(`${field} already exists`, 409);
  }
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return new AppError('Validation failed', 400, details);
  }
  if (err.name === 'CastError') return new AppError(`Invalid ${err.path}`, 400);
  if (err.name === 'TokenExpiredError') return new AppError('Token expired', 401);
  if (err.name === 'JsonWebTokenError') return new AppError('Invalid token', 401);
  return new AppError('Server error', 500); // unknown = bug, hide details
};

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const appErr = normalize(err);
  const context = {
    method: req.method,
    path: req.originalUrl,
    status: appErr.statusCode,
    ip: req.ip,
  };

  if (appErr.statusCode >= 500) {
    logger.error(err.message, { ...context, stack: err.stack });
  } else {
    logger.warn(appErr.message, context);
  }

  const body = { status: false, message: appErr.message };
  if (appErr.details) body.errors = appErr.details;
  if (process.env.NODE_ENV === 'development') body.stack = err.stack;

  res.status(appErr.statusCode).json(body);
};