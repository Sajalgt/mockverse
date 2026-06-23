async function runLoadTest(targetUrl, records, onProgress, batchSize = 50) {
  const BATCH_SIZE = batchSize; // ab parameter se aa raha hai, hardcoded nahi
  const batches = createBatches(records, BATCH_SIZE);

  const results = [];
  let successCount = 0;
  let failCount = 0;
  const errorBreakdown = {};

  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map((record) => sendSingleRequest(targetUrl, record))
    );

    batchResults.forEach((result) => {
      results.push(result);

      if (result.success) {
        successCount++;
      } else {
        failCount++;
        const errorKey = result.error || 'Unknown error';
        errorBreakdown[errorKey] = (errorBreakdown[errorKey] || 0) + 1;
      }
    });

    if (onProgress) {
      onProgress({
        sent: results.length,
        total: records.length,
        success: successCount,
        failed: failCount,
      });
    }
  }

  const responseTimes = results.map((r) => r.responseTime).sort((a, b) => a - b);
  const avgResponseTime =
    responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;
  const minResponseTime = responseTimes[0] || 0;
  const maxResponseTime = responseTimes[responseTimes.length - 1] || 0;
  const p95Index = Math.floor(responseTimes.length * 0.95);
  const p95ResponseTime = responseTimes[p95Index] || maxResponseTime;

  return {
    totalSent: results.length,
    success: successCount,
    failed: failCount,
    errorBreakdown,
    metrics: {
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime,
      maxResponseTime,
      p95ResponseTime,
    },
  };
}

function sendSingleRequest(targetUrl, record) {
  const startTime = Date.now();

  return fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  })
    .then((response) => ({
      success: response.ok,
      statusCode: response.status,
      responseTime: Date.now() - startTime,
      error: response.ok ? null : `HTTP ${response.status}`,
    }))
    .catch((error) => ({
      success: false,
      statusCode: null,
      responseTime: Date.now() - startTime,
      error: error.message || 'Connection failed',
    }));
}

function createBatches(records, batchSize) {
  const batches = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }
  return batches;
}

module.exports = { runLoadTest };