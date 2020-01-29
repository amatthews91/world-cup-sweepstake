const fs = require('fs');

const COMPETITION_API = {
  'API_KEY': process.env.API_KEY || fs.readFileSync('./api-key.txt'),
  'URL': {
    'BASE': 'https://api.football-data.org/v2/competitions/CL/',
    'FIXTURES': 'matches',
    'TEAMS': 'teams'
  }
};

const DATABASE = {
  'COLLECTIONS': {
    'FIXTURES': 'fixtures',
    'LAST_API_LOOKUP': 'last-api-lookup',
    'PLAYERS': 'players',
    'TEAMS': 'teams'
  },
  'URL': process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  'NAME': process.env.MONGODB_NAME || 'world-cup-sweepstake'
};

module.exports = {
  COMPETITION_API,
  DATABASE
};
