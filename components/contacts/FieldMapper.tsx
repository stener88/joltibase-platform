'use client';

interface FieldMapperProps {
  headers: string[];
  previewData: string[][];
  mapping: Record<string, number>;
  onMappingChange: (mapping: Record<string, number>) => void;
}

const CONTACT_FIELDS = [
  { key: 'email', label: 'Email', required: true },
  { key: 'firstName', label: 'First Name', required: false },
  { key: 'lastName', label: 'Last Name', required: false },
  { key: 'tags', label: 'Tags (comma-separated)', required: false },
];

export function FieldMapper({ headers, previewData, mapping, onMappingChange }: FieldMapperProps) {
  const handleFieldChange = (fieldKey: string, columnIndex: number) => {
    const newMapping = { ...mapping };
    
    // Remove this field from any other column
    Object.keys(newMapping).forEach(key => {
      if (newMapping[key] === columnIndex && key !== fieldKey) {
        delete newMapping[key];
      }
    });
    
    if (columnIndex === -1) {
      delete newMapping[fieldKey];
    } else {
      newMapping[fieldKey] = columnIndex;
    }
    
    onMappingChange(newMapping);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Map CSV Columns</h3>
      <p className="text-sm text-gray-600 mb-6">
        Match your CSV columns to contact fields
      </p>

      <div className="space-y-4 mb-8">
        {CONTACT_FIELDS.map(field => (
          <div key={field.key} className="flex items-center gap-4">
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            <select
              value={mapping[field.key] ?? -1}
              onChange={(e) => handleFieldChange(field.key, parseInt(e.target.value))}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent bg-white"
            >
              <option value={-1}>Skip this field</option>
              {headers.map((header, idx) => (
                <option key={idx} value={idx}>
                  {header || `Column ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Preview Table */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Preview (first 5 rows)</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header || `Column ${idx + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.slice(0, 5).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Validation Warning */}
      {!mapping.email && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Email field is required. Please map a column to the Email field.
          </p>
        </div>
      )}
    </div>
  );
}

