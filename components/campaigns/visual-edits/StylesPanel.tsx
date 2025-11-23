/**
 * Styles Panel
 * 
 * Panel for editing element styles (colors, fonts, alignment, padding)
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ElementDescriptor, getStyleProperties } from '@/lib/email-v2/visual-edits/element-descriptor';
import { ColorPicker } from '@/components/email-editor/shared/ColorPicker';
import { AlignmentPicker } from '@/components/email-editor/shared/AlignmentPicker';
import { PaddingInput } from '@/components/email-editor/shared/PaddingInput';

interface StylesPanelProps {
  descriptor: ElementDescriptor;
  onUpdate: (changes: Record<string, any>) => void;
  onClose: () => void;
  onSelectParent?: () => void;
}

export function StylesPanel({ descriptor, onUpdate, onClose, onSelectParent }: StylesPanelProps) {
  const styleProperties = getStyleProperties(descriptor.elementType);
  const [values, setValues] = useState<Record<string, any>>(descriptor.currentSettings);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onUpdate({ [key]: value });
  };

  if (styleProperties.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No style properties available for this element.
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-[95] overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Styles</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="p-4 space-y-4">
      {styleProperties.map((prop) => (
        <div key={prop.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {prop.label}
          </label>
          
          {prop.type === 'color' && (
            <ColorPicker
              value={values[prop.key] || '#000000'}
              onChange={(value) => handleChange(prop.key, value)}
            />
          )}
          
          {prop.type === 'fontSize' && (
            <select
              value={values[prop.key] || '16px'}
              onChange={(e) => handleChange(prop.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            >
              <option value="12px">12px - Small</option>
              <option value="14px">14px</option>
              <option value="16px">16px - Default</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px - Large</option>
              <option value="36px">36px</option>
              <option value="42px">42px - XL</option>
              <option value="48px">48px</option>
            </select>
          )}
          
          {prop.type === 'fontWeight' && (
            <select
              value={values[prop.key] || '400'}
              onChange={(e) => handleChange(prop.key, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            >
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          )}
          
          {prop.type === 'alignment' && (
            <AlignmentPicker
              value={values[prop.key] || 'left'}
              onChange={(value) => handleChange(prop.key, value)}
            />
          )}
          
          {prop.type === 'padding' && (
            <PaddingInput
              value={values[prop.key] || { top: 0, right: 0, bottom: 0, left: 0 }}
              onChange={(value) => handleChange(prop.key, value)}
            />
          )}
          
          {prop.type === 'text' && (
            <input
              type="text"
              value={values[prop.key] || ''}
              onChange={(e) => handleChange(prop.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            />
          )}
          
          {prop.type === 'number' && (
            <input
              type="number"
              value={values[prop.key] || 0}
              onChange={(e) => handleChange(prop.key, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]"
            />
          )}
        </div>
      ))}
      
      {/* Advanced Section */}
      {onSelectParent && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span>Advanced</span>
            {advancedOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {advancedOpen && (
            <div className="mt-3 space-y-2">
              <button
                onClick={onSelectParent}
                className="w-full px-3 py-2 text-sm text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                Select parent block
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

