export default function ErrorBreakdown({ result }) {
  if (!result || result.failed === 0) return null;

  const errors = Object.entries(result.errorBreakdown || {});

  return (
    <div className="bg-[#1a1d2e] border border-gray-800 rounded-xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs mono text-red-400 bg-red-500/10 px-2 py-1 rounded">
          ERRORS
        </span>
        <h2 className="text-sm font-semibold text-gray-300">Error Breakdown</h2>
      </div>

      <div className="bg-[#0f1117] rounded-lg border border-gray-800 divide-y divide-gray-800">
        {errors.map(([errorType, count], idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-3">
            <span className="text-sm mono text-red-400">{errorType}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-800 rounded-full h-1">
                <div
                  className="bg-red-500 h-1 rounded-full"
                  style={{
                    width: `${Math.round((count / result.failed) * 100)}%`
                  }}
                />
              </div>
              <span className="text-xs mono text-gray-400 w-6 text-right">
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}