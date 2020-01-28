const express = require('express')

const playerService = require('../services/playerService');

const router = express.Router();

router.get('/', async (request, response, next) => {
  const isLiveRequest = request.query.live;
  try {
    const players = await playerService.getPlayersWithPoints(isLiveRequest);
    response.json(players);
  } catch (error) {
    next(error);
  }
});

module.exports = router;