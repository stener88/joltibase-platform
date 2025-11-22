/**
 * Convert semantic blocks to EmailComponent tree
 * 
 * ⚠️ SERVER-SIDE ONLY: Uses Node.js fs module via template engine
 * 
 * This is used server-side when generating campaigns or when
 * server components need to convert semantic blocks.
 * 
 * For client components, the EmailComponent tree should be passed
 * from the server (e.g., from the API or server component props)
 */

import type { EmailComponent, GlobalEmailSettings } from './types';
import type { SemanticBlock } from './ai/blocks';
import { transformBlocksToEmail } from './ai/transforms';
import { createEmailWrapper, insertContentIntoWrapper, addPreviewToEmail } from './template-wrapper';

/**
 * Convert semantic blocks array to EmailComponent tree
 * 
 * ⚠️ SERVER-SIDE ONLY
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
  // Ensure we're running server-side
  if (typeof window !== 'undefined') {
    throw new Error(
      '[BlocksConverter] semanticBlocksToEmailComponent can only be called server-side. ' +
      'The EmailComponent tree should be generated on the server and passed to the client.'
    );
  }
  
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

