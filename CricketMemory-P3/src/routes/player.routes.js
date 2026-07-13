const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { validatePlayer, validatePlayerUpdate, validateMongoId } = require('../middlewares/validation');
const { authenticate } = require('../middlewares/auth');

// Protected routes
router.use(authenticate);

router.get('/', playerController.getAllPlayers);
router.get('/search', playerController.getAllPlayers); // Maps to the same controller handling query params
router.post('/', validatePlayer, playerController.createPlayer);
router.get('/:id', validateMongoId, playerController.getPlayerById);
router.put('/:id', validateMongoId, validatePlayerUpdate, playerController.updatePlayer);
router.delete('/:id', validateMongoId, playerController.deletePlayer);

module.exports = router;
