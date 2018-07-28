const express = require('express')

const competitionService = require('../services/competitionService');

const router = express.Router();

router.get('/teams', async (request, response) => {
  const teams = await competitionService.getTeamsWithOutcomeData();

  response.json(teams);
});

router.get('/fixtures/today', async (request, response) => {
  const fixtures = await competitionService.getFixturesForToday();

  response.json(fixtures);
});

module.exports = router;