const express = require('express');
const path = require('path');
const boolParser = require('express-query-boolean');

const competitionService = require('./services/competitionService');
const dbService = require('./services/dbService');
const playerService = require('./services/playerService');

const server = express();

server.set('port', (process.env.PORT || 5000));
server.use(boolParser());
server.use(express.static(path.join(__dirname, 'build')));

server.get('/api/players', async (request, response) => {
    const isLiveRequest = request.query.live;
    const playerData = await playerService.getAllPlayerData(isLiveRequest);
    response.json(playerData);
});

server.get('/api/competition', async (request, response) => {
    const isLiveRequest = request.query.live;
    const competitionData = await competitionService.getCompetitionData(isLiveRequest);
    response.json(competitionData);
});

// server.get('/api/competition/teams', async (request, response) => {
//     const teamNames = await competitionService.getTeamNames();
//     response.json(teamNames);
// });

// server.get('/api/generate-players', async (request, response) => {
//   const generatedCompetitionData = await playerService.generateTestPlayers();
//   response.json(generatedCompetitionData);
// });

server.get('/ping', (request, response) => {
    response.send('pong');
});

server.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '/build/index.html'));
});

async function start() {
    await dbService.test();
    server.listen(server.get('port'), () => {
        console.log(`Server listening on port ${server.get('port')}`);
    });
};

start();
