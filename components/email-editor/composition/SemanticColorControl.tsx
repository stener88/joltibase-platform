/**
 * Semantic Color Control Component
 * 
 * Provides semantic color selection from design token palette.
 * Prevents off-brand colors and ensures accessibility.
 * 
 * TODO: Full implementation required
 * - Add color swatches with contrast ratios
 * - Show WCAG compliance badges
 * - Add color picker with brand palette only
 * - Integrate with semantic color tokens
 */

'use client';

import React from 'react';
import { getColorToken, type ColorKey } from '@/lib/email/design-tokens';

export interface SemanticColorControlProps {
  value: string;
  onChange: (color: string) => void;
  colorType: 'text' | 'background' | 'action';
  label?: string;
}

/**
 * Semantic color control component
 * Restricts colors to brand palette and shows semantic names
 */
export function SemanticColorControl({
  value,
  onChange,
  colorType,
  label = 'Color',
}: SemanticColorControlProps) {
  const colorOptions = {
    text: [
      { key: 'text.primary' as ColorKey, label: 'Primary', description: 'Main text' },
      { key: 'text.secondary' as ColorKey, label: 'Secondary', description: 'Supporting text' },
      { key: 'text.muted' as ColorKey, label: 'Muted', description: 'Subtle text' },
    ],
    background: [
      { key: 'background.default' as ColorKey, label: 'Default', description: 'White' },
      { key: 'background.alt' as ColorKey, label: 'Alternate', description: 'Light gray' },
      { key: 'background.subtle' as ColorKey, label: 'Subtle', description: 'Very light' },
    ],
    action: [
      { key: 'action.primary' as ColorKey, label: 'Primary', description: 'Main CTA' },
      { key: 'action.secondary' as ColorKey, label: 'Secondary', description: 'Alt CTA' },
      { key: 'action.success' as ColorKey, label: 'Success', description: 'Positive action' },
    ],
  };

  const options = colorOptions[colorType];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const colorValue = getColorToken(option.key);
          const isSelected = value === colorValue;
          
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(colorValue)}
              className={`
                p-3 rounded-md border-2 transition-all duration-200
                ${isSelected
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div 
                className="w-full h-8 rounded mb-2"
                style={{ backgroundColor: colorValue }}
              />
              <div className="text-xs font-medium text-gray-700">
                {option.label}
              </div>
              <div className="text-xs text-gray-500">
                {option.description}
              </div>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500">
        Brand colors ensure consistency and accessibility
      </p>
    </div>
  );
}

export default SemanticColorControl;

