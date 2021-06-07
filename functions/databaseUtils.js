const admin = require('firebase-admin');

admin.initializeApp();

let db;

function getDatabase() {
  if (!db) {
    db = admin.firestore();
  }
  return db;
};

module.exports = {
  getDatabase
};
