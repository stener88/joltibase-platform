/**
 * Email Block System Constants
 * 
 * Central location for all magic numbers, dimensions, and default values
 * used throughout the email rendering system.
 */

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
 */
export const DEFAULT_COLORS = {
  /** Default body text color */
  TEXT: '#374151',
  /** Default heading color */
  HEADING: '#111827',
  /** Default background color */
  BACKGROUND: '#ffffff',
  /** Default border color */
  BORDER: '#e5e7eb',
  /** Default header/label text color */
  HEADER: '#6b7280',
  /** Default button background color */
  BUTTON_BG: '#3b82f6',
  /** Default button text color */
  BUTTON_TEXT: '#ffffff',
} as const;

/**
 * Default padding values
 */
export const DEFAULT_PADDING = {
  top: 40,
  right: 20,
  bottom: 40,
  left: 20,
} as const;

/**
 * Default font sizes
 */
export const DEFAULT_FONT_SIZES = {
  /** Small text (labels, headers) */
  SMALL: '14px',
  /** Body text */
  BODY: '16px',
  /** Large text (titles) */
  LARGE: '24px',
  /** Extra large text (hero titles) */
  XLARGE: '32px',
} as const;

/**
 * Default font weights
 */
export const DEFAULT_FONT_WEIGHTS = {
  NORMAL: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
} as const;

/**
 * Default border radius values
 */
export const DEFAULT_BORDER_RADIUS = {
  SMALL: '4px',
  MEDIUM: '8px',
  LARGE: '12px',
  XLARGE: '16px',
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

