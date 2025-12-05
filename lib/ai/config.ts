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
 * Primary AI model for all generation tasks
 * 
 * Options:
 * - 'gemini-3-pro-preview' → Latest preview, best quality ← CURRENT
 * - 'gemini-2.5-pro'   → Stable, high quality (~5-15s)
 * - 'gemini-2.5-flash' → Balanced speed/quality (~2-5s)
 */
export const AI_MODEL = 'gemini-3-pro-preview';

/**
 * Model for quick tasks (keywords, simple edits)
 * Can use a faster model for latency-sensitive operations
 */
export const AI_MODEL_FAST = 'gemini-2.5-flash';

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

