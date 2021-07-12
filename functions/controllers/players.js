const express = require('express')

const playerService = require('../services/playerService');

const router = express.Router();

router.get('/', async (request, response) => {
  const isLiveRequest = request.query.live;
  try {
    const players = await playerService.getPlayersWithPoints(isLiveRequest);
    response.json(players);
  } catch (error) {
    console.log(error);
    response.status(500).json(error.message).send();
    return;
  }
});

module.exports = router;