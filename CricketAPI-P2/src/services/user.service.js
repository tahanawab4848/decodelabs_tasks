const { users } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let currentId = 3;

const getAllUsers = (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  const sanitizedUsers = paginatedUsers.map(({ password, ...user }) => user);
  
  return {
    data: sanitizedUsers,
    pagination: {
      total: users.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(users.length / limit)
    }
  };
};

const getUserById = (id) => {
  const user = users.find(u => u.id === Number(id));
  if (!user) return null;
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const getUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  currentId++;
  const newUser = {
    id: currentId,
    name: userData.name,
    email: userData.email,
    password: hashedPassword
  };
  users.push(newUser);
  const { password, ...sanitizedUser } = newUser;
  return sanitizedUser;
};

const updateUser = async (id, updateData) => {
  const userIndex = users.findIndex(u => u.id === Number(id));
  if (userIndex === -1) return null;

  const existingUser = users[userIndex];
  const updatedUser = {
    ...existingUser,
    name: updateData.name || existingUser.name,
    email: updateData.email || existingUser.email
  };
  
  if (updateData.password) {
    updatedUser.password = await bcrypt.hash(updateData.password, 10);
  }

  users[userIndex] = updatedUser;
  const { password, ...sanitizedUser } = updatedUser;
  return sanitizedUser;
};

const deleteUser = (id) => {
  const userIndex = users.findIndex(u => u.id === Number(id));
  if (userIndex === -1) return false;
  users.splice(userIndex, 1);
  return true;
};

const loginUser = async (email, passwordText) => {
  const user = getUserByEmail(email);
  if (!user) return null;
  const isMatch = await bcrypt.compare(passwordText, user.password);
  if (!isMatch) return null;
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES || '1d' }
  );
  
  const { password, ...sanitizedUser } = user;
  return { user: sanitizedUser, token };
};

module.exports = { getAllUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser, loginUser };
