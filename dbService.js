const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = process.env.MONGODB_NAME || 'world-cup-sweepstake';
const connectionUrl = process.env.MONGODB_URI || `mongodb://localhost:27017/`;

async function test() {
    const database = await MongoClient.connect(connectionUrl);
    console.log('Succesfully connected to DB server');
    database.close();
};

async function getPlayers()  {
    const database = await MongoClient.connect(connectionUrl);
    const playerCollection = database.db(dbName).collection('players');
    const result = await playerCollection.find({}).toArray();
    return result;
};

module.exports = {
    test,
    getPlayers
};
