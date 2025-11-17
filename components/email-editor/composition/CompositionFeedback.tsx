/**
 * Composition Feedback Panel
 * 
 * Displays real-time composition validation and offers auto-fix actions.
 * Shows violations, quality score, and actionable improvements.
 */

'use client';

import React, { useMemo } from 'react';
import type { EmailBlock } from '@/lib/email/blocks/types';
import { defaultCompositionEngine, type RuleViolation } from '@/lib/email/composition';

export interface CompositionFeedbackProps {
  blocks: EmailBlock[];
  onAutoFix?: (blockId: string, ruleId: string) => void;
  onAutoFixAll?: () => void;
  onDismiss?: (violationId: string) => void;
}

/**
 * Composition feedback panel component
 * Shows violations and allows auto-fixing
 */
export function CompositionFeedback({
  blocks,
  onAutoFix,
  onAutoFixAll,
  onDismiss,
}: CompositionFeedbackProps) {
  // Validate blocks using composition engine
  const violations = useMemo<RuleViolation[]>(() => {
    try {
      return defaultCompositionEngine.validate(blocks);
    } catch (error) {
      console.error('Composition validation error:', error);
      return [];
    }
  }, [blocks]);

  const severityIcons = {
    error: '❌',
    warning: '⚠️',
    suggestion: '💡',
  };

  const severityColors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    suggestion: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  if (violations.length === 0) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <span className="text-xl">✅</span>
          <div>
            <div className="font-medium">Composition looks great!</div>
            <div className="text-sm">No issues found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">
          Composition Feedback ({violations.length})
        </h3>
        {violations.some(v => v.autoFixable) && (
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              if (onAutoFixAll) {
                onAutoFixAll();
              } else {
                violations.forEach(v => v.autoFixable && onAutoFix?.(v.blockId, v.ruleId));
              }
            }}
          >
            Fix All ({violations.filter(v => v.autoFixable).length})
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {violations.map((violation, index) => (
          <div
            key={`${violation.blockId}-${violation.ruleId}-${index}`}
            className={`p-3 border rounded-lg ${severityColors[violation.severity]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-lg">{severityIcons[violation.severity]}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{violation.message}</div>
                  <div className="text-xs mt-1 opacity-75">
                    Rule: {violation.ruleId} • Block: {violation.blockId.slice(0, 8)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                {violation.autoFixable && onAutoFix && (
                  <button
                    onClick={() => onAutoFix(violation.blockId, violation.ruleId)}
                    className="px-2 py-1 text-xs font-medium bg-white rounded hover:bg-gray-50"
                  >
                    Fix
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(`${violation.blockId}-${violation.ruleId}`)}
                    className="px-2 py-1 text-xs font-medium bg-white rounded hover:bg-gray-50"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompositionFeedback;

