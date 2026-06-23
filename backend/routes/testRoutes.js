const express = require('express');
const router = express.Router();

const { handleSchemaGeneration } = require('../controllers/schemaController');
const { handleRunTest } = require('../controllers/testController');

// io ko inject karne ke liye ek function banate hain (kyunki socket.io instance server.js se aayega)
function createTestRoutes(io) {
  router.post('/generate-schema', handleSchemaGeneration);

  router.post('/run-test', (req, res) => handleRunTest(req, res, io));

  return router;
}

module.exports = createTestRoutes;