const express = require('express');
const path = require('path');
const boolParser = require('express-query-boolean');

const server = express();

server.set('port', (process.env.PORT || 5000));

server.use(boolParser());
server.use(express.static(path.join(__dirname, 'build')));

server.use('/api/competition', require('./services/controllers/competition'));
server.use('/api/players', require('./services/controllers/players'));

server.get('/ping', (request, response) => {
  response.send('pong');
});

server.listen(server.get('port'), () => {
  console.log(`Server listening on port ${server.get('port')}`);
});