const userService = require('../services/user.service');
const { AppError } = require('../middlewares/error-handler');

const registerUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    if (error.code === 11000) {
      next(new AppError('Conflict', 'Email already exists', 409));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    if (!result) throw new AppError('Unauthorized', 'Invalid email or password', 401);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await userService.getAllUsers(page, limit);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) throw new AppError('Not Found', 'User not found', 404);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) throw new AppError('Not Found', 'User not found', 404);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await userService.updateUser(id, req.body);
    if (!updatedUser) throw new AppError('Not Found', 'User not found', 404);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      next(new AppError('Conflict', 'Email already exists', 409));
    } else {
      next(error);
    }
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (!success) throw new AppError('Not Found', 'User not found', 404);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, login, getAllUsers, getProfile, getUserById, updateUser, deleteUser };
