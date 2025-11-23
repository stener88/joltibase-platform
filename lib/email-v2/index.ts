/**
 * Email V2 - Main Entry Point
 * 
 * React Email-based email generation system
 */

// Core types
export type {
  ComponentType,
  EmailComponent,
  GlobalEmailSettings,
  CampaignV2,
  SelectableElement,
  ComponentPropDocs,
  AIComponentResponse,
} from './types';

// Renderer
export {
  renderEmailComponent,
  renderTestEmail,
  validateComponentTree,
  type RenderOptions,
  type RenderResult,
} from './renderer';

// Component registry
export {
  COMPONENT_MAP,
  EDITABLE_COMPONENTS,
  CONTAINER_COMPONENTS,
  COMPONENT_PROP_DOCS,
  getComponentPropDocs,
  getEditableStyleProps,
  canHaveChildren,
  isEditable,
} from './components/registry';

// Template wrapper
export {
  createEmailWrapper,
  insertContentIntoWrapper,
  addPreviewToEmail,
  extractPreviewComponent,
  getMainContainer,
  isValidEmailWrapper,
} from './template-wrapper';

// AI generation (V2 Semantic)
export {
  generateEmailSemantic,
  generateSemanticBlocks,
  testSemanticGenerator,
  type GenerationOptions,
  type GenerationResult,
} from './ai/generator-v2';



// Semantic block types
export type {
  HeroBlock,
  FeaturesBlock,
  ContentBlock,
  TestimonialBlock,
  CtaBlock,
  FooterBlock,
  SemanticBlock,
  EmailContent,
} from './ai/blocks';

export {
  EmailContentSchema,
  SemanticBlockSchema,
  HeroBlockSchema,
  FeaturesBlockSchema,
  ContentBlockSchema,
  TestimonialBlockSchema,
  CtaBlockSchema,
  FooterBlockSchema,
} from './ai/blocks';

// AI schemas (request validation)
export {
  componentRefinementJsonSchema,
  GlobalEmailSettingsSchema,
  RefineComponentRequestSchema,
} from './ai/schemas';

// AI prompts (V2)
export {
  SEMANTIC_GENERATION_SYSTEM_PROMPT,
  buildSemanticGenerationPrompt,
  buildRefinementPrompt,
  buildEnhancedRefinementPrompt,
  COMPONENT_EDIT_PATTERNS,
  EXAMPLE_PROMPTS,
} from './ai/prompts-v2';

// Tree utilities
export {
  findComponentById,
  findComponentByPath,
  getComponentPath,
  getParentComponent,
  getParentPath,
  flattenComponentTree,
  updateComponentById,
  updateComponentByPath,
  deleteComponentById,
  getComponentDepth,
  getSiblings,
  getComponentIndex,
  moveComponent,
  duplicateComponent,
  canInsertComponent,
  insertComponent,
  getBreadcrumbs,
  countComponents,
  getTreeStats,
  type TreeStats,
} from './tree-utils';

