const express = require('express');

const competitionService = require('./competitionService');
const dbService = require('./dbService');
const playerService = require('./playerService');

const server = express();

server.set('port', (process.env.PORT || 5000));

server.get('/api/players', async (request, response) => {
    const playerData = await playerService.getAllPlayerData();
    response.send(playerData);
});

server.get('/api/teams', async (request, response) => {
    const competitionData = await competitionService.getCompetitionData();
    response.send(competitionData);
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
