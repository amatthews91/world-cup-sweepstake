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

module.exports = {
    getAllPlayerData
};
