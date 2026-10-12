const rateLimit = require('express-rate-limit');

// General limiter for the whole API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  limit: 100,                 // 100 requests per IP per window
  standardHeaders: 'draft-8', // sends the RateLimit header to clients
  legacyHeaders: false,       // turns off the old X-RateLimit-* headers
  message: {
    status: false,
    message: 'Too many requests, please try again in 15 minutes.'
  }
});

// Strict limiter for login and signup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  limit: 5,                   // only 5 attempts per IP per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Too many login/signup attempts, please try again in 15 minutes.'
  }
});

module.exports = { apiLimiter, authLimiter };