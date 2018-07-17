const fetch = require('node-fetch');

const CONSTANTS = require('./constants');
const databaseUtils = require('./databaseUtils');

const COLLECTIONS = CONSTANTS.DATABASE.COLLECTIONS;

async function fetchWithHeader(url) {
  const API_KEY = CONSTANTS.API_CONSTANTS.API_KEY;

  const response = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  const responseData = await response.json();

  return responseData;
};

async function getLastApiLookupTime() {
  const lookupCollection = await databaseUtils.getCollection(COLLECTIONS.LAST_API_LOOKUP);
  const lastLookup = await lookupCollection.findOne({});

  return lastLookup;
};

async function updateFixtures(data) {
  const fixtureCollection = await databaseUtils.getCollection('fixtures');
  await fixtureCollection.remove();
  await fixtureCollection.insert(data);

  const lookupCollection = await databaseUtils.getCollection('last-api-lookup');
  await lookupCollection.remove();
  await lookupCollection.insert({ time: moment().format() });
};

async function getFixtures() {

  const lastApiLookup = await getLastApiLookupTime();
  const durationSinceLastLookup = lastApiLookup ? moment.duration(moment().diff(moment(lastApiLookup.time))) : null;

  if (!durationSinceLastLookup || parseInt(durationSinceLastLookup.asMinutes()) > 1) {
      console.log('1 Minute has passed since last API lookup, updating fixtures.');

      const fixtureResponse = await fetchWithHeader(baseUrl + 'fixtures');
      const fixtures = fixtureResponse.fixtures;
      await updateFixtures(fixtures);

      return fixtures;
  } else {
      console.log('Not enough time since last API call, fetching DB fixtures.');
      const fixtures = await dbService.getFixtures();
      return fixtures;
  }
};