const playerService = require('../services/player.service');
const { AppError } = require('../middlewares/error-handler');

const getAllPlayers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = { ...req.query };
    
    // Remove pagination from query for filters
    delete query.page;
    delete query.limit;

    const result = await playerService.getAllPlayers(query, page, limit);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

const createPlayer = async (req, res, next) => {
  try {
    const newPlayer = await playerService.createPlayer(req.body);
    res.status(201).json({ success: true, data: newPlayer });
  } catch (error) {
    next(error);
  }
};

const getPlayerById = async (req, res, next) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    if (!player) throw new AppError('Not Found', 'Player not found', 404);
    res.status(200).json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

const updatePlayer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedPlayer = await playerService.updatePlayer(id, req.body);
    if (!updatedPlayer) throw new AppError('Not Found', 'Player not found', 404);
    res.status(200).json({ success: true, data: updatedPlayer });
  } catch (error) {
    next(error);
  }
};

const deletePlayer = async (req, res, next) => {
  try {
    const success = await playerService.deletePlayer(req.params.id);
    if (!success) throw new AppError('Not Found', 'Player not found', 404);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPlayers, createPlayer, getPlayerById, updatePlayer, deletePlayer };
