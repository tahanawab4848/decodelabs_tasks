// Simple in-memory rate limiter
const rateLimit = new Map();

const loginRateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { attempts: 1, resetTime: now + windowMs });
    return next();
  }

  const limitData = rateLimit.get(ip);

  if (now > limitData.resetTime) {
    limitData.attempts = 1;
    limitData.resetTime = now + windowMs;
    return next();
  }

  limitData.attempts++;

  if (limitData.attempts > maxAttempts) {
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Too many login attempts, please try again later.'
    });
  }

  next();
};

module.exports = { loginRateLimiter };
