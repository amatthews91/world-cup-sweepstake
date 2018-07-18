const fs = require('fs');

const COMPETITION_API = {
  'API_KEY': process.env.API_KEY || fs.readFileSync('./api-key.txt'),
  'URL': {
    'BASE': 'https://api.football-data.org/v1/competitions/467/',
    'FIXTURES': 'fixtures',
    'TEAMS': 'teams'
  }
};

const DATABASE = {
  'COLLECTIONS': {
    'FIXTURES': 'fixtures',
    'LAST_API_LOOKUP': 'last-api-lookup',
    'TEAMS': 'teams'
  },
  'URL': process.env.MONGODB_URI || `mongodb://localhost:27017/`,
  'NAME': process.env.MONGODB_NAME || 'world-cup-sweepstake'
};

module.exports = {
  COMPETITION_API,
  DATABASE
};
