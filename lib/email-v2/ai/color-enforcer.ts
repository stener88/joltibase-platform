/**
 * Color Enforcer
 * 
 * Ensures color consistency across email blocks by replacing
 * random/conflicting colors with the primary brand color
 */

import type { SemanticBlock } from './blocks';

/**
 * Enforce color consistency across email blocks
 * Replaces any random colors with primary color
 * 
 * @param blocks - Semantic blocks to process
 * @param primaryColor - Primary brand color (hex)
 * @returns Blocks with consistent color usage
 */
export function enforceColorConsistency(
  blocks: SemanticBlock[],
  primaryColor: string
): SemanticBlock[] {
  // Define neutral colors that are allowed
  const neutralColors = new Set([
    '#ffffff',  // white
    '#f9fafb',  // light gray
    '#000000',  // black
    '#6b7280',  // gray
    '#e5e7eb',  // border gray
  ]);
  
  return blocks.map(block => {
    // Color enforcement is now handled globally via settings
    // Individual blocks no longer have backgroundColor fields
    return block;
  });
}

