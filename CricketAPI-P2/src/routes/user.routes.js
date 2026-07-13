const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUser, validateUserUpdate, validateLogin, validateUserId } = require('../middlewares/validation');
const { authenticate } = require('../middlewares/auth');
const { loginRateLimiter } = require('../config/rate-limit');

// Public routes
router.post('/', validateUser, userController.registerUser);
router.post('/login', loginRateLimiter, validateLogin, userController.login);

// Protected routes
router.use(authenticate);

router.get('/', userController.getAllUsers);
router.get('/profile', userController.getProfile);
router.get('/:id', validateUserId, userController.getUserById);
router.put('/:id', validateUserId, validateUserUpdate, userController.updateUser);
router.patch('/:id', validateUserId, validateUserUpdate, userController.updateUser);
router.delete('/:id', validateUserId, userController.deleteUser);

module.exports = router;
