/**
 * Email Block Renderer - Main Module
 * 
 * Main entry point for rendering blocks to email-safe HTML.
 * Exports renderBlock and renderBlocksToEmail functions.
 * Now includes composition engine integration for automatic quality improvements.
 */

import type {
  EmailBlock,
  LogoBlock,
  SpacerBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SocialLinksBlock,
  FooterBlock,
  GlobalEmailSettings,
} from '../types';

import {
  renderLogoBlock,
  renderSpacerBlock,
  renderTextBlock,
  renderImageBlock,
  renderButtonBlock,
  renderDividerBlock,
} from './simple-blocks';

import {
  renderSocialLinksBlock,
  renderFooterBlock,
} from './social-blocks';

import {
  renderLayoutBlock,
} from './layout-blocks';

import {
  defaultCompositionEngine,
  scoreComposition,
  type CompositionOptions,
} from '../../composition';

// ============================================================================
// Type Exports
// ============================================================================

export interface RenderContext {
  globalSettings: GlobalEmailSettings;
  mergeTags?: Record<string, string>;
}

export interface RenderOptions {
  composition?: CompositionOptions;
  includeMetadata?: boolean;
}

// ============================================================================
// Main Block Renderer
// ============================================================================

/**
 * Render a single block to email-safe HTML
 */
export function renderBlock(block: EmailBlock, context: RenderContext): string {
  switch (block.type) {
    case 'logo':
      return renderLogoBlock(block as LogoBlock, context);
    case 'spacer':
      return renderSpacerBlock(block as SpacerBlock);
    case 'text':
      return renderTextBlock(block as TextBlock);
    case 'image':
      return renderImageBlock(block as ImageBlock);
    case 'button':
      return renderButtonBlock(block as ButtonBlock, context);
    case 'divider':
      return renderDividerBlock(block as DividerBlock);
    case 'social-links':
      return renderSocialLinksBlock(block as SocialLinksBlock);
    case 'footer':
      return renderFooterBlock(block as FooterBlock, context);
    case 'link-bar':
      return `<p style="padding: 20px; text-align: center; color: #666;">Link Bar - rendering coming soon</p>`;
    case 'address':
      return `<p style="padding: 20px; text-align: center; color: #666;">Address Block - rendering coming soon</p>`;
    case 'layouts':
      return renderLayoutBlock(block, context);
    default:
      return '';
  }
}

/**
 * Render array of blocks to complete email HTML
 * Now supports composition engine integration (opt-in)
 */
export async function renderBlocksToEmail(
  blocks: EmailBlock[],
  globalSettings: GlobalEmailSettings,
  mergeTags?: Record<string, string>,
  options?: RenderOptions
): Promise<string> {
  let processedBlocks = blocks;
  let compositionMetadata = '';
  
  // Apply composition rules if enabled
  if (options?.composition?.enabled !== false) {
    try {
      const result = await defaultCompositionEngine.execute(blocks, options?.composition);
      processedBlocks = result.blocks;
      
      // Generate metadata HTML comment
      if (options?.includeMetadata) {
        const score = scoreComposition(result.blocks);
        compositionMetadata = `
<!-- 
  Composition Metadata:
  - Applied Rules: ${result.appliedRules.join(', ')}
  - Corrections Made: ${result.correctionsMade}
  - Quality Score: ${score.score}/100 (${score.grade})
  - Violations: ${result.violations.length}
-->`;
      }
    } catch (error) {
      console.error('[Composition] Error applying rules:', error);
      // Fall back to original blocks if composition fails
      processedBlocks = blocks;
    }
  }
  
  const context: RenderContext = { globalSettings, mergeTags };
  
  // Sort blocks by position
  const sortedBlocks = [...processedBlocks].sort((a, b) => a.position - b.position);
  
  // Render all blocks
  const blocksHtml = sortedBlocks
    .map(block => renderBlock(block, context))
    .join('\n');
  
  // Wrap in email structure
  return wrapInEmailStructure(blocksHtml + compositionMetadata, globalSettings);
}

/**
 * Synchronous version of renderBlocksToEmail for backward compatibility
 * Does not apply composition rules
 */
export function renderBlocksToEmailSync(
  blocks: EmailBlock[],
  globalSettings: GlobalEmailSettings,
  mergeTags?: Record<string, string>
): string {
  const context: RenderContext = { globalSettings, mergeTags };
  
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
  
  // Render all blocks
  const blocksHtml = sortedBlocks
    .map(block => renderBlock(block, context))
    .join('\n');
  
  // Wrap in email structure
  return wrapInEmailStructure(blocksHtml, globalSettings);
}

// ============================================================================
// Email Structure Wrapper
// ============================================================================

/**
 * Wrap blocks in complete email HTML structure
 */
function wrapInEmailStructure(blocksHtml: string, globalSettings: GlobalEmailSettings): string {
  const { backgroundColor, contentBackgroundColor, maxWidth, fontFamily } = globalSettings;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=600">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      <o:AllowPNG/>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
    /* Fixed width layout - NO responsiveness */
    body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      min-width: 600px !important;
    }
    table {
      table-layout: fixed !important;
    }
    /* Prevent any responsive behavior */
    img {
      -ms-interpolation-mode: bicubic;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: ${fontFamily}; background-color: ${backgroundColor};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" class="desktop-padding" style="padding: 20px;">
        <!--[if mso]>
        <table align="center" width="${maxWidth}" cellpadding="0" cellspacing="0"><tr><td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: ${maxWidth}px; background-color: ${contentBackgroundColor};">
          ${blocksHtml}
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

