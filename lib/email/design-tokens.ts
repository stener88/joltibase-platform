/**
 * Email Design Token System
 * 
 * Three-tier token architecture for compositional intelligence:
 * 1. Primitives: Raw values (8px spacing grid, color scales, typography scales)
 * 2. Semantic: Intent-based tokens (content.balanced, text.primary, heading.primary)
 * 3. Component: Application-specific tokens (card, button, hero)
 * 
 * Inspired by: Material Design, Tailwind CSS, Figma Tokens
 */

// ============================================================================
// Tier 1: Primitives (Raw Values)
// ============================================================================

/**
 * Spacing Scale - 8px Grid System
 * Email-safe values (max 80px for mobile compatibility)
 */
export const spacingPrimitives = {
  0: '0px',
  1: '4px',    // Micro spacing
  2: '8px',    // Base unit (Material Design standard)
  3: '12px',   // Between small elements
  4: '16px',   // Standard spacing
  5: '20px',   // Moderate spacing
  6: '24px',   // Section spacing
  8: '32px',   // Large spacing
  10: '40px',  // Major sections
  12: '48px',  // Maximum for mobile-first
  16: '64px',  // Desktop spacing
  20: '80px',  // Hero sections
} as const;

/**
 * Color Primitives - 11-step scales (Tailwind-inspired)
 */
