const competitionRepository = require('../repositories/competitionRepository');

const defaultOutcomeData = {
  goals: 0,
  wins: 0,
  draws: 0,
  losses: 0
};

async function getTeamsWithOutcomeData(isLiveRequest) {
  const fixtures = await competitionRepository.getFixtures();
  const teams = await competitionRepository.getTeams();

  const teamsWithOutcomeData = {};

  teams
    .sort((a, b) => (a.name < b.name) ? -1 : 1)
    .forEach(({ name, crestUrl, isEliminated }) => {
      teamsWithOutcomeData[name] = {
        flag: crestUrl,
        isEliminated,
        ...defaultOutcomeData
      }
    });

  fixtures
    .filter(fixture => isLiveRequest ? fixture.status === 'FINISHED' || fixture.status === 'IN_PLAY' : fixture.status === 'FINISHED')
    .forEach(fixture => {
      const homeGoals = fixture.score.fullTime.homeTeam;
      const awayGoals = fixture.score.fullTime.awayTeam;

      teamsWithOutcomeData[fixture.homeTeam.name].goals += homeGoals;
      teamsWithOutcomeData[fixture.awayTeam.name].goals += awayGoals;

      if (homeGoals > awayGoals) {
        teamsWithOutcomeData[fixture.homeTeam.name].wins++;
        teamsWithOutcomeData[fixture.awayTeam.name].losses++;
      } else if (awayGoals > homeGoals) {
        teamsWithOutcomeData[fixture.awayTeam.name].wins++;
        teamsWithOutcomeData[fixture.homeTeam.name].losses++;
      } else if (fixture.score.penalties.homeTeam) {
        const homePenaltyGoals = fixture.score.penalties.homeTeam;
        const awayPenaltyGoals = fixture.score.penalties.awayTeam;

        if (homePenaltyGoals > awayPenaltyGoals) {
          teamsWithOutcomeData[fixture.homeTeam.name].wins++;
          teamsWithOutcomeData[fixture.awayTeam.name].losses++;
        } else {
          teamsWithOutcomeData[fixture.awayTeam.name].wins++;
          teamsWithOutcomeData[fixture.homeTeam.name].losses++;
        }
      } else {
        teamsWithOutcomeData[fixture.homeTeam.name].draws++;
        teamsWithOutcomeData[fixture.awayTeam.name].draws++;
      }
    });

  return teamsWithOutcomeData;
};

module.exports = {
  getFixtures: competitionRepository.getFixtures,
  getTeamsWithOutcomeData
};