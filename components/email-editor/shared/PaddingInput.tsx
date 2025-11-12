'use client';

import { Padding } from '@/lib/email/blocks/types';

interface PaddingInputProps {
  value: Padding;
  onChange: (value: Padding) => void;
  label?: string;
}

export function PaddingInput({ value, onChange, label }: PaddingInputProps) {
  const handleChange = (side: keyof Padding, val: string) => {
    const numValue = parseInt(val) || 0;
    onChange({
      ...value,
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
            value={value.top}
            onChange={(e) => handleChange('top', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bottom</label>
          <input
            type="number"
            value={value.bottom}
            onChange={(e) => handleChange('bottom', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Left</label>
          <input
            type="number"
            value={value.left}
            onChange={(e) => handleChange('left', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Right</label>
          <input
            type="number"
            value={value.right}
            onChange={(e) => handleChange('right', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          />
        </div>
      </div>
    </div>
  );
}

