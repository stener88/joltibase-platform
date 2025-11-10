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
  // Individual block types
  LogoBlock,
  SpacerBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  HeroBlock,
  StatsBlock,
  TestimonialBlock,
  FeatureGridBlock,
  ComparisonBlock,
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
  // Schemas
  EmailBlockSchema,
  BlockEmailSchema,
  GlobalEmailSettingsSchema,
  LogoBlockSchema,
  SpacerBlockSchema,
  HeadingBlockSchema,
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
  DividerBlockSchema,
  HeroBlockSchema,
  StatsBlockSchema,
  TestimonialBlockSchema,
  FeatureGridBlockSchema,
  ComparisonBlockSchema,
  SocialLinksBlockSchema,
  FooterBlockSchema,
} from './schemas';

// Migration
export {
  sectionToBlock,
  contentToBlocks,
  blockToSection,
  blocksToContent,
  testSectionRoundTrip,
  testContentRoundTrip,
} from './migration';

// Testing utilities
export {
  testUtils,
  runAllBlockTests,
  generateSampleBlockEmail,
} from './test-blocks';

