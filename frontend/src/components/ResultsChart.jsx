import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

export default function ResultsChart({ result }) {
  if (!result) return null;

  const chartData = [
    { name: 'Success', value: result.success },
    { name: 'Failed', value: result.failed },
  ];

  const successRate = result.totalSent > 0
    ? Math.round((result.success / result.totalSent) * 100)
    : 0;

  return (
    <div className="bg-[#1a1d2e] border border-gray-800 rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
            STEP 3
          </span>
          <h2 className="text-sm font-semibold text-gray-300">Test Results</h2>
        </div>
        <span className={`text-xs mono font-bold ${successRate >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
          {successRate}% success rate
        </span>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1d2e',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '12px',
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-2">
        {[
          { label: 'Total Sent', value: result.totalSent },
          { label: 'Avg Response', value: `${result.metrics.avgResponseTime}ms` },
          { label: 'P95 Response', value: `${result.metrics.p95ResponseTime}ms` },
          { label: 'Min Response', value: `${result.metrics.minResponseTime}ms` },
        ].map((metric) => (
          <div key={metric.label} className="bg-[#0f1117] rounded-lg p-3 text-center">
            <p className="text-sm font-bold mono text-gray-200">{metric.value}</p>
            <p className="text-xs text-gray-600 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}