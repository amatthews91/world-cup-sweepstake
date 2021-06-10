const fs = require('fs');
const admin = require('firebase-admin');
const uuidv4 = require('uuid').v4;
const serviceAccount = require('./.service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const playersRef = db.collection('players');
const playerData = fs.readFileSync('./players.csv')
  .toString('utf8')
  .split('\r\n');

const getPlayerDocument = (raw) => {
  const [name,goalTeams,outcomeTeams,goalsPredicted] = raw.split('|');
  return {
    name,
    goalsPredicted,
    teams: {
      goals: [...goalTeams.split(',').map(t => t.trim())],
      outcomes: [...outcomeTeams.split(',').map(t => t.trim())]
    }
  };
}

(async () => {
  try {
    const playerDocs = playerData.map(getPlayerDocument);
    const batch = db.batch();
    playerDocs.forEach(d => {
      const docRef = playersRef.doc(uuidv4());
      batch.set(docRef, d)
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
  }
})();
