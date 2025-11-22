/**
 * V2 Spacing Panel
 * 
 * Manual controls for editing V2 component spacing properties
 * Works with component-descriptor properties
 */

'use client';

import { useState, useEffect } from 'react';
import type { EmailComponent } from '@/lib/email-v2/types';
import { getPropertiesByCategory } from '@/lib/email-v2/component-descriptor';

interface V2SpacingPanelProps {
  component: EmailComponent;
  position: { x: number; y: number };
  onUpdate: (updates: { props?: Record<string, any> }) => void;
  onLivePreview?: (updates: any) => void; // NEW: For live preview without React re-renders
}

// Helper function to extract spacing properties from style
function extractSpacing(style: Record<string, any> = {}): Record<string, any> {
  // Spacing properties are typically: padding, margin, width, height, etc.
  // These are already in the style object, so we just return it
  return { ...style };
}

export function V2SpacingPanel({ component, position, onUpdate, onLivePreview }: V2SpacingPanelProps) {
  const spacingProperties = getPropertiesByCategory(component.component, 'spacing');
  const [values, setValues] = useState<Record<string, any>>(
    extractSpacing(component.props?.style || {})
  );

  useEffect(() => {
    setValues(extractSpacing(component.props?.style || {}));
  }, [component.id, JSON.stringify(component.props?.style)]);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    
    // Send live preview instead of onUpdate (prevents iframe reload)
    if (onLivePreview) {
      const spacingUpdates: Record<string, any> = {};
      spacingUpdates[key] = value;
      onLivePreview(spacingUpdates);
    }
    
    // Don't call onUpdate here - only on Save button
  };

  if (spacingProperties.length === 0) {
    return null;
  }

  return (
    <div
      data-manual-panel
      className="fixed bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 z-[99] p-3 min-w-[320px] max-w-[400px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="space-y-2.5">
        {spacingProperties.map((prop) => {
          const key = prop.key.replace('style.', '').replace('props.', '');
          const currentValue = values[key] || prop.defaultValue || '';
          
          return (
            <div key={prop.key} className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-300">{prop.label}</label>
              
              {/* Padding/Margin - special handling */}
              {(prop.type === 'padding' || prop.type === 'margin') && (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="80px 40px 80px 40px"
                  className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-48 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              )}

              {/* Number input */}
              {prop.type === 'number' && (
                <input
                  type="number"
                  value={parseInt(currentValue) || 0}
                  onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                  className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-20 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              )}

              {/* Text input for width/height/etc */}
              {prop.type === 'text' && (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="200px, 100%, auto"
                  className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-32 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              )}

              {/* Select for options */}
              {prop.type === 'select' && prop.options && (
                <select
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                >
                  {prop.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

