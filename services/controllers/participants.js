const express = require('express')

const participantRepository = require('../repositories/participantRepository');

const router = express.Router();

router.get('/', async (request, response) => {
  console.log('Request received for all participants');

  const participants = await participantRepository.getParticipants();  

  response.json(participants);
});

module.exports = router;