const express = require('express');
const boolParser = require('express-query-boolean');
const functions = require('firebase-functions');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(boolParser());

app.use('/competition', require('./controllers/competition'));
app.use('/players', require('./controllers/players'));

app.get('/ping', (_, response) => {
  response.send('pong');
});

exports.widgets = functions.https.onRequest(app);
