export default function SchemaPreview({ schema }) {
  if (!schema) return null;

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs mono text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
            SCHEMA
          </span>
          <h2 className="text-sm font-semibold text-gray-700">
            Generated Schema
          </h2>
        </div>
        <span className="text-xs mono text-gray-500">
          {schema.record_count} records
        </span>
      </div>

      <div className="bg-blue-50 rounded-lg border border-blue-200 divide-y divide-blue-100">
        {schema.fields.map((field, idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-2.5">
            <span className="text-sm mono text-gray-700">{field.name}</span>
            <span className="text-xs mono text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
              {field.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
