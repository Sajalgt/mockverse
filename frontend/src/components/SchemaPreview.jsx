export default function SchemaPreview({ schema }) {
  if (!schema) return null;

  return (
    <div className="bg-[#1a1d2e] border border-gray-800 rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
            SCHEMA
          </span>
          <h2 className="text-sm font-semibold text-gray-300">
            Generated Schema
          </h2>
        </div>
        <span className="text-xs mono text-gray-500">
          {schema.record_count} records
        </span>
      </div>

      <div className="bg-[#0f1117] rounded-lg border border-gray-800 divide-y divide-gray-800">
        {schema.fields.map((field, idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-2.5">
            <span className="text-sm mono text-gray-200">{field.name}</span>
            <span className="text-xs mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              {field.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}