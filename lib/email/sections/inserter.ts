/**
 * Section Insertion Logic
 * 
 * Handles insertion of section templates into existing email blocks arrays.
 */

import type { EmailBlock } from '../blocks/types';
import { getSectionById } from './registry';
import { generateBlockId } from '../blocks/registry';

// ============================================================================
// Section Insertion
// ============================================================================

export interface InsertSectionResult {
  success: boolean;
  blocks?: EmailBlock[];
  insertedBlockIds?: string[];
  error?: string;
}

/**
 * Insert a section template into an existing blocks array at the specified position
 * 
 * @param sectionId - ID of the section template to insert
 * @param currentBlocks - Existing array of email blocks
 * @param insertPosition - Position where the section should be inserted (0-based)
 * @returns Result object with updated blocks array
 */
export function insertSection(
  sectionId: string,
  currentBlocks: EmailBlock[],
  insertPosition: number
): InsertSectionResult {
  // 1. Get the section template
  const section = getSectionById(sectionId);
  
  if (!section) {
    return {
      success: false,
      error: `Section template with ID "${sectionId}" not found`,
    };
  }
  
  // 2. Validate insert position
  if (insertPosition < 0 || insertPosition > currentBlocks.length) {
    return {
      success: false,
      error: `Invalid insert position: ${insertPosition}. Must be between 0 and ${currentBlocks.length}`,
    };
  }
  
  // 3. Clone section blocks with unique IDs
  const insertedBlockIds: string[] = [];
  const newBlocks = section.blocks.map((block, index) => {
    const newId = `${section.id}-${generateBlockId(block.type)}`;
    insertedBlockIds.push(newId);
    
    return {
      ...JSON.parse(JSON.stringify(block)), // Deep clone
      id: newId,
      position: insertPosition + index, // Temporarily assign position
    };
  });
  
  // 4. Insert new blocks and adjust positions
  const updatedBlocks = [
    // Blocks before insertion point (keep positions)
    ...currentBlocks.slice(0, insertPosition).map(block => ({
      ...block,
      position: block.position,
    })),
    // New blocks from section
    ...newBlocks,
    // Blocks after insertion point (shift positions)
    ...currentBlocks.slice(insertPosition).map(block => ({
      ...block,
      position: block.position + newBlocks.length,
    })),
  ];
  
  // 5. Renumber all positions to be sequential (0, 1, 2, ...)
  const finalBlocks = updatedBlocks.map((block, index) => ({
    ...block,
    position: index,
  }));
  
  return {
    success: true,
    blocks: finalBlocks,
    insertedBlockIds,
  };
}

/**
 * Insert a section at the position of a specific block
 * 
 * @param sectionId - ID of the section template to insert
 * @param currentBlocks - Existing array of email blocks
 * @param targetBlockId - ID of the block to insert the section before/after
 * @param position - Where to insert relative to target ('before' | 'after')
 * @returns Result object with updated blocks array
 */
export function insertSectionRelativeToBlock(
  sectionId: string,
  currentBlocks: EmailBlock[],
  targetBlockId: string,
  position: 'before' | 'after'
): InsertSectionResult {
  // Find the target block
  const targetIndex = currentBlocks.findIndex(block => block.id === targetBlockId);
  
  if (targetIndex === -1) {
    return {
      success: false,
      error: `Block with ID "${targetBlockId}" not found`,
    };
  }
  
  // Calculate insertion position
  const insertPosition = position === 'before' ? targetIndex : targetIndex + 1;
  
  // Use standard insertion
  return insertSection(sectionId, currentBlocks, insertPosition);
}

/**
 * Replace a block with a section template
 * 
 * @param sectionId - ID of the section template to insert
 * @param currentBlocks - Existing array of email blocks
 * @param targetBlockId - ID of the block to replace
 * @returns Result object with updated blocks array
 */
export function replaceBlockWithSection(
  sectionId: string,
  currentBlocks: EmailBlock[],
  targetBlockId: string
): InsertSectionResult {
  // Find the target block
  const targetIndex = currentBlocks.findIndex(block => block.id === targetBlockId);
  
  if (targetIndex === -1) {
    return {
      success: false,
      error: `Block with ID "${targetBlockId}" not found`,
    };
  }
  
  // Get the section template
  const section = getSectionById(sectionId);
  
  if (!section) {
    return {
      success: false,
      error: `Section template with ID "${sectionId}" not found`,
    };
  }
  
  // Clone section blocks with unique IDs
  const insertedBlockIds: string[] = [];
  const newBlocks = section.blocks.map((block, index) => {
    const newId = `${section.id}-${generateBlockId(block.type)}`;
    insertedBlockIds.push(newId);
    
    return {
      ...JSON.parse(JSON.stringify(block)), // Deep clone
      id: newId,
      position: targetIndex + index,
    };
  });
  
  // Replace the target block with new blocks
  const updatedBlocks = [
    ...currentBlocks.slice(0, targetIndex),
    ...newBlocks,
    ...currentBlocks.slice(targetIndex + 1).map(block => ({
      ...block,
      position: block.position + newBlocks.length - 1, // -1 because we removed one block
    })),
  ];
  
  // Renumber positions
  const finalBlocks = updatedBlocks.map((block, index) => ({
    ...block,
    position: index,
  }));
  
  return {
    success: true,
    blocks: finalBlocks,
    insertedBlockIds,
  };
}

/**
 * Append a section to the end of the blocks array (before footer if exists)
 * 
 * @param sectionId - ID of the section template to insert
 * @param currentBlocks - Existing array of email blocks
 * @returns Result object with updated blocks array
 */
export function appendSection(
  sectionId: string,
  currentBlocks: EmailBlock[]
): InsertSectionResult {
  // Find the footer block (if exists)
  const footerIndex = currentBlocks.findIndex(block => block.type === 'footer');
  
  // Insert before footer, or at the end if no footer
  const insertPosition = footerIndex !== -1 ? footerIndex : currentBlocks.length;
  
  return insertSection(sectionId, currentBlocks, insertPosition);
}

/**
 * Prepend a section to the beginning of the blocks array (after logo/spacer if exists)
 * 
 * @param sectionId - ID of the section template to insert
 * @param currentBlocks - Existing array of email blocks
 * @returns Result object with updated blocks array
 */
export function prependSection(
  sectionId: string,
  currentBlocks: EmailBlock[]
): InsertSectionResult {
  // Find the first non-logo, non-spacer block
  let insertPosition = 0;
  
  for (let i = 0; i < currentBlocks.length; i++) {
    const blockType = currentBlocks[i].type;
    if (blockType !== 'logo' && blockType !== 'spacer') {
      insertPosition = i;
      break;
    }
  }
  
  return insertSection(sectionId, currentBlocks, insertPosition);
}

