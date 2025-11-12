'use client';

import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={localValue}
            onChange={handleChange}
            className="h-10 w-10 rounded-lg cursor-pointer border border-gray-200"
          />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        />
      </div>
    </div>
  );
}

