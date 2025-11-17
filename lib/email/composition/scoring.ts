/**
 * Composition Quality Scoring System
 * 
 * Evaluates email composition quality based on spacing, hierarchy,
 * contrast, and balance. Scores range from 0-100.
 */

import type { EmailBlock, Padding } from '../blocks/types';
import type { RuleViolation } from './rules';
import { CompositionEngine } from './engine';
import { designTokens, pxToNumber } from '../design-tokens';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface QualityScore {
  /** Overall composition score (0-100) */
  score: number;
  /** Breakdown by category (each 0-25 points) */
  breakdown: {
    spacing: number;    // 0-25 points
    hierarchy: number;  // 0-25 points
    contrast: number;   // 0-25 points
    balance: number;    // 0-25 points
  };
  /** Issues found */
  issues: string[];
  /** Grade (A+ to F) */
  grade: string;
  /** Pass/fail status */
  passing: boolean;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  issues: string[];
  percentage: number;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate overall composition quality score
 */
export function scoreComposition(blocks: EmailBlock[]): QualityScore {
  const spacingScore = scoreSpacing(blocks);
  const hierarchyScore = scoreHierarchy(blocks);
  const contrastScore = scoreContrast(blocks);
  const balanceScore = scoreBalance(blocks);
  
  const totalScore = 
    spacingScore.score + 
    hierarchyScore.score + 
    contrastScore.score + 
    balanceScore.score;
  
  const allIssues = [
    ...spacingScore.issues,
    ...hierarchyScore.issues,
    ...contrastScore.issues,
    ...balanceScore.issues,
  ];
  
  return {
    score: Math.round(totalScore),
    breakdown: {
      spacing: Math.round(spacingScore.score),
      hierarchy: Math.round(hierarchyScore.score),
      contrast: Math.round(contrastScore.score),
      balance: Math.round(balanceScore.score),
    },
    issues: allIssues,
    grade: calculateGrade(totalScore),
    passing: totalScore >= 70,
  };
}

/**
 * Score spacing quality (0-25 points)
 * Checks: 8px grid alignment, white space ratio, consistency
 */
function scoreSpacing(blocks: EmailBlock[]): CategoryScore {
  let score = 25;
  const issues: string[] = [];
  
  // Get all spacing values
  const spacingValues: number[] = [];
  
  for (const block of blocks) {
    if (block.settings?.padding) {
      const padding = block.settings.padding as Padding;
      spacingValues.push(padding.top, padding.right, padding.bottom, padding.left);
    }
    
    if (block.type === 'spacer' && 'height' in block.settings) {
      spacingValues.push(block.settings.height as number);
    }
  }
  
  if (spacingValues.length === 0) {
    return { score, maxScore: 25, issues, percentage: 100 };
  }
  
  // Check 8px grid alignment
  const offGrid = spacingValues.filter(v => v % 8 !== 0);
  if (offGrid.length > 0) {
    const offGridPercentage = offGrid.length / spacingValues.length;
    score -= offGridPercentage * 10; // Max -10 points
    issues.push(`${(offGridPercentage * 100).toFixed(0)}% of spacing values off 8px grid`);
  }
  
  // Check spacing consistency (variance)
  const mean = spacingValues.reduce((a, b) => a + b, 0) / spacingValues.length;
  const variance = spacingValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / spacingValues.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  if (coefficientOfVariation > 0.5) {
    score -= 5;
    issues.push('Inconsistent spacing throughout email');
  }
  
  // Check minimum spacing (shouldn't be too cramped)
  const minSpacing = Math.min(...spacingValues.filter(v => v > 0));
  if (minSpacing < 8) {
    score -= 5;
    issues.push(`Minimum spacing too tight (${minSpacing}px)`);
  }
  
  // Check white space in layout blocks
  const layoutBlocks = blocks.filter(b => b.type === 'layouts');
  for (const block of layoutBlocks) {
    if (block.settings?.padding) {
      const padding = block.settings.padding as Padding;
      const totalPadding = padding.top + padding.bottom + padding.left + padding.right;
      
      if (totalPadding < 60) {
        score -= 3;
        issues.push(`Layout block has insufficient padding (${totalPadding}px)`);
      }
    }
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 25,
    issues,
    percentage: (Math.max(0, score) / 25) * 100,
  };
}

/**
 * Score typography hierarchy (0-25 points)
 * Checks: size ratios, weight contrast, line height
 */
function scoreHierarchy(blocks: EmailBlock[]): CategoryScore {
  let score = 25;
  const issues: string[] = [];
  
  const bodySize = pxToNumber(designTokens.primitives.typography.fontSizes.base);
  const minRatio = 1.5;
  
  // Check text blocks
  const textBlocks = blocks.filter(b => b.type === 'text');
  for (const block of textBlocks) {
    const fontSize = pxToNumber(block.settings?.fontSize as string || '16px');
    const fontWeight = block.settings?.fontWeight as number || 400;
    
    // If it's a heading (weight >= 600), check size ratio
    if (fontWeight >= 600) {
      const ratio = fontSize / bodySize;
      if (ratio < minRatio) {
        score -= 5;
        issues.push(`Heading size ratio too low: ${ratio.toFixed(2)}:1 (minimum: ${minRatio}:1)`);
      }
    }
  }
  
  // Check layout blocks with titles
  const layoutBlocks = blocks.filter(b => b.type === 'layouts');
  for (const block of layoutBlocks) {
    if (block.settings?.titleFontSize) {
      const titleSize = pxToNumber(block.settings.titleFontSize as string);
      const ratio = titleSize / bodySize;
      
      if (ratio < minRatio) {
        score -= 5;
        issues.push(`Layout title size ratio too low: ${ratio.toFixed(2)}:1`);
      }
    }
  }
  
  // Check for visual hierarchy presence
  const hasDifferentSizes = textBlocks.some(b => {
    const size = pxToNumber(b.settings?.fontSize as string || '16px');
    return Math.abs(size - bodySize) > 4;
  });
  
  if (!hasDifferentSizes && textBlocks.length > 2) {
    score -= 10;
    issues.push('No clear typography hierarchy detected');
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 25,
    issues,
    percentage: (Math.max(0, score) / 25) * 100,
  };
}

/**
 * Score color contrast (0-25 points)
 * Checks: WCAG compliance, contrast ratios
 */
function scoreContrast(blocks: EmailBlock[]): CategoryScore {
  let score = 25;
  const issues: string[] = [];
  const minContrast = 4.5; // WCAG AA for normal text
  
  // Simple contrast calculation helper
  const calculateContrast = (fg: string, bg: string): number => {
    // Simplified contrast calculation (real implementation in rules.ts)
    // For scoring purposes, we'll use a simplified check
    
    // If colors are very similar, contrast is poor
    if (fg === bg) return 1;
    
    // Basic luminance check
    const getLuma = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    };
    
    const fgLuma = getLuma(fg);
    const bgLuma = bg && bg !== 'transparent' ? getLuma(bg) : 1;
    
    const lighter = Math.max(fgLuma, bgLuma);
    const darker = Math.min(fgLuma, bgLuma);
    
    return (lighter + 0.05) / (darker + 0.05);
  };
  
  // Check text blocks
  const textBlocks = blocks.filter(b => 
    b.type === 'text' || b.type === 'button' || b.type === 'layouts'
  );
  
  for (const block of textBlocks) {
    const textColor = block.settings?.color as string;
    const bgColor = block.settings?.backgroundColor as string || '#ffffff';
    
    if (textColor && bgColor && bgColor !== 'transparent') {
      try {
        const contrast = calculateContrast(textColor, bgColor);
        
        if (contrast < minContrast) {
          score -= 10;
          issues.push(`Low contrast: ${contrast.toFixed(2)}:1 (minimum: ${minContrast}:1)`);
        } else if (contrast < 7) {
          // Good but not AAA
          score -= 2;
        }
      } catch (e) {
        // Invalid color format
      }
    }
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 25,
    issues,
    percentage: (Math.max(0, score) / 25) * 100,
  };
}

