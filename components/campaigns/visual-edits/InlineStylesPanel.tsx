/**
 * Inline Styles Panel
 * 
 * Compact panel for editing element styles, appears below FloatingToolbar
 */

'use client';

import { useState, useEffect } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ElementDescriptor, getStyleProperties } from '@/lib/email/visual-edits/element-descriptor';
import { ColorPicker } from '@/components/email-editor/shared/ColorPicker';

interface InlineStylesPanelProps {
  descriptor: ElementDescriptor;
  position: { x: number; y: number };
  onUpdate: (changes: Record<string, any>) => void;
}

const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '30px', value: '30px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
  { label: '60px', value: '60px' },
  { label: '72px', value: '72px' },
];

const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
];

const FONT_FAMILIES = [
  { label: 'System UI', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier', value: 'Courier, monospace' },
];

export function InlineStylesPanel({ descriptor, position, onUpdate }: InlineStylesPanelProps) {
  const styleProperties = getStyleProperties(descriptor.elementType);
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

  // Check which style properties are available
  const hasFontSize = styleProperties.some(p => p.key === 'fontSize');
  const hasFontWeight = styleProperties.some(p => p.key === 'fontWeight');
  const hasFontFamily = styleProperties.some(p => p.key === 'fontFamily');
  const hasTextColor = styleProperties.some(p => p.key === 'textColor');
  const hasBackgroundColor = styleProperties.some(p => p.key === 'backgroundColor');
  const hasAlign = styleProperties.some(p => p.key === 'align');

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
        {/* Font Size */}
        {hasFontSize && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Font size</label>
            <select
              value={values.fontSize || '16px'}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e9a589] cursor-pointer"
            >
              {FONT_SIZES.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Font Weight */}
        {hasFontWeight && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Font weight</label>
            <select
              value={values.fontWeight || '400'}
              onChange={(e) => handleChange('fontWeight', e.target.value)}
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e9a589] cursor-pointer"
            >
              {FONT_WEIGHTS.map(weight => (
                <option key={weight.value} value={weight.value}>{weight.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Font Family */}
        {hasFontFamily && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Font family</label>
            <select
              value={values.fontFamily || FONT_FAMILIES[0].value}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="px-2.5 py-1 bg-[#3d3d3d] border border-gray-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e9a589] cursor-pointer"
            >
              {FONT_FAMILIES.map(family => (
                <option key={family.value} value={family.value}>{family.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Text Color (for buttons) */}
        {hasTextColor && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Text Color</label>
            <ColorPicker
              value={values.textColor || '#ffffff'}
              onChange={(color) => handleChange('textColor', color)}
            />
          </div>
        )}

        {/* Background Color */}
        {hasBackgroundColor && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">
              {descriptor.elementType === 'button' ? 'Button Color' : 'Background'}
            </label>
            <ColorPicker
              value={values.backgroundColor || '#ffffff'}
              onChange={(color) => handleChange('backgroundColor', color)}
            />
          </div>
        )}

        {/* Text Align */}
        {hasAlign && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Text align</label>
            <div className="flex gap-0.5">
              <button
                onClick={() => handleChange('align', 'left')}
                className={`p-1.5 rounded transition-colors ${
                  values.align === 'left' || !values.align
                    ? 'bg-[#e9a589] text-white'
                    : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleChange('align', 'center')}
                className={`p-1.5 rounded transition-colors ${
                  values.align === 'center'
                    ? 'bg-[#e9a589] text-white'
                    : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleChange('align', 'right')}
                className={`p-1.5 rounded transition-colors ${
                  values.align === 'right'
                    ? 'bg-[#e9a589] text-white'
                    : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleChange('align', 'justify')}
                className={`p-1.5 rounded transition-colors ${
                  values.align === 'justify'
                    ? 'bg-[#e9a589] text-white'
                    : 'bg-[#3d3d3d] text-gray-400 hover:text-white'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

