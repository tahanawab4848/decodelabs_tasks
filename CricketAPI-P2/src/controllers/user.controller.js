const userService = require('../services/user.service');
const { AppError } = require('../middlewares/error-handler');

const registerUser = async (req, res, next) => {
  try {
    if (userService.getUserByEmail(req.body.email)) {
      throw new AppError('Conflict', 'Email already exists', 409);
    }
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
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

const getAllUsers = (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = userService.getAllUsers(page, limit);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

const getProfile = (req, res, next) => {
  try {
    const user = userService.getUserById(req.user.id);
    if (!user) throw new AppError('Not Found', 'User not found', 404);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getUserById = (req, res, next) => {
  try {
    const user = userService.getUserById(req.params.id);
    if (!user) throw new AppError('Not Found', 'User not found', 404);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = userService.getUserById(id);
    if (!user) throw new AppError('Not Found', 'User not found', 404);
    
    if (req.body.email && req.body.email !== user.email) {
      if (userService.getUserByEmail(req.body.email)) {
        throw new AppError('Conflict', 'Email already exists', 409);
      }
    }
    
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    if (!userService.deleteUser(req.params.id)) {
      throw new AppError('Not Found', 'User not found', 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, login, getAllUsers, getProfile, getUserById, updateUser, deleteUser };
