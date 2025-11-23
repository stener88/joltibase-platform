/**
 * Inline Spacing Panel
 * 
 * Compact panel for editing spacing/layout properties, appears below FloatingToolbar
 */

'use client';

import { useState, useEffect } from 'react';
import { ElementDescriptor, getSpacingProperties } from '@/lib/email-v2/visual-edits/element-descriptor';
import { ColorPicker } from '@/components/email-editor/shared/ColorPicker';

interface InlineSpacingPanelProps {
  descriptor: ElementDescriptor;
  position: { x: number; y: number };
  onUpdate: (changes: Record<string, any>) => void;
}

export function InlineSpacingPanel({ descriptor, position, onUpdate }: InlineSpacingPanelProps) {
  const spacingProperties = getSpacingProperties(descriptor.elementType);
  const [values, setValues] = useState<Record<string, any>>(descriptor.currentSettings);

  // Update values when descriptor changes (e.g., selecting a different element)
  useEffect(() => {
    setValues(descriptor.currentSettings);
  }, [descriptor.elementId, descriptor.currentSettings]);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onUpdate({ [key]: value });
  };

  // Check which spacing properties are available
  const hasPadding = spacingProperties.some(p => p.key === 'padding');
  const hasWidth = spacingProperties.some(p => p.key === 'width');
  const hasHeight = spacingProperties.some(p => p.key === 'height');
  const hasGap = spacingProperties.some(p => p.key === 'gap');
  const hasColumns = spacingProperties.some(p => p.key === 'columns');

  if (spacingProperties.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 z-[99] p-3 min-w-[320px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="space-y-2.5">
        {/* Padding */}
        {hasPadding && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Padding</label>
            <input
              type="text"
              value={typeof values.padding === 'object' 
                ? `${values.padding.top || 0}px ${values.padding.right || 0}px ${values.padding.bottom || 0}px ${values.padding.left || 0}px`
                : values.padding || '0px'
              }
              onChange={(e) => {
                // Parse padding string like "20px 40px 20px 40px" into object
                const parts = e.target.value.split(/\s+/);
                if (parts.length === 4) {
                  handleChange('padding', {
                    top: parseInt(parts[0]) || 0,
                    right: parseInt(parts[1]) || 0,
                    bottom: parseInt(parts[2]) || 0,
                    left: parseInt(parts[3]) || 0,
                  });
                } else if (parts.length === 1) {
                  // Single value - apply to all sides
                  const val = parseInt(parts[0]) || 0;
                  handleChange('padding', {
                    top: val,
                    right: val,
                    bottom: val,
                    left: val,
                  });
                }
              }}
              placeholder="20px or 20px 40px 20px 40px"
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-48 focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
            />
          </div>
        )}

        {/* Width */}
        {hasWidth && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Width</label>
            <input
              type="text"
              value={values.width || ''}
              onChange={(e) => handleChange('width', e.target.value)}
              placeholder="200px, 100%, auto"
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-32 focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
            />
          </div>
        )}

        {/* Height */}
        {hasHeight && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Height</label>
            <input
              type="text"
              value={values.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="200px, auto"
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-32 focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
            />
          </div>
        )}

        {/* Gap */}
        {hasGap && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Gap</label>
            <input
              type="number"
              value={values.gap || 0}
              onChange={(e) => handleChange('gap', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-20 focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
            />
          </div>
        )}

        {/* Columns */}
        {hasColumns && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Columns</label>
            <input
              type="number"
              value={values.columns || 1}
              onChange={(e) => handleChange('columns', parseInt(e.target.value) || 1)}
              min="1"
              max="3"
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-20 focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

