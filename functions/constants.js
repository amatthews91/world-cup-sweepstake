const fs = require('fs');

const COMPETITION_API = {
  'API_KEY': process.env.API_KEY || fs.readFileSync('./api-key.txt'),
  'URL': {
    'BASE': 'https://api.football-data.org/v2/competitions',
    'COMPETITION_CODE': '2018',
    'FIXTURES': 'matches',
    'TEAMS': 'teams'
  }
};

module.exports = {
  COMPETITION_API
};
