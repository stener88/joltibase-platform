/**
 * V2 Styles Panel
 * 
 * Manual controls for editing V2 component style properties
 * Works with component-descriptor properties
 */

'use client';

import { useState, useEffect } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import type { EmailComponent } from '@/lib/email-v2/types';
import { getPropertiesByCategory } from '@/lib/email-v2/component-descriptor';

interface V2StylesPanelProps {
  component: EmailComponent;
  position: { x: number; y: number };
  onUpdate: (updates: { props?: Record<string, any> }) => void;
  onLivePreview?: (updates: any) => void; // NEW: For live preview without React re-renders
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
];

export function V2StylesPanel({ component, position, onUpdate, onLivePreview }: V2StylesPanelProps) {
  const styleProperties = getPropertiesByCategory(component.component, 'style');
  const [values, setValues] = useState<Record<string, any>>(component.props?.style || {});

  useEffect(() => {
    setValues(component.props?.style || {});
  }, [component.id, JSON.stringify(component.props?.style)]);

  const handleChange = (key: string, value: any) => {
    const newStyleValues = { ...values, [key]: value };
    setValues(newStyleValues);
    
    // Send live preview instead of onUpdate (prevents iframe reload)
    if (onLivePreview) {
      onLivePreview({ [key]: value });
    }
    
    // Don't call onUpdate here - only on Save button
  };

  if (styleProperties.length === 0) {
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
        {styleProperties.map((prop) => {
          const key = prop.key.replace('style.', '');
          const currentValue = values[key] || prop.defaultValue || '';
          
          return (
            <div key={prop.key}>
              {/* Font Size */}
              {prop.type === 'fontSize' && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">{prop.label}</label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                  >
                    {FONT_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Font Weight */}
              {prop.type === 'fontWeight' && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">{prop.label}</label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                  >
                    {FONT_WEIGHTS.map(weight => (
                      <option key={weight.value} value={weight.value}>{weight.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color */}
              {prop.type === 'color' && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">{prop.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentValue || '#000000'}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                    />
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                </div>
              )}

              {/* Text Alignment */}
              {prop.type === 'alignment' && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">{prop.label}</label>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleChange(key, 'left')}
                      className={`p-1.5 rounded transition-colors ${
                        currentValue === 'left' || !currentValue
                          ? 'bg-violet-600 text-white'
                          : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleChange(key, 'center')}
                      className={`p-1.5 rounded transition-colors ${
                        currentValue === 'center'
                          ? 'bg-violet-600 text-white'
                          : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                      }`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleChange(key, 'right')}
                      className={`p-1.5 rounded transition-colors ${
                        currentValue === 'right'
                          ? 'bg-violet-600 text-white'
                          : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                      }`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleChange(key, 'justify')}
                      className={`p-1.5 rounded transition-colors ${
                        currentValue === 'justify'
                          ? 'bg-violet-600 text-white'
                          : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                      }`}
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Border Radius */}
              {prop.type === 'borderRadius' && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">{prop.label}</label>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder="8px"
                    className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-24 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              )}

              {/* Select dropdown */}
              {prop.type === 'select' && prop.options && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">{prop.label}</label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                  >
                    {prop.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Generic text input */}
              {prop.type === 'text' && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">{prop.label}</label>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white w-32 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

