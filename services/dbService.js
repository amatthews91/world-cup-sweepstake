const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment');

const dbName = process.env.MONGODB_NAME || 'world-cup-sweepstake';
const connectionUrl = process.env.MONGODB_URI || `mongodb://localhost:27017/`;

async function test() {
    const database = await MongoClient.connect(connectionUrl);
    console.log('Succesfully connected to DB server');
    database.close();
};

async function getPlayers()  {
    const playerCollection = await getCollection('players');
    const result = await playerCollection.find({}).toArray();
    return result;
};

async function getFixtures() {
    const fixtureCollection = await getCollection('fixtures');
    const fixtures = await fixtureCollection.find({}).toArray();

    return fixtures;
};

async function updateFixtures(data) {
    const fixtureCollection = await getCollection('fixtures');
    await fixtureCollection.remove();
    await fixtureCollection.insert(data);

    const lookupCollection = await getCollection('last-api-lookup');
    await lookupCollection.remove();
    await lookupCollection.insert({ time: moment().format() });
};

async function getLastApiLookupTime() {
    const lookupCollection = await getCollection('last-api-lookup');
    const lastLookup = await lookupCollection.findOne({});

    return lastLookup.time;
}

async function getCollection(collectionName) {
    try {
        const database = await MongoClient.connect(connectionUrl);
        const collection = database.db(dbName).collection(collectionName);

        return collection;
    } catch (error) {
        console.log(`Error connection to database for collection ${collection} : ${error}`);
    }
};

module.exports = {
    test,
    getPlayers,
    getFixtures,
    getLastApiLookupTime,
    updateFixtures
};
