const express = require('express')

const competitionService = require('../services/competitionService');

const router = express.Router();

router.get('/teams', async (_, response) => {
  try {
    const teams = await competitionService.getTeamsWithOutcomeData();
    response.json(teams);
  } catch (error) {
    console.log(error);
    response.status(500).json(error.message).send();
    return;
  }
});

router.get('/fixtures', async (_, response) => {
  try {
    const fixtures = await competitionService.getFixtures();
    response.json(fixtures);
  } catch (error) {
    console.log(error);
    response.status(500).json(error.message).send();
    return;
  }
});

module.exports = router;