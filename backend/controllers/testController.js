const { generateBulkData } = require('../services/dataGenerator');
const { runLoadTest } = require('../services/loadTester');

async function handleRunTest(req, res, io) {
  try {
    const { schema, targetUrl, batchSize, method } = req.body;

    if (!schema || !targetUrl) {
      return res.status(400).json({ error: 'schema aur targetUrl dono zaroori hain' });
    }

    const records = generateBulkData(schema);

    const safeBatchSize = batchSize && batchSize > 0 && batchSize <= 500
      ? batchSize
      : 50;

    const safeMethod = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
      ? method
      : 'POST';

    const result = await runLoadTest(targetUrl, records, (progress) => {
      io.emit('test-progress', progress);
    }, safeBatchSize, safeMethod);

    io.emit('test-complete', result);

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Load test error:', error.message);
    io.emit('test-error', { error: error.message });
    return res.status(500).json({ error: 'Load test chalane mein dikkat aayi' });
  }
}

module.exports = { handleRunTest };