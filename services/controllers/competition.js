const express = require('express')

const competitionService = require('../services/competitionService');

const router = express.Router();

router.get('/teams', async (request, response) => {
  const isLiveRequest = request.query.live;
  const teams = await competitionService.getTeamsWithOutcomeData(isLiveRequest);

  response.json(teams);
});

router.get('/fixtures/today', async (request, response) => {
  const fixtures = await competitionService.getFixturesForToday();

  response.json(fixtures);
});

module.exports = router;