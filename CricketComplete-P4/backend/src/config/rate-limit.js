const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

module.exports = { loginRateLimiter, apiRateLimiter };
