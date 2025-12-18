/**
 * AI Model Configuration
 * 
 * Centralized config for all AI model usage across the platform.
 * Change the model once here to update everywhere.
 */

// =============================================================================
// MODEL SELECTION
// =============================================================================

/**
 * AI Provider Selection
 * 'anthropic' → Claude Sonnet 4.5 (high quality, reliable)
 * 'google' → Gemini Flash (fast, cost-effective)
 */
export const AI_PROVIDER = 'google' as 'anthropic' | 'google';

/**
 * Primary AI model for all generation tasks
 * 
 * Anthropic Options:
 * - 'claude-sonnet-4-20250514' → Claude Sonnet 4.5 (highest quality, $3/$15 per M tokens)
 * - 'claude-haiku-4-5-20251001' → Claude Haiku 4.5 (fast, reliable, $1/$5 per M tokens)
 * - 'claude-3-5-sonnet-20241022' → Claude 3.5 Sonnet (previous generation)
 * 
 * Google Options:
 * - 'gemini-2.5-pro' → Stable, high quality (~5-15s, $1.25/$5 per M tokens)
 * - 'gemini-2.5-flash' → Balanced speed/quality (~2-5s, $0.30/$2.50 per M tokens)
 * - 'gemini-2.5-flash-lite' → Fastest, most cost-effective (~1-3s)
 * - 'gemini-3-flash-preview' → NEW! Latest preview ($0.50/$3 per M tokens, experimental) 🚀
 */
export const AI_MODEL = AI_PROVIDER === 'anthropic' 
  ? 'claude-haiku-4-5-20251001'
  : 'gemini-3-flash-preview';

/**
 * Model for quick tasks (keywords, simple edits)
 * Can use a faster model for latency-sensitive operations
 */
export const AI_MODEL_FAST = AI_PROVIDER === 'anthropic'
  ? 'claude-haiku-4-5-20251001'
  : 'gemini-3-flash-preview';

// =============================================================================
// TIMEOUTS & LIMITS
// =============================================================================

/**
 * Timeout for AI keyword extraction (ms)
 * If exceeded, falls back to design system keywords
 */
export const AI_KEYWORDS_TIMEOUT_MS = 5000;

/**
 * Maximum generation attempts before failing
 */
export const MAX_GENERATION_ATTEMPTS = 3;

// =============================================================================
// TEMPERATURE SETTINGS
// =============================================================================

/**
 * Temperature for code generation (lower = more deterministic)
 */
export const GENERATION_TEMPERATURE = 0.7;

/**
 * Temperature for keyword extraction (low for consistency)
 */
export const KEYWORDS_TEMPERATURE = 0.3;

/**
 * Temperature for consultation/chat (higher for creativity)
 */
export const CONSULTATION_TEMPERATURE = 0.8;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Use AI for image keyword extraction
 * Set to false to always use design system fallback keywords
 */
export const USE_AI_KEYWORDS = true;

/**
 * Enable pre-render syntax validation
 * Catches broken JSX before render fails
 */
export const ENABLE_SYNTAX_VALIDATION = true;

