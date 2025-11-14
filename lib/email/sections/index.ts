/**
 * Email Sections Module
 * 
 * Exports all section-related functionality and automatically registers templates.
 */

// Types
export type {
  SectionTemplate,
  SectionCategory,
  SectionFilter,
  SectionSearchResult,
  DesignStyle,
  Complexity,
} from './types';

// Registry functions
export {
  getAllSections,
  getSectionById,
  getSectionsByCategory,
  getSectionsByStyle,
  getSectionsByComplexity,
  filterSections,
  searchSections,
  getRecommendedSections,
  getPopularSections,
  getCategoryInfo,
  registerSection,
  registerSections,
  type CategoryInfo,
} from './registry';

// Insertion functions
export {
  insertSection,
  insertSectionRelativeToBlock,
  replaceBlockWithSection,
  appendSection,
  prependSection,
  type InsertSectionResult,
} from './inserter';

// Design system
export {
  getColorScheme,
  getSpacingScale,
  getTypographyScale,
  applyDesignVariant,
  COLOR_SCHEMES,
  SPACING_SCALES,
  TYPOGRAPHY_SCALES,
  type ColorScheme,
  type SpacingScale,
  type TypographyScale,
  type DesignVariant,
} from './design-system';

// Templates (auto-registers on import)
import './templates';

