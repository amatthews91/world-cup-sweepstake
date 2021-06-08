const express = require('express');
const boolParser = require('express-query-boolean');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const app = express();
app.use(cors);
app.use(boolParser());

app.set('port', (process.env.PORT || 5000));

app.use('/competition', require('./controllers/competition'));
app.use('/players', require('./controllers/players'));

app.get('/ping', (_, response) => {
  response.send('pong');
});

exports.api = functions.https.onRequest(app);
