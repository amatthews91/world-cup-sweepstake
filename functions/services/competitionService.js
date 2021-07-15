const competitionRepository = require('../repositories/competitionRepository');

async function getTeamsWithOutcomeData() {
  const teams = await competitionRepository.getTeams();

  return teams
    .sort((a, b) => (a.name < b.name) ? -1 : 1)
    .map(({ name, crestUrl, isEliminated }) => ({
      name,
      flag: crestUrl,
      isEliminated
    }));
};

module.exports = {
  getFixtures: competitionRepository.getFixtures,
  getTeamsWithOutcomeData
};