/**
 * Semantic Spacing Control Component
 * 
 * Provides semantic spacing control for email editor.
 * Maps human-friendly terms (tight/balanced/relaxed) to design tokens.
 * 
 * TODO: Full implementation required
 * - Add visual previews for each spacing option
 * - Show px values alongside semantic names
 * - Add hover tooltips with token details
 * - Integrate with block settings state management
 */

'use client';

import React from 'react';
import { getSpacingToken, type SemanticSpacingKey } from '@/lib/email/design-tokens';

export interface SemanticSpacingControlProps {
  value: 'tight' | 'balanced' | 'relaxed';
  onChange: (value: 'tight' | 'balanced' | 'relaxed') => void;
  label?: string;
  showPixelValue?: boolean;
}

/**
 * Semantic spacing control component
 * Allows users to select spacing intent rather than pixel values
 */
export function SemanticSpacingControl({
  value,
  onChange,
  label = 'Spacing',
  showPixelValue = true,
}: SemanticSpacingControlProps) {
  const spacingOptions = [
    { value: 'tight' as const, label: 'Tight', token: 'content.tight' as SemanticSpacingKey },
    { value: 'balanced' as const, label: 'Balanced', token: 'content.balanced' as SemanticSpacingKey },
    { value: 'relaxed' as const, label: 'Relaxed', token: 'content.relaxed' as SemanticSpacingKey },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex gap-2">
        {spacingOptions.map((option) => {
          const pixelValue = getSpacingToken(option.token);
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium
                transition-colors duration-200
                ${isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <div>{option.label}</div>
              {showPixelValue && (
                <div className="text-xs opacity-75">{pixelValue}</div>
              )}
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500">
        Choose spacing density for this section
      </p>
    </div>
  );
}

// Export for use in settings panels
export default SemanticSpacingControl;

