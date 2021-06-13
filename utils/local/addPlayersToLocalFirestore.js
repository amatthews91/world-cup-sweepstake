const admin = require('firebase-admin');
const players = require('./example-players.json');
const uuidv4 = require('uuid').v4;

process.env.FIRESTORE_EMULATOR_HOST="localhost:8080";

admin.initializeApp({
  projectId: 'euro-sweepstake'
});

const firestore = admin.firestore();

const playersRef = firestore.collection('players');

(async () => {
  try {
    const batch = firestore.batch();
    players.forEach(p => {
      const docRef = playersRef.doc(uuidv4());
      batch.set(docRef, p);
    });
    await batch.commit();
    console.log(`${players.length} players added to firestore`);
  } catch (e) {
    console.log(e);
  }
})();