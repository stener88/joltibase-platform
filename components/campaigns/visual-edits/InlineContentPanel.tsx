/**
 * Inline Content Panel
 * 
 * Compact panel for editing element content, appears below FloatingToolbar
 */

'use client';

import { useState, useEffect } from 'react';
import { ElementDescriptor, getContentProperties } from '@/lib/email/visual-edits/element-descriptor';

interface InlineContentPanelProps {
  descriptor: ElementDescriptor;
  position: { x: number; y: number };
  onUpdate: (changes: Record<string, any>) => void;
}

export function InlineContentPanel({ descriptor, position, onUpdate }: InlineContentPanelProps) {
  const contentProperties = getContentProperties(descriptor.elementType);
  const [values, setValues] = useState<Record<string, any>>(descriptor.currentValue);

  // Update values when descriptor changes (e.g., selecting a different element)
  useEffect(() => {
    setValues(descriptor.currentValue);
  }, [descriptor.elementId, descriptor.currentValue]);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onUpdate({ [key]: value });
  };

  if (contentProperties.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 z-[99] p-3 min-w-[350px] max-w-[450px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="space-y-2.5">
        {contentProperties.map((prop) => (
          <div key={prop.key} className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">
              {prop.label}
            </label>
            
            {prop.type === 'text' && (
              <input
                type="text"
                value={values[prop.key] || ''}
                onChange={(e) => handleChange(prop.key, e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
              />
            )}
            
            {prop.type === 'textarea' && (
              <textarea
                value={values[prop.key] || ''}
                onChange={(e) => handleChange(prop.key, e.target.value)}
                rows={3}
                className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589] resize-none"
              />
            )}
            
            {prop.type === 'url' && (
              <input
                type="url"
                value={values[prop.key] || ''}
                onChange={(e) => handleChange(prop.key, e.target.value)}
                placeholder="https://example.com"
                className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

