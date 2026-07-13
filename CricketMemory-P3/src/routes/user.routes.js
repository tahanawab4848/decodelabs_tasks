const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUser, validateUserUpdate, validateLogin, validateMongoId } = require('../middlewares/validation');
const { authenticate } = require('../middlewares/auth');
const { loginRateLimiter } = require('../config/rate-limit');

// Public routes
router.post('/', validateUser, userController.registerUser);
router.post('/login', loginRateLimiter, validateLogin, userController.login);

// Protected routes
router.use(authenticate);

router.get('/', userController.getAllUsers);
router.get('/profile', userController.getProfile);
router.get('/:id', validateMongoId, userController.getUserById);
router.put('/:id', validateMongoId, validateUserUpdate, userController.updateUser);
router.patch('/:id', validateMongoId, validateUserUpdate, userController.updateUser);
router.delete('/:id', validateMongoId, userController.deleteUser);

module.exports = router;
