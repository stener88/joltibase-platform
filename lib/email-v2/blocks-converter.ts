/**
 * Convert semantic blocks to EmailComponent tree
 * 
 * This is used lazily when the editor opens a V2 campaign
 * that was generated with pattern-based rendering
 */

import type { EmailComponent, GlobalEmailSettings } from './types';
import type { SemanticBlock } from './ai/blocks';
import { transformBlocksToEmail } from './ai/transforms';
import { createEmailWrapper, insertContentIntoWrapper, addPreviewToEmail } from './template-wrapper';

/**
 * Convert semantic blocks array to EmailComponent tree
 * 
 * @param blocks - Semantic blocks from AI generation
 * @param settings - Global email settings
 * @param previewText - Email preview text
 * @returns Complete EmailComponent tree ready for editor
 */
export function semanticBlocksToEmailComponent(
  blocks: SemanticBlock[],
  settings: GlobalEmailSettings,
  previewText?: string
): EmailComponent {
  console.log('[BlocksConverter] Converting', blocks.length, 'semantic blocks to EmailComponent tree');
  
  // Transform semantic blocks to EmailComponent sections
  const sections = transformBlocksToEmail(blocks, settings);
  
  console.log('[BlocksConverter] Generated', sections.length, 'sections');
  
  // Create wrapper structure (Html > Head > Body > Container)
  const wrapper = createEmailWrapper(settings);
  
  // Insert sections into wrapper
  let fullEmail = insertContentIntoWrapper(wrapper, sections);
  
  // Add preview text to Head if provided
  if (previewText) {
    fullEmail = addPreviewToEmail(fullEmail, previewText);
  }
  
  console.log('[BlocksConverter] Conversion complete');
  
  return fullEmail;
}

