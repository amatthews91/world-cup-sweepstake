const MongoClient = require('mongodb').MongoClient;

const DB_CONSTANTS = require('./constants').DATABASE;

async function getCollection(collectionName) {
  try {
      console.log(`Fetching collection: ${collectionName}`);

      const database = await MongoClient.connect(
        DB_CONSTANTS.URL,
        { useUnifiedTopology: true }
      );
      const collection = database.db(DB_CONSTANTS.NAME).collection(collectionName);

      return collection;
  } catch (error) {
      console.log(`Error connecting to database for collection ${collectionName} : ${error}`);
      return null;
  }
};

module.exports = {
  getCollection
};