/**
 * Score balance and composition (0-25 points)
 * Checks: visual weight distribution, alignment consistency
 */
function scoreBalance(blocks: EmailBlock[]): CategoryScore {
  let score = 25;
  const issues: string[] = [];
  
  // Check alignment consistency
  const alignments = blocks
    .filter(b => b.settings?.align)
    .map(b => b.settings?.align);
  
  const uniqueAlignments = new Set(alignments);
  if (uniqueAlignments.size > 3) {
    score -= 5;
    issues.push(`Too many different alignments (${uniqueAlignments.size})`);
  }
  
  // Check block count (too few or too many)
  if (blocks.length < 3) {
    score -= 5;
    issues.push('Email has too few content blocks');
  } else if (blocks.length > 20) {
    score -= 5;
    issues.push('Email has too many blocks (overwhelming)');
  }
  
  // Check for visual variety
  const blockTypes = new Set(blocks.map(b => b.type));
  if (blockTypes.size < 3 && blocks.length > 5) {
    score -= 5;
    issues.push('Limited block type variety');
  }
  
  // Check spacing between sections
  const spacers = blocks.filter(b => b.type === 'spacer');
  if (spacers.length === 0 && blocks.length > 5) {
    score -= 3;
    issues.push('No spacers between major sections');
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 25,
    issues,
    percentage: (Math.max(0, score) / 25) * 100,
  };
}

