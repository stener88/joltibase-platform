'use client';

import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Alignment } from '@/lib/email/blocks/types';

interface AlignmentPickerProps {
  value: Alignment;
  onChange: (value: Alignment) => void;
  label?: string;
}

export function AlignmentPicker({ value, onChange, label }: AlignmentPickerProps) {
  const alignments: { value: Alignment; icon: typeof AlignLeft; label: string }[] = [
    { value: 'left', icon: AlignLeft, label: 'Left' },
    { value: 'center', icon: AlignCenter, label: 'Center' },
    { value: 'right', icon: AlignRight, label: 'Right' },
  ];

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex gap-1">
        {alignments.map(({ value: alignValue, icon: Icon, label: alignLabel }) => (
          <button
            key={alignValue}
            type="button"
            onClick={() => onChange(alignValue)}
            className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
              value === alignValue
                ? 'border-[#1a1aff] bg-[#1a1aff]/5 text-[#1a1aff]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
            title={alignLabel}
          >
            <Icon className="w-4 h-4 mx-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}

