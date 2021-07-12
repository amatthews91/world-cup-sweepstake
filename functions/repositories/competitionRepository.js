const fetch = require('node-fetch');

const dbUtils = require('../databaseUtils');
const CONSTANTS = require('../constants');
const URL_CONSTANTS = CONSTANTS.COMPETITION_API.URL;

const db = dbUtils.getDatabase();

// TODO: Move competition code to URL param.
const competitionDocRef = db.collection('competition').doc(URL_CONSTANTS.COMPETITION_CODE);
const fixtureCollection = competitionDocRef.collection('fixtures');
const teamsCollection = competitionDocRef.collection('teams');

/*** Private Methods ***/

async function fetchWithAuthHeader(url) {
  const response = await fetch(url, { headers: { 'X-Auth-Token': process.env.API_KEY } });
  if (!response.ok) {
    throw new Error(`Unexpected response fetching fixtures '${response.statusText}'`);
  }
  const responseData = await response.json();

  return responseData;
};

async function cacheFixtures(name, data) {
  await competitionDocRef.set({ name });

  const batch = db.batch();
  data.forEach(fixture => {
    const docRef = fixtureCollection.doc(`${fixture.id}`);
    batch.set(docRef, fixture);
  })
  await batch.commit();
};

async function cacheTeams(data) {
  const batch = db.batch();
  data.forEach(team => {
    const docRef = teamsCollection.doc(`${team.id}`);
    batch.set(docRef, team);
  })
  await batch.commit();
}

/*** Public Methods ***/

async function getFixtures() {
  const fixtureDocs = await fixtureCollection.get();

  if (fixtureDocs.empty) {
      console.log(`No fixtures in DB for competition ${URL_CONSTANTS.COMPETITION_CODE}, loading from API.`);

      const fixtureResponse = await fetchWithAuthHeader(`${URL_CONSTANTS.BASE}/${URL_CONSTANTS.COMPETITION_CODE}/${URL_CONSTANTS.FIXTURES}`);
      const newFixtures = fixtureResponse.matches
        .map(({ id, utcDate, status, score, homeTeam, awayTeam }) => ({
          id,
          utcDate,
          status,
          score,
          homeTeam,
          awayTeam
        }));
      const { name } = fixtureResponse.competition;

      await cacheFixtures(name, newFixtures);

      return newFixtures;
  } else {
      console.log('Returning fixtures from DB.');
      const fixtures = [];
      fixtureDocs.forEach(doc => fixtures.push(doc.data()));
      return fixtures;
  }
};

async function getTeams() {
  const teamDocs = await teamsCollection.get();

  if (teamDocs.empty) {
      console.log(`No teams in DB for competition ${URL_CONSTANTS.COMPETITION_CODE}, loading from API.`);
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
      return teamsWithEliminatedStatus;
  } else {
    console.log('Returning teams from DB.');
    const teams = [];
    teamDocs.forEach(doc => teams.push(doc.data()));
    return teams;
  }
}

module.exports = {
  getFixtures,
  getTeams
}