const competitionRepository = require('../repositories/competitionRepository');

const defaultOutcomeData = {
  goals: 0,
  wins: 0,
  draws: 0,
  losses: 0
};

async function getTeamsWithOutcomeData() {
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
    .forEach(fixture => {
      const homeGoals = fixture.score.fullTime.homeTeam;
      const awayGoals = fixture.score.fullTime.awayTeam;

      // Full time score includes penalty shootout.
      // Shootout goals do not count towards total.
      if (fixture.score.duration === 'PENALTY_SHOOTOUT') {
        teamsWithOutcomeData[fixture.homeTeam.name].goals += (homeGoals - fixture.score.penalties.homeTeam);
        teamsWithOutcomeData[fixture.awayTeam.name].goals += (awayGoals - fixture.score.penalties.awayTeam);
      } else {
        teamsWithOutcomeData[fixture.homeTeam.name].goals += homeGoals;
        teamsWithOutcomeData[fixture.awayTeam.name].goals += awayGoals;
      }

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