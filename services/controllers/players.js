const express = require('express')

const playerService = require('../services/playerService');

const router = express.Router();

router.get('/', async (request, response) => {
  const isLiveRequest = request.query.live;
  const players = await playerService.getPlayersWithPoints(isLiveRequest);

  response.json(players);
});

module.exports = router;