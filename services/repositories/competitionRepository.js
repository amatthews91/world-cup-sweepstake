const fetch = require('node-fetch');
const moment = require('moment');

const CONSTANTS = require('../constants');
const databaseUtils = require('../databaseUtils');

const COLLECTIONS = CONSTANTS.DATABASE.COLLECTIONS;
const URL_CONSTANTS = CONSTANTS.COMPETITION_API.URL;

/*** Private Methods ***/

async function fetchWithAuthHeader(url) {
  const response = await fetch(url, { headers: { 'X-Auth-Token': CONSTANTS.COMPETITION_API.API_KEY } });
  const responseData = await response.json();

  return responseData;
};

async function getLastApiLookupTime() {
  const lookupCollection = await databaseUtils.getCollection(COLLECTIONS.LAST_API_LOOKUP);
  const lastLookup = await lookupCollection.findOne({});

  return lastLookup;
};

async function cacheFixtures(data) {
  const fixtureCollection = await databaseUtils.getCollection(COLLECTIONS.FIXTURES);
  await fixtureCollection.remove();
  await fixtureCollection.insert(data);

  const lookupCollection = await databaseUtils.getCollection(COLLECTIONS.LAST_API_LOOKUP);
  await lookupCollection.remove();
  await lookupCollection.insert({ time: moment().format() });
};

async function cacheTeams(data) {
  const teamCollection = await databaseUtils.getCollection(COLLECTIONS.TEAMS);
  await teamCollection.remove();
  await teamCollection.insert(data);
}

/*** Public Methods ***/

async function getFixtures() {

  const lastApiLookup = await getLastApiLookupTime();
  const durationSinceLastLookup = lastApiLookup ? moment.duration(moment().diff(moment(lastApiLookup.time))) : null;

  if (!durationSinceLastLookup || parseInt(durationSinceLastLookup.asMinutes()) > 1) {
      console.log('1 Minute has passed since last API lookup, updating fixtures.');

      const fixtureResponse = await fetchWithAuthHeader(URL_CONSTANTS.BASE + URL_CONSTANTS.FIXTURES);
      const fixtures = fixtureResponse.fixtures;
      await cacheFixtures(fixtures);

      return fixtures;
  } else {
      console.log('Not enough time since last API call, fetching DB fixtures.');
      const fixtureCollection = await databaseUtils.getCollection(URL_CONSTANTS.FIXTURES);
      const fixtures = await fixtureCollection.find({}).toArray();
      return fixtures;
  }
};

async function getTeams() {
  const teamCollection = await databaseUtils.getCollection(COLLECTIONS.TEAMS);
  const teams = await teamCollection.find({}).toArray();

  if (teams.length === 0) {
      console.log('No teams found in DB, updating from API');
      const apiTeams = await fetchWithAuthHeader(URL_CONSTANTS.BASE + URL_CONSTANTS.TEAMS);
      const teamsWithEliminatedStatus = apiTeams.teams.map(team => {
          return {
              isEliminated: false,
              ...team
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