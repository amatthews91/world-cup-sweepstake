const moment = require('moment');

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

  teams.sort((a, b) => {
    return (a.name < b.name) ? -1 : 1;
  })
  .forEach(team => {
    teamsWithOutcomeData[team.name] = {
      flag: team.crestUrl,
      ...defaultOutcomeData
    }
  });

  fixtures
    .filter(fixture => isLiveRequest ? fixture.status === 'FINISHED' || fixture.status === 'IN_PLAY' : fixture.status === 'FINISHED')
    .forEach(fixture => {
      const homeGoals = fixture.result.extraTime ?  fixture.result.extraTime.goalsHomeTeam : fixture.result.goalsHomeTeam;
      const awayGoals = fixture.result.extraTime ?  fixture.result.extraTime.goalsAwayTeam : fixture.result.goalsAwayTeam;
      teamsWithOutcomeData[fixture.homeTeamName].goals += homeGoals;
      teamsWithOutcomeData[fixture.awayTeamName].goals += awayGoals;

      if (homeGoals > awayGoals) {
        teamsWithOutcomeData[fixture.homeTeamName].wins++;
        teamsWithOutcomeData[fixture.awayTeamName].losses++;
      } else if (awayGoals > homeGoals) {
        teamsWithOutcomeData[fixture.awayTeamName].wins++;
        teamsWithOutcomeData[fixture.homeTeamName].losses++;
      } else if (fixture.result.penaltyShootout) {
        const homePenaltyGoals = fixture.result.penaltyShootout.goalsHomeTeam;
        const awayPenaltyGoals = fixture.result.penaltyShootout.goalsAwayTeam;

        if (homePenaltyGoals > awayPenaltyGoals) {
          teamsWithOutcomeData[fixture.homeTeamName].wins++;
          teamsWithOutcomeData[fixture.awayTeamName].losses++;
        } else {
          teamsWithOutcomeData[fixture.awayTeamName].wins++;
          teamsWithOutcomeData[fixture.homeTeamName].losses++;
        }
      } else {
        teamsWithOutcomeData[fixture.homeTeamName].draws++;
        teamsWithOutcomeData[fixture.awayTeamName].draws++;
      }
    });

  return teamsWithOutcomeData;
};

async function getFixturesForToday() {
  const fixtures = await competitionRepository.getFixtures();
  return fixtures.filter(fixture => moment(fixture.date).isSame(moment(), 'day'));
};

module.exports = {
  getFixturesForToday,
  getTeamsWithOutcomeData
};