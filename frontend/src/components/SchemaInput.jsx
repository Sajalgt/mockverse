import { useState } from 'react';

function isValidInput(input) {
  const trimmed = input.trim();
  if (trimmed.length < 10) return false;
  const words = trimmed.split(/\s+/).filter(w => w.length > 1);
  if (words.length < 2) return false;
  return true;
}

export default function SchemaInput({ onSchemaGenerated }) {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!userInput.trim()) {
      setError('Please describe the data you need.');
      return;
    }

    if (!isValidInput(userInput)) {
      setError('Please provide a meaningful description (e.g. "I need 100 users with name and email").');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { generateSchema } = await import('../services/api');
      const schema = await generateSchema(userInput);
      onSchemaGenerated(schema);
    } catch (err) {
      setError(err.message || 'Failed to generate schema. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#1a1d2e] border border-gray-800 rounded-xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
          STEP 1
        </span>
        <h2 className="text-sm font-semibold text-gray-300">
          Describe your test data
        </h2>
      </div>

      <textarea
        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none mono"
        rows={4}
        placeholder="e.g. I need 5000 users with name, email, Delhi address, and a late-night order time"
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
          if (error) setError('');
        }}
      />

      {error && (
        <p className="text-red-400 text-xs mt-2 mono">✗ {error}</p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating schema...
          </span>
        ) : (
          'Generate Schema →'
        )}
      </button>
    </div>
  );
}