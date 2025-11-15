/**
 * Email Block System - Main Export
 * 
 * Exports all block types, utilities, and functions for Phase 4A
 */

// Types
export type {
  EmailBlock,
  BlockType,
  BlockSettings,
  BlockContent,
  BlockEmail,
  GlobalEmailSettings,
  // Individual block types (V2 base blocks)
  LogoBlock,
  SpacerBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SocialLinksBlock,
  FooterBlock,
  // V2 blocks (link-bar, address, layouts to be added later)
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
  type RenderContext,
} from './renderer';

// Registry
export {
  createDefaultBlock,
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
  BLOCK_DEFINITIONS,
  BLOCK_CATEGORIES,
} from './registry';

// Validation (Zod schemas)
export {
  validateBlock,
  validateBlocks,
  validateBlockEmail,
  getValidationErrors,
  // Schemas (V2 base blocks)
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
  // V2 blocks (link-bar, address, layouts to be added later)
} from './schemas';

