import { useState } from 'react';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const BODY_METHODS = ['POST', 'PUT', 'PATCH'];

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function TargetApiForm({ schema, onTestStarted }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [batchSize, setBatchSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRunTest() {
    if (!targetUrl.trim()) {
      setError('Target API URL is required.');
      return;
    }
    if (!isValidUrl(targetUrl.trim())) {
      setError('Enter a valid URL (e.g. https://example.com/api)');
      return;
    }
    if (batchSize < 1 || batchSize > 500) {
      setError('Concurrency must be between 1 and 500.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { runLoadTest } = await import('../services/api');
      onTestStarted();
      await runLoadTest(schema, targetUrl, batchSize, method);
    } catch (err) {
      setError('Test failed. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!schema) return null;

  const hasBody = BODY_METHODS.includes(method);

  return (
    <div className="bg-[#1a1d2e] border border-gray-800 rounded-xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
          STEP 2
        </span>
        <h2 className="text-sm font-semibold text-gray-300">
          Configure & Run Test
        </h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mono mb-1 block">TARGET API URL</label>
          <input
            type="text"
            className="w-full bg-[#1a1d2e] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 mono"
            placeholder="https://your-api.com/endpoint"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 mono mb-1 block">METHOD</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-[#1a1d2e] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 mono cursor-pointer"
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mono mb-1 block">CONCURRENT REQUESTS</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={500}
                className="w-24 bg-[#1a1d2e] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 mono"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
              />
              <span className="text-xs text-gray-600 mono">1 – 500 · default: 50</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 mono bg-[#1a1d2e] border border-gray-800 rounded-lg px-3 py-2">
          {hasBody
            ? `✦ ${method} — synthetic data sent as JSON body per request.`
            : `✦ ${method} — no body sent. Requests hit the endpoint directly.`}
        </p>
      </div>

      {error && <p className="text-red-400 text-xs mt-3 mono">✗ {error}</p>}

      <button
        onClick={handleRunTest}
        disabled={loading}
        className="mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Running test...
          </span>
        ) : (
          'Run Load Test →'
        )}
      </button>
    </div>
  );
}





