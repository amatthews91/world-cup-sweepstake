const fetch = require('node-fetch');
const fs = require('fs');
const moment = require('moment');

const dbService = require('./dbService');

//WC = 467
//CL 2017/18 = 464
const baseUrl = 'https://api.football-data.org/v1/competitions/467/';

async function fetchWithHeader(url) {
    const API_KEY = process.env.API_KEY || fs.readFileSync('./api-key.txt');

    const response = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
    const responseData = await response.json();

    return responseData;
}

async function getFixtures() {

    const lastApiLookup = await dbService.getLastApiLookupTime();
    const durationSinceLastLookup = lastApiLookup ? moment.duration(moment().diff(moment(lastApiLookup.time))) : null;

    if (!durationSinceLastLookup || parseInt(durationSinceLastLookup.asMinutes()) > 1) {
        console.log('1 Minute has passed since last API lookup, updating fixtures.');

        const fixtureResponse = await fetchWithHeader(baseUrl + 'fixtures');
        const fixtures = fixtureResponse.fixtures;
        await dbService.updateFixtures(fixtures);

        return fixtures;
    } else {
        console.log('Not enough time since last API call, fetching DB fixtures.');
        const fixtures = await dbService.getFixtures();
        return fixtures;
    }
}

async function populateGoalData(teamData, isLiveRequest) {
    const fixtures = await getFixtures();

    //TODO: Try to rewrite this in such a way that we create a new object and leave the original untouched (puuuuuuuuure)
    fixtures
        .filter(fixture => isLiveRequest ? fixture.status === 'FINISHED' || fixture.status === 'IN_PLAY' : fixture.status === 'FINISHED')
        .forEach(fixture => {
            const homeGoals = fixture.result.goalsHomeTeam;
            const awayGoals = fixture.result.goalsAwayTeam;
            teamData[fixture.homeTeamName].goals += homeGoals;
            teamData[fixture.awayTeamName].goals += awayGoals;

            if (homeGoals > awayGoals) {
                teamData[fixture.homeTeamName].wins++;
                teamData[fixture.awayTeamName].losses++;
            } else if (awayGoals > homeGoals) {
                teamData[fixture.awayTeamName].wins++;
                teamData[fixture.homeTeamName].losses++;
            } else {
                teamData[fixture.homeTeamName].draws++;
                teamData[fixture.awayTeamName].draws++;
            }
        });

    return teamData;
};

async function getCompetitionData(isLiveRequest) {

    const teams = await dbService.getTeams();

    if (teams.length === 0) {
        //Store team data in DB to save on API requests - they shouldn't change during the competition.
        console.log('No teams found in DB, updating from API');
        const apiTeams = await fetchWithHeader(baseUrl + 'teams');
        await dbService.updateTeams(apiTeams.teams);
        teams.push(...apiTeams.teams);
    }

    const teamData = {};

    teams
        .sort((a, b) => {
            return (a.name < b.name) ? -1 : 1;
        })
        .forEach(team => {
            teamData[team.name] = {
                flag: team.crestUrl,
                goals: 0,
                wins: 0,
                draws: 0,
                losses: 0
            };
        });

    const teamsPopulatedWithGoalData = await populateGoalData(teamData, isLiveRequest);
    return teamsPopulatedWithGoalData;
};

async function getTeamNames() {

    const teams = await dbService.getTeams();

    const teamNames = teams.map(team => team.name);

    return teamNames;
};

module.exports = {
    getCompetitionData,
    getTeamNames
};