export const colorPrimitives = {
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
    950: '#3B0764',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const;

/**
 * Typography Primitives - Major Third Scale (1.25 ratio)
 */
export const typographyPrimitives = {
  fontSizes: {
    xs: '12px',    // Fine print, legal text
    sm: '14px',    // Small labels, captions
    base: '16px',  // Body text (EMAIL STANDARD)
    lg: '18px',    // Emphasized body
    xl: '20px',    // Subheadings
    '2xl': '24px', // H3
    '3xl': '28px', // H2
    '4xl': '32px', // H1 (mobile-safe)
    '5xl': '36px', // Hero (desktop)
    '6xl': '48px', // Large hero (desktop)
    '7xl': '56px', // Extra large hero (desktop)
    '8xl': '64px', // Maximum hero (desktop)
  },
  lineHeights: {
    tight: 1.2,    // Headings, compact text
    normal: 1.5,   // Body text (WCAG minimum)
    relaxed: 1.75, // Loose body text, better readability
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

/**
 * Border Radius Primitives
 */
export const borderRadiusPrimitives = {
  none: '0px',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

// ============================================================================
// Tier 2: Semantic Tokens (Intent-Based)
// ============================================================================

/**
 * Semantic Spacing - Communicates intent, not pixels
 */
export const semanticSpacing = {
  // Content spacing (between elements within a component)
  'content.micro': spacingPrimitives[1],      // 4px - tight inline elements
  'content.tight': spacingPrimitives[2],      // 8px - compact spacing
  'content.balanced': spacingPrimitives[4],   // 16px - standard spacing
  'content.relaxed': spacingPrimitives[6],    // 24px - comfortable spacing
  'content.spacious': spacingPrimitives[8],   // 32px - generous spacing
  
  // Component spacing (between components/blocks)
  'component.gap': spacingPrimitives[6],      // 24px - standard component gap
  'component.large': spacingPrimitives[10],   // 40px - large component gap
  
  // Section spacing (between major sections)
  'section.standard': spacingPrimitives[10],  // 40px - standard section
  'section.hero': spacingPrimitives[20],      // 80px - hero sections
  'section.comfortable': spacingPrimitives[12], // 48px - comfortable section
  
  // Padding presets
  'padding.tight': spacingPrimitives[2],      // 8px
  'padding.standard': spacingPrimitives[5],   // 20px
  'padding.comfortable': spacingPrimitives[10], // 40px
} as const;

/**
 * Semantic Colors - Named by purpose, not appearance
 */
export const semanticColors = {
  // Text colors
  'text.primary': colorPrimitives.neutral[900],    // #171717 - main text
  'text.secondary': colorPrimitives.neutral[600],  // #525252 - secondary text
  'text.muted': colorPrimitives.neutral[400],      // #A3A3A3 - muted text
  'text.inverse': '#FFFFFF',                        // white on dark backgrounds
  
  // Background colors
  'background.default': '#FFFFFF',                       // white background
  'background.alt': colorPrimitives.neutral[50],        // #FAFAFA - subtle background
  'background.subtle': colorPrimitives.neutral[100],    // #F5F5F5 - light gray
  'background.muted': colorPrimitives.neutral[200],     // #E5E5E5 - muted background
  
  // Action colors (CTAs, links, interactive elements)
  'action.primary': colorPrimitives.primary[500],       // #3B82F6 - primary CTA
  'action.primaryHover': colorPrimitives.primary[600],  // #2563EB - primary hover
  'action.secondary': colorPrimitives.purple[700],      // #7C3AED - secondary CTA
  'action.secondaryHover': colorPrimitives.purple[800], // #6B21A8 - secondary hover
  'action.success': colorPrimitives.green[600],         // #16A34A - success action
  'action.danger': colorPrimitives.red[600],            // #DC2626 - destructive action
  
  // Semantic state colors
  'status.success': colorPrimitives.semantic.success,  // #10B981
  'status.error': colorPrimitives.semantic.error,      // #EF4444
  'status.warning': colorPrimitives.semantic.warning,  // #F59E0B
  'status.info': colorPrimitives.semantic.info,        // #3B82F6
  
  // Border colors
  'border.default': colorPrimitives.neutral[200],      // #E5E5E5
  'border.strong': colorPrimitives.neutral[300],       // #D4D4D4
  'border.subtle': colorPrimitives.neutral[100],       // #F5F5F5
} as const;

/**
 * Semantic Typography - Complete text styles
 */
export const semanticTypography = {
  // Body text styles
  'body.standard': {
    size: typographyPrimitives.fontSizes.base,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.normal,
  },
  'body.large': {
    size: typographyPrimitives.fontSizes.lg,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.normal,
  },
  'body.small': {
    size: typographyPrimitives.fontSizes.sm,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.normal,
  },
  
  // Heading styles
  'heading.primary': {
    size: typographyPrimitives.fontSizes['4xl'],
    lineHeight: typographyPrimitives.lineHeights.tight,
    weight: typographyPrimitives.fontWeights.bold,
  },
  'heading.secondary': {
    size: typographyPrimitives.fontSizes['2xl'],
    lineHeight: typographyPrimitives.lineHeights.tight,
    weight: typographyPrimitives.fontWeights.semibold,
  },
  'heading.tertiary': {
    size: typographyPrimitives.fontSizes.xl,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.semibold,
  },
  
  // Hero styles
  'hero.title': {
    size: typographyPrimitives.fontSizes['6xl'],
    lineHeight: typographyPrimitives.lineHeights.tight,
    weight: typographyPrimitives.fontWeights.extrabold,
  },
  'hero.subtitle': {
    size: typographyPrimitives.fontSizes.xl,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.normal,
  },
  
  // Label/caption styles
  'label.default': {
    size: typographyPrimitives.fontSizes.sm,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.medium,
  },
  'label.small': {
    size: typographyPrimitives.fontSizes.xs,
    lineHeight: typographyPrimitives.lineHeights.normal,
    weight: typographyPrimitives.fontWeights.normal,
  },
} as const;

// ============================================================================
// Tier 3: Component Tokens (Application-Specific)
// ============================================================================

/**
 * Component-specific token collections
 */
export const componentTokens = {
  // Card component
  card: {
    padding: spacingPrimitives[6],           // 24px
    gap: spacingPrimitives[4],               // 16px
    borderRadius: borderRadiusPrimitives.md, // 8px
    backgroundColor: semanticColors['background.default'],
    borderColor: semanticColors['border.default'],
  },
  
  // Button component
  button: {
    paddingX: spacingPrimitives[8],          // 32px
    paddingY: spacingPrimitives[3],          // 12px
    minHeight: '44px',                        // Touch target (WCAG)
    fontSize: typographyPrimitives.fontSizes.base,
    fontWeight: typographyPrimitives.fontWeights.semibold,
    borderRadius: borderRadiusPrimitives.base, // 6px
    
    // Button variants
    primary: {
      background: semanticColors['action.primary'],
      text: semanticColors['text.inverse'],
      hoverBackground: semanticColors['action.primaryHover'],
    },
    secondary: {
      background: semanticColors['action.secondary'],
      text: semanticColors['text.inverse'],
      hoverBackground: semanticColors['action.secondaryHover'],
    },
    ghost: {
      background: 'transparent',
      text: semanticColors['text.primary'],
      borderColor: semanticColors['border.strong'],
    },
  },
  
  // Hero section
  hero: {
    paddingTop: spacingPrimitives[20],       // 80px
    paddingBottom: spacingPrimitives[20],    // 80px
    paddingX: spacingPrimitives[10],         // 40px
    titleSize: typographyPrimitives.fontSizes['6xl'],
    titleWeight: typographyPrimitives.fontWeights.extrabold,
    subtitleSize: typographyPrimitives.fontSizes.xl,
    gap: spacingPrimitives[6],               // 24px
  },
  
  // Stats block
  stats: {
    padding: spacingPrimitives[10],          // 40px
    gap: spacingPrimitives[6],               // 24px
    numberSize: typographyPrimitives.fontSizes['5xl'],
    numberWeight: typographyPrimitives.fontWeights.bold,
    labelSize: typographyPrimitives.fontSizes.sm,
  },
  
  // Footer
  footer: {
    padding: spacingPrimitives[8],           // 32px
    fontSize: typographyPrimitives.fontSizes.sm,
    lineHeight: typographyPrimitives.lineHeights.relaxed,
    textColor: semanticColors['text.muted'],
    backgroundColor: semanticColors['background.subtle'],
  },
} as const;

// ============================================================================
// Token Resolution Utilities
// ============================================================================

/**
 * Resolve token by semantic path
 * @example resolveToken('spacing', 'content.balanced') => '16px'
 */
export function resolveToken(
  category: 'spacing' | 'color' | 'typography',
  path: string
): any {
  switch (category) {
    case 'spacing':
      return (semanticSpacing as any)[path] || path;
    case 'color':
      return (semanticColors as any)[path] || path;
    case 'typography':
      return (semanticTypography as any)[path] || path;
    default:
      return path;
  }
}

/**
 * Get spacing token (type-safe)
 */
export function getSpacingToken(
  key: keyof typeof semanticSpacing
): string {
  return semanticSpacing[key];
}

/**
 * Get color token (type-safe)
 */
export function getColorToken(
  key: keyof typeof semanticColors
): string {
  return semanticColors[key];
}

/**
 * Get typography token (type-safe)
 */
export function getTypographyToken(
  key: keyof typeof semanticTypography
): typeof semanticTypography[keyof typeof semanticTypography] {
  return semanticTypography[key];
}

/**
 * Get component token (type-safe)
 */
export function getComponentToken<T extends keyof typeof componentTokens>(
  component: T
): typeof componentTokens[T] {
  return componentTokens[component];
}

/**
 * Resolve spacing value from various formats
 * Handles: primitives (0-20), semantic paths, or pass-through pixel values
 */
export function resolveSpacing(
  value: keyof typeof spacingPrimitives | keyof typeof semanticSpacing | string
): string {
  // Check if it's a primitive key (number)
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const key = Number(value) as keyof typeof spacingPrimitives;
    return spacingPrimitives[key] || `${value}px`;
  }
  
  // Check if it's a semantic key
  if (value in semanticSpacing) {
    return semanticSpacing[value as keyof typeof semanticSpacing];
  }
  
  // Pass through (already a pixel value or custom)
  return value;
}

/**
 * Convert pixel string to number
 */
export function pxToNumber(value: string): number {
  return parseInt(value.replace('px', ''), 10);
}

/**
 * Round value to nearest 8px grid
 */
export function snapToGrid(value: number): number {
  return Math.round(value / 8) * 8;
}

// ============================================================================
// Export Combined Token System
// ============================================================================

export const designTokens = {
  primitives: {
    spacing: spacingPrimitives,
    colors: colorPrimitives,
    typography: typographyPrimitives,
    borderRadius: borderRadiusPrimitives,
  },
  semantic: {
    spacing: semanticSpacing,
    colors: semanticColors,
    typography: semanticTypography,
  },
  component: componentTokens,
} as const;

// ============================================================================
// TypeScript Type Exports
// ============================================================================

export type SpacingKey = keyof typeof spacingPrimitives;
export type SemanticSpacingKey = keyof typeof semanticSpacing;
export type ColorKey = keyof typeof semanticColors;
export type TypographyKey = keyof typeof semanticTypography;
export type ComponentKey = keyof typeof componentTokens;

