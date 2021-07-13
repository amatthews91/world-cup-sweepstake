const express = require('express')

const playerService = require('../services/playerService');

const router = express.Router();

router.get('/', async (_, response) => {
  try {
    const players = await playerService.getPlayers();
    response.json(players);
  } catch (error) {
    console.log(error);
    response.status(500).json(error.message).send();
    return;
  }
});

module.exports = router;