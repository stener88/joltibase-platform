/**
 * Email Block System Constants
 * 
 * Central location for all magic numbers, dimensions, and default values
 * used throughout the email rendering system.
 * 
 * NOTE: This file now uses design tokens as the source of truth.
 * These constants are maintained for backward compatibility.
 */

import { 
  designTokens,
  getColorToken,
  getSpacingToken,
  pxToNumber,
} from '../design-tokens';

// ============================================================================
// Email Dimensions
// ============================================================================

/**
 * Email layout dimensions
 */
export const EMAIL_DIMENSIONS = {
  /** Maximum width of email (standard for most email clients) */
  MAX_WIDTH: 600,
  /** Gap between columns in multi-column layouts */
  COLUMN_GAP: 20,
  /** Default image aspect ratio (width * ratio = height) */
  IMAGE_ASPECT_RATIO: 0.67,
} as const;

// ============================================================================
// Column Widths
// ============================================================================

/**
 * Fixed pixel widths for all layout variations
 * Calculated as: (MAX_WIDTH - (n-1) * COLUMN_GAP) / n
 */
export const COLUMN_WIDTHS = {
  /** Full width for single column */
  FULL: 600,
  
  // Two column layouts (600 - 20 = 580 total)
  /** 50/50 split: each column gets 290px */
  TWO_COL_50: 290,
  /** 60/40 split: larger column */
  TWO_COL_60: 360,
  /** 60/40 split: smaller column */
  TWO_COL_40: 220,
  /** 70/30 split: larger column */
  TWO_COL_70: 420,
  /** 70/30 split: smaller column */
  TWO_COL_30: 160,
  
  // Multi-column layouts
  /** 3 column layout: (600 - 40) / 3 = 186px */
  THREE_COL: 186,
  /** 4 column layout: (600 - 60) / 4 = 135px */
  FOUR_COL: 135,
  
  // Special widths
  /** Compact image width for compact-image-text layout */
  COMPACT_IMAGE: 200,
  /** Image grid 2 column width: each gets 290px */
  IMAGE_GRID_2COL: 290,
  /** Image grid 3 column width: (600 - 40) / 3 = 190px (rounded) */
  IMAGE_GRID_3COL: 190,
} as const;

// ============================================================================
// Default Styles
// ============================================================================

/**
 * Default text colors
 * Now aliases to design tokens for consistency
 */
export const DEFAULT_COLORS = {
  /** Default body text color */
  TEXT: getColorToken('text.secondary'),
  /** Default heading color */
  HEADING: getColorToken('text.primary'),
  /** Default background color */
  BACKGROUND: getColorToken('background.default'),
  /** Default border color */
  BORDER: getColorToken('border.default'),
  /** Default header/label text color */
  HEADER: designTokens.primitives.colors.neutral[500],
  /** Default button background color */
  BUTTON_BG: getColorToken('action.primary'),
  /** Default button text color */
  BUTTON_TEXT: getColorToken('text.inverse'),
} as const;

/**
 * Default padding values
 * Now uses design token spacing scale
 */
export const DEFAULT_PADDING = {
  top: pxToNumber(getSpacingToken('section.standard')),
  right: pxToNumber(getSpacingToken('padding.standard')),
  bottom: pxToNumber(getSpacingToken('section.standard')),
  left: pxToNumber(getSpacingToken('padding.standard')),
} as const;

/**
 * Default font sizes
 * Now aliases to design token typography scale
 */
export const DEFAULT_FONT_SIZES = {
  /** Small text (labels, headers) */
  SMALL: designTokens.primitives.typography.fontSizes.sm,
  /** Body text */
  BODY: designTokens.primitives.typography.fontSizes.base,
  /** Large text (titles) */
  LARGE: designTokens.primitives.typography.fontSizes['2xl'],
  /** Extra large text (hero titles) */
  XLARGE: designTokens.primitives.typography.fontSizes['4xl'],
} as const;

/**
 * Default font weights
 * Now aliases to design token typography weights
 */
export const DEFAULT_FONT_WEIGHTS = {
  NORMAL: designTokens.primitives.typography.fontWeights.normal,
  MEDIUM: designTokens.primitives.typography.fontWeights.medium,
  SEMIBOLD: designTokens.primitives.typography.fontWeights.semibold,
  BOLD: designTokens.primitives.typography.fontWeights.bold,
} as const;

/**
 * Default border radius values
 * Now aliases to design token border radius scale
 */
export const DEFAULT_BORDER_RADIUS = {
  SMALL: designTokens.primitives.borderRadius.sm,
  MEDIUM: designTokens.primitives.borderRadius.md,
  LARGE: designTokens.primitives.borderRadius.lg,
  XLARGE: designTokens.primitives.borderRadius.xl,
} as const;

/**
 * Default button dimensions
 */
export const DEFAULT_BUTTON = {
  PADDING_VERTICAL: 14,
  PADDING_HORIZONTAL: 28,
  BORDER_RADIUS: '8px',
  FONT_SIZE: '16px',
  FONT_WEIGHT: 600,
} as const;

// ============================================================================
// Placeholder Image Dimensions
// ============================================================================

/**
 * Default dimensions for placeholder images
 */
export const PLACEHOLDER_DIMENSIONS = {
  /** Logo placeholder dimensions */
  LOGO: {
    WIDTH: 200,
    HEIGHT: 80,
  },
  /** Standard image placeholder dimensions */
  IMAGE: {
    WIDTH: 600,
    HEIGHT: 400,
  },
  /** Compact image placeholder dimensions */
  COMPACT: {
    WIDTH: 200,
    HEIGHT: 200,
  },
  /** Avatar placeholder dimension (square) */
  AVATAR: {
    SIZE: 64,
  },
} as const;

/**
 * Placeholder colors
 */
export const PLACEHOLDER_COLORS = {
  /** Logo placeholder background */
  LOGO_BG: '#f3f4f6',
  /** Image placeholder background */
  IMAGE_BG: '#e5e7eb',
  /** Icon color in placeholders */
  ICON: '#9ca3af',
} as const;

// ============================================================================
// Helper Type Exports
// ============================================================================

export type Padding = typeof DEFAULT_PADDING;
export type ColumnWidth = typeof COLUMN_WIDTHS[keyof typeof COLUMN_WIDTHS];
export type DefaultColor = typeof DEFAULT_COLORS[keyof typeof DEFAULT_COLORS];

