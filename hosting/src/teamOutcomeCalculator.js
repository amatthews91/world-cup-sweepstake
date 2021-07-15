const defaultOutcomeData = {
  goals: 0,
  wins: 0,
  draws: 0,
  losses: 0
};

const getTeamsWithOutcomeData = (fixtures, teams, matchDayLimit) => {
  const teamsWithOutcomeData = {};

  teams.forEach(team => {
    teamsWithOutcomeData[team.name] = {
      ...team,
      ...defaultOutcomeData
    };
  });

  fixtures
    .filter(fixture => matchDayLimit ? fixture.luxonDate <= matchDayLimit : fixture)
    .forEach(fixture => {
      const homeGoals = fixture.score.fullTime.homeTeam;
      const awayGoals = fixture.score.fullTime.awayTeam;

      // Full time score includes penalty shootout.
      // Shootout goals do not count towards total.
      const duration = fixture.score.duration;
      if (duration === 'PENALTY_SHOOTOUT') {
        teamsWithOutcomeData[fixture.homeTeam.name].goals += (homeGoals - fixture.score.penalties.homeTeam);
        teamsWithOutcomeData[fixture.awayTeam.name].goals += (awayGoals - fixture.score.penalties.awayTeam);
      } else {
        teamsWithOutcomeData[fixture.homeTeam.name].goals += homeGoals;
        teamsWithOutcomeData[fixture.awayTeam.name].goals += awayGoals;
      }

      if (duration === 'REGULAR' || duration === 'EXTRA_TIME') {
        if (homeGoals > awayGoals) {
          teamsWithOutcomeData[fixture.homeTeam.name].wins++;
          teamsWithOutcomeData[fixture.awayTeam.name].losses++;
        } else if (awayGoals > homeGoals) {
          teamsWithOutcomeData[fixture.awayTeam.name].wins++;
          teamsWithOutcomeData[fixture.homeTeam.name].losses++;
        } else {
          teamsWithOutcomeData[fixture.homeTeam.name].draws++;
          teamsWithOutcomeData[fixture.awayTeam.name].draws++;
        }
      } else {
        // Penalties
        const homePenaltyGoals = fixture.score.penalties.homeTeam;
        const awayPenaltyGoals = fixture.score.penalties.awayTeam;

        if (homePenaltyGoals > awayPenaltyGoals) {
          teamsWithOutcomeData[fixture.homeTeam.name].wins++;
          teamsWithOutcomeData[fixture.awayTeam.name].losses++;
        } else {
          teamsWithOutcomeData[fixture.awayTeam.name].wins++;
          teamsWithOutcomeData[fixture.homeTeam.name].losses++;
        }
      }
    });

  return teamsWithOutcomeData;
};

export default getTeamsWithOutcomeData;
