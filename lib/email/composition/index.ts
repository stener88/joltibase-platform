/**
 * Composition System
 * 
 * Central export for all composition-related functionality
 */

export * from './rules';
export * from './engine';
export * from './scoring';

// Re-export commonly used types and functions
export {
  CompositionEngine,
  createCompositionEngine,
  defaultCompositionEngine,
  type CompositionOptions,
  type CompositionResult,
  type CompositionMetadata,
} from './engine';

export {
  scoreComposition,
  scoreCompositionWithViolations,
  quickScore,
  compareScores,
  getScoringRecommendations,
  type QualityScore,
  type CategoryScore,
} from './scoring';

export {
  allCompositionRules,
  spacingGridRule,
  typographyHierarchyRule,
  contrastRule,
  touchTargetRule,
  whiteSpaceRule,
  type CompositionRule,
  type RuleContext,
  type RuleViolation,
} from './rules';

