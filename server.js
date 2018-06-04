const express = require('express');
const path = require('path');

const competitionService = require('./services/competitionService');
const dbService = require('./services/dbService');
const playerService = require('./services/playerService');

const server = express();

server.set('port', (process.env.PORT || 5000));

server.use('/app', express.static(path.join(__dirname, 'build')));
server.use('/static', express.static(path.join(__dirname, 'build/static')));

server.get('/api/players', async (request, response) => {
    const playerData = await playerService.getAllPlayerData();
    response.json(playerData);
});

server.get('/api/competition/teams', async (request, response) => {
    const competitionData = await competitionService.getCompetitionData();
    response.json(competitionData);
});

server.get('/api/competition/teams/names', async (request, response) => {
    const teamNames = await competitionService.getTeamNames();
    response.json(teamNames);
});
});

server.get('/api/generate-competition', async (request, response) => {
  const generatedCompetitionData = await playerService.generateTestPlayers();
  response.json(generatedCompetitionData);
});

server.get('/ping', (request, response) => {
    response.send('pong');
});

async function start() {
    await dbService.test();
    server.listen(server.get('port'), () => {
        console.log(`Server listening on port ${server.get('port')}`);
    });
};

start();
