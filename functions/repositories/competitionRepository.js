const functions = require('firebase-functions');
const fetch = require('node-fetch');
const { DateTime } = require("luxon");

const dbUtils = require('../databaseUtils');
const CONSTANTS = require('../constants');
const URL_CONSTANTS = CONSTANTS.COMPETITION_API.URL;

const db = dbUtils.getDatabase();
const fixtureRef = db.collection('competition').doc('fixtures');
const teamRef = db.collection('competition').doc('teams');
const lastLookupRef = db.collection('competition').doc('lastLookup');

/*** Private Methods ***/

async function fetchWithAuthHeader(url) {
  const response = await fetch(url, { headers: { 'X-Auth-Token': process.env.API_KEY } });
  if (!response.ok) {
    throw new Error(`Unexpected response fetching fixtures '${response.statusText}'`);
  }
  const responseData = await response.json();

  return responseData;
};

async function getLastApiLookupTime() {
  const doc = await lastLookupRef.get();
  if (doc.exists) {
    return doc.data().lookupTime;
  } else {
    return null;
  }
};

async function cacheFixtures(data) {
  await fixtureRef.set({ data });
  await lastLookupRef.set({ 'lookupTime': DateTime.utc().toISO() })
};

async function cacheTeams(data) {
  await teamRef.set({ data });
}

/*** Public Methods ***/

async function getFixtures() {

  const lastApiLookup = await getLastApiLookupTime();
  const minutesSinceLastLookup = lastApiLookup ?
    DateTime.utc()
      .diff(DateTime.fromISO(lastApiLookup), 'minutes')
      .toObject()
      .minutes :
    null;

  if (!minutesSinceLastLookup || minutesSinceLastLookup > 1) {
      console.log('1 Minute has passed since last API lookup, updating fixtures.');

      const fixtureResponse = await fetchWithAuthHeader(`${URL_CONSTANTS.BASE}/${URL_CONSTANTS.COMPETITION_CODE}/${URL_CONSTANTS.FIXTURES}`);
      const fixtures = fixtureResponse.matches
        .map(({ utcDate, status, score, homeTeam, awayTeam }) => ({
          utcDate,
          status,
          score, 
          homeTeam,
          awayTeam
        }));

      await cacheFixtures(fixtures);

      return fixtures;
  } else {
      console.log('Not enough time since last API call, fetching DB fixtures.');
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