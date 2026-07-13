const jwt = require('jsonwebtoken');
const { AppError } = require('./error-handler');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 'No token provided, authorization denied', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Unauthorized', 'Token has expired', 401));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError('Unauthorized', 'Invalid token', 401));
    } else {
      next(error);
    }
  }
};

module.exports = { authenticate };