/**
 * Calculate letter grade from score
 */
function calculateGrade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

// ============================================================================
// Enhanced Scoring with Violations
// ============================================================================

/**
 * Score composition using rule violations
 * More accurate than heuristic scoring
 */
export function scoreCompositionWithViolations(
  blocks: EmailBlock[],
  violations: RuleViolation[]
): QualityScore {
  // Start with perfect score
  let score = 100;
  const issues: string[] = [];
  
  // Deduct points based on violation severity
  for (const violation of violations) {
    switch (violation.severity) {
      case 'error':
        score -= 10;
        issues.push(violation.message);
        break;
      case 'warning':
        score -= 5;
        issues.push(violation.message);
        break;
      case 'suggestion':
        score -= 2;
        issues.push(violation.message);
        break;
    }
  }
  
  // Get category breakdown from heuristic scoring
  const heuristicScore = scoreComposition(blocks);
  
  return {
    score: Math.max(0, Math.round(score)),
    breakdown: heuristicScore.breakdown,
    issues,
    grade: calculateGrade(Math.max(0, score)),
    passing: score >= 70,
  };
}

// ============================================================================
// Scoring Utilities
// ============================================================================

/**
 * Compare before/after scores
 */
export function compareScores(before: QualityScore, after: QualityScore): {
  improvement: number;
  improvedCategories: string[];
  summary: string;
} {
  const improvement = after.score - before.score;
  const improvedCategories: string[] = [];
  
  if (after.breakdown.spacing > before.breakdown.spacing) {
    improvedCategories.push('spacing');
  }
  if (after.breakdown.hierarchy > before.breakdown.hierarchy) {
    improvedCategories.push('hierarchy');
  }
  if (after.breakdown.contrast > before.breakdown.contrast) {
    improvedCategories.push('contrast');
  }
  if (after.breakdown.balance > before.breakdown.balance) {
    improvedCategories.push('balance');
  }
  
  let summary = '';
  if (improvement > 0) {
    summary = `Improved by ${improvement} points (${improvedCategories.join(', ')})`;
  } else if (improvement < 0) {
    summary = `Decreased by ${Math.abs(improvement)} points`;
  } else {
    summary = 'No change';
  }
  
  return {
    improvement,
    improvedCategories,
    summary,
  };
}

/**
 * Get scoring recommendations
 */
export function getScoringRecommendations(score: QualityScore): string[] {
  const recommendations: string[] = [];
  
  if (score.breakdown.spacing < 20) {
    recommendations.push('Align spacing to 8px grid for better visual rhythm');
    recommendations.push('Add more white space between sections');
  }
  
  if (score.breakdown.hierarchy < 20) {
    recommendations.push('Increase heading sizes for clearer hierarchy');
    recommendations.push('Use font weights to establish visual importance');
  }
  
  if (score.breakdown.contrast < 20) {
    recommendations.push('Darken text colors to meet WCAG AA standards');
    recommendations.push('Ensure 4.5:1 contrast ratio for all text');
  }
  
  if (score.breakdown.balance < 20) {
    recommendations.push('Use consistent alignment throughout');
    recommendations.push('Add variety with different block types');
  }
  
  return recommendations;
}

// ============================================================================
// Export Default Scorer
// ============================================================================

/**
 * Quick score function with default settings
 */
export function quickScore(blocks: EmailBlock[]): number {
  return scoreComposition(blocks).score;
}

