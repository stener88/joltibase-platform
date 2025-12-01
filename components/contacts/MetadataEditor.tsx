'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MetadataEditorProps {
  metadata: Record<string, any>;
  onChange: (metadata: Record<string, any>) => void;
}

export function MetadataEditor({ metadata, onChange }: MetadataEditorProps) {
  const entries = Object.entries(metadata);

  const handleAdd = () => {
    const newKey = `field_${Date.now()}`;
    onChange({ ...metadata, [newKey]: '' });
  };

  const handleRemove = (key: string) => {
    const newMetadata = { ...metadata };
    delete newMetadata[key];
    onChange(newMetadata);
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (newKey === oldKey) return;
    
    const newMetadata = { ...metadata };
    newMetadata[newKey] = newMetadata[oldKey];
    delete newMetadata[oldKey];
    onChange(newMetadata);
  };

  const handleValueChange = (key: string, value: string) => {
    onChange({ ...metadata, [key]: value });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Custom Fields
      </label>
      
      <div className="space-y-3">
        {entries.map(([key, value], idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => handleKeyChange(key, e.target.value)}
              placeholder="Field name"
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(key, e.target.value)}
              placeholder="Field value"
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => handleRemove(key)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border-2 border-dashed border-border text-muted-foreground rounded-lg hover:border-[#1a1aff] hover:text-[#1a1aff] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add custom field
        </button>
      </div>
    </div>
  );
}

