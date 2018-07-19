const express = require('express');
const path = require('path');
const boolParser = require('express-query-boolean');

const server = express();

server.set('port', (process.env.PORT || 5000));

server.use(boolParser());
server.use(express.static(path.join(__dirname, 'build')));

server.use('/participants', require('./services/controllers/participants'));

server.get('/ping', (request, response) => {
  response.send('pong');
});

server.listen(server.get('port'), () => {
  console.log(`Server listening on port ${server.get('port')}`);
});