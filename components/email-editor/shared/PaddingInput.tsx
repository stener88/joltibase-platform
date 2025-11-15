'use client';

import { Padding } from '@/lib/email/blocks/types';

interface PaddingInputProps {
  value: Padding;
  onChange: (value: Padding) => void;
  label?: string;
}

export function PaddingInput({ value, onChange, label }: PaddingInputProps) {
  // Provide default values if value is undefined
  const paddingValue = value || { top: 0, bottom: 0, left: 0, right: 0 };
  
  const handleChange = (side: keyof Padding, val: string) => {
    const numValue = parseInt(val) || 0;
    onChange({
      ...paddingValue,
      [side]: numValue,
    });
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Top</label>
          <input
            type="number"
            value={paddingValue.top}
            onChange={(e) => handleChange('top', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bottom</label>
          <input
            type="number"
            value={paddingValue.bottom}
            onChange={(e) => handleChange('bottom', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Left</label>
          <input
            type="number"
            value={paddingValue.left}
            onChange={(e) => handleChange('left', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Right</label>
          <input
            type="number"
            value={paddingValue.right}
            onChange={(e) => handleChange('right', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
      </div>
    </div>
  );
}

