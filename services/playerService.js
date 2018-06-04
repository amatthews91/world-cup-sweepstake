const dbService = require('./dbService');
const competitionService = require('./competitionService');

const getPointsForPlayer = (player, competitionData) => {
    let points = 0;
    player.teams.goals.forEach(team => {
        points += competitionData[team].goals;
    });
    player.teams.outcomes.forEach(team => {
        points += (competitionData[team].draws + (competitionData[team].wins * 3));
    });

    return points;
};

async function getAllPlayerData() {
    const playerData = await dbService.getPlayers();
    const competitionData = await competitionService.getCompetitionData();

    const playersWithPoints = playerData.map(player =>  {
        const points = getPointsForPlayer(player, competitionData);
        return {
            ...player,
            points
        };
    });

    return playersWithPoints;
};

async function generateTestPlayers() {
  const teamNames = await competitionService.getTeamNames();

  const players = [];
  for (let i = 0; i < 20; i++) {
    const randoms = [];
    while (randoms.length < 5) {
      const nextRandom = getRandomInt(teamNames.length);
      if (randoms.indexOf(nextRandom) === -1) randoms.push(nextRandom);
    }

    players.push({
      name: 'Player ' + i,
      teams: {
        goals: [ teamNames[randoms[0]], teamNames[randoms[1]] ],
        outcomes: [ teamNames[randoms[2]], teamNames[randoms[3]], teamNames[randoms[4]] ]
      }
    });
  }

  const competitionData = await competitionService.getCompetitionData();

  const playersWithPoints = players.map(player =>  {
    const points = getPointsForPlayer(player, competitionData);
    return {
        ...player,
        points
    };
  });

  return playersWithPoints;

};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

module.exports = {
    getAllPlayerData,
    generateTestPlayers
};
