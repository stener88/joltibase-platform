/**
 * Email Block System - Main Export
 * 
 * Exports all block types, utilities, and functions from the refactored modular structure
 */

// Types
export type {
  EmailBlock,
  BlockType,
  BlockSettings,
  BlockContent,
  BlockEmail,
  GlobalEmailSettings,
  // Individual block types
  LogoBlock,
  SpacerBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SocialLinksBlock,
  FooterBlock,
  // Helpers
  Padding,
  Alignment,
  TypedBlock,
  BlockInput,
  BlockUpdate,
} from './types';

export { isBlockType } from './types';

// Renderer
export {
  renderBlock,
  renderBlocksToEmail,
  renderBlocksToEmailSync,
  type RenderContext,
} from './renderers';

// Registry
export {
  createDefaultBlock,
  createLayoutBlock,
  createLinkBarBlock,
  createAddressBlock,
  generateBlockId,
  getDefaultBlockSettings,
  getDefaultBlockContent,
  getAllBlockDefinitions,
  getBlockDefinition,
  getBlocksByCategory,
  searchBlocks,
  getAIBlockRecommendations,
  getBlocksForUseCase,
  type BlockCategory,
  type BlockCategoryInfo,
  type BlockDefinition,
  type LayoutVariationCategory,
  type LayoutVariationDefinition,
  BLOCK_DEFINITIONS,
  BLOCK_CATEGORIES,
  LAYOUT_VARIATION_DEFINITIONS,
  getLayoutVariationsByCategory,
} from './registry';

// Validation (Zod schemas)
export {
  validateBlock,
  validateBlocks,
  validateBlockEmail,
  getValidationErrors,
  // Schemas
  EmailBlockSchema,
  BlockEmailSchema,
  GlobalEmailSettingsSchema,
  LogoBlockSchema,
  SpacerBlockSchema,
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
  DividerBlockSchema,
  SocialLinksBlockSchema,
  FooterBlockSchema,
} from './schemas';
