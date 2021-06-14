const express = require('express');
const boolParser = require('express-query-boolean');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

process.env.API_KEY = functions.config().footballapi.key;

const FUNCTION_NAME = 'api';
const app = express();
app.use(cors);
app.use(boolParser());

app.set('port', (process.env.PORT || 5000));

// Rewrite Firebase hosting requests: /api/:path => /:path
// /api/ Is only part of the path because it's the name of the function - that doesn't exist within the express app here.
app.use((req, _, next) => {
  if (req.url.indexOf(`/${FUNCTION_NAME}/`) === 0) {
      req.url = req.url.substring(FUNCTION_NAME.length + 1);
  }
  next();
});

app.use('/competition', require('./controllers/competition'));
app.use('/players', require('./controllers/players'));

app.get('/ping', (_, response) => {
  response.send('pong');
});

exports[FUNCTION_NAME] = functions.https.onRequest(app);
