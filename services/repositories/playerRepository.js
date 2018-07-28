const COLLECTIONS = require('../constants').DATABASE.COLLECTIONS;

const databaseUtils = require('../databaseUtils');

async function getPlayers()  {
  const playerCollection = await databaseUtils.getCollection(COLLECTIONS.PLAYERS);
  const players = await playerCollection.find({}).toArray();

  return players;
};

module.exports = {
  getPlayers
}