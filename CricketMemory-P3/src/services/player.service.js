const Player = require('../models/player.model');

const getAllPlayers = async (query = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // Create search filters based on query
  const filters = {};
  if (query.team) filters.team = new RegExp(query.team, 'i'); // Case-insensitive
  if (query.role) filters.role = query.role;
  if (query.isActive !== undefined) filters.isActive = query.isActive;

  const total = await Player.countDocuments(filters);
  const players = await Player.find(filters).populate('coach', 'name email').skip(skip).limit(limit);
  
  return {
    data: players,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getPlayerById = async (id) => {
  return await Player.findById(id).populate('coach', 'name email');
};

const createPlayer = async (playerData) => {
  const newPlayer = new Player(playerData);
  return await newPlayer.save();
};

const updatePlayer = async (id, updateData) => {
  return await Player.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deletePlayer = async (id) => {
  const result = await Player.findByIdAndDelete(id);
  return result !== null;
};

module.exports = { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer };
