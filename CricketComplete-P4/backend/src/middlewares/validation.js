const { body, param, validationResult } = require('express-validator');
const { AppError } = require('./error-handler');
const mongoose = require('mongoose');

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
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('age').optional().isInt({ min: 18 }).withMessage('Age must be at least 18'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().trim().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('age').optional().isInt({ min: 18 }).withMessage('Age must be at least 18'),
  handleValidationErrors
];

const validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateMongoId = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  }),
  handleValidationErrors
];

const validatePlayer = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').notEmpty().withMessage('Age is required')
    .isInt({ min: 18, max: 50 }).withMessage('Age must be between 18 and 50'),
  body('role').notEmpty().withMessage('Role is required')
    .isIn(['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']).withMessage('Invalid role'),
  body('team').trim().notEmpty().withMessage('Team is required'),
  handleValidationErrors
];

const validatePlayerUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('age').optional().isInt({ min: 18, max: 50 }).withMessage('Age must be between 18 and 50'),
  body('role').optional().isIn(['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']).withMessage('Invalid role'),
  body('team').optional().trim().notEmpty().withMessage('Team cannot be empty'),
  handleValidationErrors
];

module.exports = { validateUser, validateUserUpdate, validateLogin, validateMongoId, validatePlayer, validatePlayerUpdate };
