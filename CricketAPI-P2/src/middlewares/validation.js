const { body, param, validationResult } = require('express-validator');
const { AppError } = require('./error-handler');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({ field: err.path, message: err.msg }));
    return next(new AppError('Bad Request', 'Validation failed', 400, errorDetails));
  }
  next();
};

const validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces'),
  body('email').optional().trim().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'),
  handleValidationErrors
];

const validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateUserId = [
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  handleValidationErrors
];

module.exports = { validateUser, validateUserUpdate, validateLogin, validateUserId };
