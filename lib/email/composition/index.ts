/**
 * Composition System
 * 
 * Central export for composition engine and rules.
 * Scoring functionality removed - can be re-enabled later if needed.
 */

export * from './rules';
export * from './engine';
// Scoring removed - kept file for future use
// export * from './scoring';

// Re-export commonly used types and functions
export {
  CompositionEngine,
  createCompositionEngine,
  defaultCompositionEngine,
  type CompositionOptions,
  type CompositionResult,
  type CompositionMetadata,
} from './engine';

// Scoring exports commented out - can be re-enabled if needed
// export {
//   scoreComposition,
//   scoreCompositionEnhanced,
//   scoreCompositionWithViolations,
//   quickScore,
//   compareScores,
//   getScoringRecommendations,
//   type QualityScore,
//   type EnhancedCompositionScore,
//   type CategoryScore,
// } from './scoring';

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

