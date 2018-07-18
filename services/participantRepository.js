const COLLECTIONS = require('./constants').COLLECTIONS;

const databaseUtils = require('./databaseUtils');

async function getPlayers()  {
  const playerCollection = await databaseUtils.getCollection('players');
  const players = await playerCollection.find({}).toArray();

  return players;
};

module.exports = {
  getPlayers
}