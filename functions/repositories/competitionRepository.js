const fetch = require('node-fetch');

const dbUtils = require('../databaseUtils');
const CONSTANTS = require('../constants');
const URL_CONSTANTS = CONSTANTS.COMPETITION_API.URL;

const db = dbUtils.getDatabase();
const fixtureRef = db.collection('competition').doc('fixtures');
const teamRef = db.collection('competition').doc('teams');

/*** Private Methods ***/

async function fetchWithAuthHeader(url) {
  const response = await fetch(url, { headers: { 'X-Auth-Token': process.env.API_KEY } });
  if (!response.ok) {
    throw new Error(`Unexpected response fetching fixtures '${response.statusText}'`);
  }
  const responseData = await response.json();

  return responseData;
};

async function cacheFixtures(data) {
  await fixtureRef.set({ data });
};

async function cacheTeams(data) {
  await teamRef.set({ data });
}

/*** Public Methods ***/

async function getFixtures() {
  const fixtureDoc = await fixtureRef.get();
  const fixtures = fixtureDoc.exists ? [...fixtureDoc.data().data] : [];

  if (fixtures.length === 0) {
      console.log(`No fixtures in DB for competition ${URL_CONSTANTS.COMPETITION_CODE}, loading from API.`);

      const fixtureResponse = await fetchWithAuthHeader(`${URL_CONSTANTS.BASE}/${URL_CONSTANTS.COMPETITION_CODE}/${URL_CONSTANTS.FIXTURES}`);
      const newFixtures = fixtureResponse.matches
        .map(({ utcDate, status, score, homeTeam, awayTeam }) => ({
          utcDate,
          status,
          score,
          homeTeam,
          awayTeam
        }));

      await cacheFixtures(newFixtures);

      return newFixtures;
  } else {
      console.log('Returning fixtures from DB.');
      const fixtureDoc = await fixtureRef.get();
      return fixtureDoc.data().data;
  }
};

async function getTeams() {
  const teamDoc = await teamRef.get();
  const teams = teamDoc.exists ? [...teamDoc.data().data] : [];

  if (teams.length === 0) {
      console.log('No teams found in DB, updating from API');
      const apiTeams = await fetchWithAuthHeader(`${URL_CONSTANTS.BASE}/${URL_CONSTANTS.COMPETITION_CODE}/${URL_CONSTANTS.TEAMS}`);
      const teamsWithEliminatedStatus = apiTeams.teams.map(team => {
          const { id, crestUrl, name, tla } = team;
          return {
            id,
            crestUrl,
            name,
            tla,
            isEliminated: false
          }
      });
      await cacheTeams(teamsWithEliminatedStatus);
      teams.push(...teamsWithEliminatedStatus);
  }

  return teams;
}

module.exports = {
  getFixtures,
  getTeams
}