/**
 * Composition Score Badge
 * 
 * Displays floating composition quality score in the editor.
 * Shows overall score, grade, and category breakdown on hover.
 */

'use client';

import React, { useMemo } from 'react';
import type { EmailBlock } from '@/lib/email/blocks/types';
import { scoreComposition } from '@/lib/email/composition';

export interface CompositionScoreBadgeProps {
  blocks: EmailBlock[];
  onClick?: () => void;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

/**
 * Floating composition score badge
 * Shows quality score with visual indicator
 */
export function CompositionScoreBadge({
  blocks,
  onClick,
  position = 'bottom-right',
}: CompositionScoreBadgeProps) {
  // Calculate real composition score
  const score = useMemo(() => {
    try {
      return scoreComposition(blocks);
    } catch (error) {
      console.error('Composition scoring error:', error);
      // Return default safe values
      return {
        score: 0,
        grade: 'F',
        breakdown: {
          spacing: 0,
          hierarchy: 0,
          contrast: 0,
          balance: 0,
        },
        issues: ['Error calculating score'],
        passing: false,
      };
    }
  }, [blocks]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGradeEmoji = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return '🌟';
    if (grade === 'A-' || grade === 'B+' || grade === 'B') return '✨';
    if (grade === 'B-' || grade === 'C+' || grade === 'C') return '👍';
    return '⚠️';
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} z-50
        bg-white rounded-lg shadow-lg border border-gray-200
        px-4 py-3 min-w-[100px]
        hover:shadow-xl transition-all duration-200
        cursor-pointer group
      `}
    >
      {/* Score Display */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getScoreColor(score.score)}`} />
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {score.score}
          </div>
          <div className="text-xs text-gray-500 -mt-1">
            {score.grade} {getGradeEmoji(score.grade)}
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      <div className="
        absolute bottom-full right-0 mb-2
        hidden group-hover:block
        bg-gray-900 text-white rounded-lg shadow-xl
        p-3 text-xs
        w-48
      ">
        <div className="font-medium mb-2">Composition Breakdown</div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Spacing:</span>
            <span className="font-medium">{score.breakdown.spacing}/25</span>
          </div>
          <div className="flex justify-between">
            <span>Hierarchy:</span>
            <span className="font-medium">{score.breakdown.hierarchy}/25</span>
          </div>
          <div className="flex justify-between">
            <span>Contrast:</span>
            <span className="font-medium">{score.breakdown.contrast}/25</span>
          </div>
          <div className="flex justify-between">
            <span>Balance:</span>
            <span className="font-medium">{score.breakdown.balance}/25</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
          Click for detailed feedback
        </div>
      </div>
    </button>
  );
}

export default CompositionScoreBadge;

