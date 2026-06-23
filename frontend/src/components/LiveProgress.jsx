export default function LiveProgress({ progress }) {
  if (!progress) return null;

  const percent = progress.total > 0
    ? Math.round((progress.sent / progress.total) * 100)
    : 0;

  const successRate = progress.sent > 0
    ? Math.round((progress.success / progress.sent) * 100)
    : 0;

  return (
    <div className="bg-[#1a1d2e] border border-gray-800 rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <h2 className="text-sm font-semibold text-gray-300">Live Progress</h2>
        </div>
        <span className="text-xs mono text-gray-500">{percent}%</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0f1117] rounded-lg p-3 text-center">
          <p className="text-xl font-bold mono text-gray-200">
            {progress.sent}
            <span className="text-gray-600 text-sm">/{progress.total}</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">Sent</p>
        </div>
        <div className="bg-[#0f1117] rounded-lg p-3 text-center">
          <p className="text-xl font-bold mono text-emerald-400">
            {progress.success}
          </p>
          <p className="text-xs text-gray-600 mt-1">Success</p>
        </div>
        <div className="bg-[#0f1117] rounded-lg p-3 text-center">
          <p className="text-xl font-bold mono text-red-400">
            {progress.failed}
          </p>
          <p className="text-xs text-gray-600 mt-1">Failed</p>
        </div>
      </div>

      {progress.sent > 0 && (
        <p className="text-xs mono text-gray-600 mt-3 text-right">
          Success rate: {successRate}%
        </p>
      )}
    </div>
  );
}