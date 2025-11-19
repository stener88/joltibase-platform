/**
 * Content Panel
 * 
 * Panel for editing element content (text, URLs, etc.)
 */

'use client';

import { useState } from 'react';
import { ElementDescriptor, getContentProperties } from '@/lib/email/visual-edits/element-descriptor';

interface ContentPanelProps {
  descriptor: ElementDescriptor;
  onUpdate: (changes: Record<string, any>) => void;
  onClose: () => void;
}

export function ContentPanel({ descriptor, onUpdate, onClose }: ContentPanelProps) {
  const contentProperties = getContentProperties(descriptor.elementType);
  const [values, setValues] = useState<Record<string, any>>(descriptor.currentValue);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onUpdate({ [key]: value });
  };

  if (contentProperties.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No content properties available for this element.
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-[95] overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Content</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="p-4 space-y-4">
      {contentProperties.map((prop) => (
        <div key={prop.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {prop.label}
          </label>
          
          {prop.type === 'text' && (
            <input
              type="text"
              value={values[prop.key] || ''}
              onChange={(e) => handleChange(prop.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            />
          )}
          
          {prop.type === 'textarea' && (
            <textarea
              value={values[prop.key] || ''}
              onChange={(e) => handleChange(prop.key, e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            />
          )}
          
          {prop.type === 'url' && (
            <input
              type="url"
              value={values[prop.key] || ''}
              onChange={(e) => handleChange(prop.key, e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            />
          )}
        </div>
      ))}
      </div>
    </div>
  );
}

