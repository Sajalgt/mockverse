const BASE_URL = 'http://localhost:5000/api';

export async function generateSchema(userInput) {
  const response = await fetch(`${BASE_URL}/generate-schema`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Schema generation failed. Please try again.');
  }

  return data.schema;
}

export async function runLoadTest(schema, targetUrl, batchSize = 50) {
  const response = await fetch(`${BASE_URL}/run-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schema, targetUrl, batchSize }),
  });

  if (!response.ok) {
    throw new Error('Load test failed. Please check the URL and try again.');
  }

  const data = await response.json();
  return data.result;
}