const express = require('express')

const playerService = require('../services/playerService');

const router = express.Router();

router.get('/', async (request, response) => {
  const players = await playerService.getPlayersWithPoints();

  response.json(players);
});

module.exports = router;