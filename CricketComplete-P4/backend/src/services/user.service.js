const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit);
  
  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({
    ...userData,
    password: hashedPassword
  });
  const savedUser = await newUser.save();
  const userObj = savedUser.toObject();
  delete userObj.password;
  return userObj;
};

const updateUser = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if(!updatedUser) return null;
  const userObj = updatedUser.toObject();
  delete userObj.password;
  return userObj;
};

const deleteUser = async (id) => {
  const result = await User.findByIdAndDelete(id);
  return result !== null;
};

const loginUser = async (email, passwordText) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) return null;
  
  const isMatch = await bcrypt.compare(passwordText, user.password);
  if (!isMatch) return null;
  
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES || '24h' }
  );
  
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser };
