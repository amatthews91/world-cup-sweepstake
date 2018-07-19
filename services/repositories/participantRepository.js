const COLLECTIONS = require('../constants').DATABASE.COLLECTIONS;

const databaseUtils = require('../databaseUtils');

async function getParticipants()  {
  const participantCollection = await databaseUtils.getCollection(COLLECTIONS.PARTICIPANTS);
  const participants = await participantCollection.find({}).toArray();

  console.log('Found participants');
  console.log(participants);

  return participants;
};

module.exports = {
  getParticipants
}