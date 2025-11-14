/**
 * Section Design System
 * 
 * Defines color schemes, spacing scales, and typography scales
 * for creating consistent design variants across sections.
 */

import type { Padding } from '../blocks/types';

// ============================================================================
// Color Schemes
// ============================================================================

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textLight: string;
  accent: string;
}

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  'minimal-gray': {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    primary: '#111827',
    secondary: '#6b7280',
    background: '#f9fafb',
    text: '#111827',
    textLight: '#6b7280',
    accent: '#2563eb',
  },
  'bold-purple': {
    id: 'bold-purple',
    name: 'Bold Purple',
    primary: '#7c3aed',
    secondary: '#a78bfa',
    background: '#faf5ff',
    text: '#1f2937',
    textLight: '#6b7280',
    accent: '#7c3aed',
  },
  'warm-red': {
    id: 'warm-red',
    name: 'Warm Red',
    primary: '#dc2626',
    secondary: '#991b1b',
    background: '#fef2f2',
    text: '#111827',
    textLight: '#6b7280',
    accent: '#dc2626',
  },
  'cool-blue': {
    id: 'cool-blue',
    name: 'Cool Blue',
    primary: '#2563eb',
    secondary: '#3b82f6',
    background: '#eff6ff',
    text: '#111827',
    textLight: '#6b7280',
    accent: '#2563eb',
  },
  'gradient-sunset': {
    id: 'gradient-sunset',
    name: 'Gradient Sunset',
    primary: '#f59e0b',
    secondary: '#ef4444',
    background: '#fffbeb',
    text: '#111827',
    textLight: '#6b7280',
    accent: '#f59e0b',
  },
  'elegant-black': {
    id: 'elegant-black',
    name: 'Elegant Black',
    primary: '#000000',
    secondary: '#3d3d3a',
    background: '#ffffff',
    text: '#000000',
    textLight: '#6b7280',
    accent: '#000000',
  },
};

// ============================================================================
// Spacing Scales
// ============================================================================

export interface SpacingScale {
  id: string;
  name: string;
  hero: Padding;
  section: Padding;
  block: Padding;
  spacer: number;
}

export const SPACING_SCALES: Record<string, SpacingScale> = {
  compact: {
    id: 'compact',
    name: 'Compact',
    hero: { top: 40, bottom: 40, left: 20, right: 20 },
    section: { top: 24, bottom: 24, left: 20, right: 20 },
    block: { top: 16, bottom: 16, left: 20, right: 20 },
    spacer: 24,
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    hero: { top: 60, bottom: 60, left: 40, right: 40 },
    section: { top: 40, bottom: 40, left: 20, right: 20 },
    block: { top: 20, bottom: 20, left: 20, right: 20 },
    spacer: 40,
  },
  spacious: {
    id: 'spacious',
    name: 'Spacious',
    hero: { top: 80, bottom: 80, left: 40, right: 40 },
    section: { top: 60, bottom: 60, left: 40, right: 40 },
    block: { top: 32, bottom: 32, left: 40, right: 40 },
    spacer: 60,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    hero: { top: 100, bottom: 100, left: 60, right: 60 },
    section: { top: 80, bottom: 80, left: 60, right: 60 },
    block: { top: 40, bottom: 40, left: 60, right: 60 },
    spacer: 80,
  },
};

// ============================================================================
// Typography Scales
// ============================================================================

export interface TypographyScale {
  id: string;
  name: string;
  hero: {
    fontSize: string;
    fontWeight: number;
  };
  heading: {
    fontSize: string;
    fontWeight: number;
  };
  subheading: {
    fontSize: string;
    fontWeight: number;
  };
  body: {
    fontSize: string;
    fontWeight: number;
    lineHeight: string;
  };
}

export const TYPOGRAPHY_SCALES: Record<string, TypographyScale> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    hero: {
      fontSize: '48px',
      fontWeight: 700,
    },
    heading: {
      fontSize: '32px',
      fontWeight: 600,
    },
    subheading: {
      fontSize: '18px',
      fontWeight: 400,
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '1.6',
    },
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    hero: {
      fontSize: '56px',
      fontWeight: 800,
    },
    heading: {
      fontSize: '40px',
      fontWeight: 700,
    },
    subheading: {
      fontSize: '20px',
      fontWeight: 400,
    },
    body: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: '1.6',
    },
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    hero: {
      fontSize: '70px',
      fontWeight: 900,
    },
    heading: {
      fontSize: '48px',
      fontWeight: 800,
    },
    subheading: {
      fontSize: '22px',
      fontWeight: 500,
    },
    body: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '1.7',
    },
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    hero: {
      fontSize: '80px',
      fontWeight: 300,
    },
    heading: {
      fontSize: '52px',
      fontWeight: 300,
    },
    subheading: {
      fontSize: '24px',
      fontWeight: 300,
    },
    body: {
      fontSize: '19px',
      fontWeight: 300,
      lineHeight: '1.8',
    },
  },
};

// ============================================================================
// Design Variant Application
// ============================================================================

export interface DesignVariant {
  colorScheme: string;
  spacingScale: string;
  typographyScale: string;
}

/**
 * Get a color scheme by ID
 */
export function getColorScheme(id: string): ColorScheme {
  return COLOR_SCHEMES[id] || COLOR_SCHEMES['minimal-gray'];
}

/**
 * Get a spacing scale by ID
 */
export function getSpacingScale(id: string): SpacingScale {
  return SPACING_SCALES[id] || SPACING_SCALES.standard;
}

/**
 * Get a typography scale by ID
 */
export function getTypographyScale(id: string): TypographyScale {
  return TYPOGRAPHY_SCALES[id] || TYPOGRAPHY_SCALES.standard;
}

/**
 * Apply design variant to a section template
 * This function can be used to create design variants of base sections
 */
export function applyDesignVariant(
  baseBlocks: any[],
  variant: DesignVariant
): any[] {
  const colors = getColorScheme(variant.colorScheme);
  const spacing = getSpacingScale(variant.spacingScale);
  const typography = getTypographyScale(variant.typographyScale);
  
  // Deep clone to avoid modifying original
  const blocks = JSON.parse(JSON.stringify(baseBlocks));
  
  // Apply design system to each block
  return blocks.map((block: any) => {
    switch (block.type) {
      case 'hero':
        return {
          ...block,
          settings: {
            ...block.settings,
            padding: spacing.hero,
            backgroundColor: colors.background,
            headlineFontSize: typography.hero.fontSize,
            headlineFontWeight: typography.hero.fontWeight,
            headlineColor: colors.primary,
            subheadlineFontSize: typography.subheading.fontSize,
            subheadlineColor: colors.textLight,
          },
        };
      
      case 'heading':
        return {
          ...block,
          settings: {
            ...block.settings,
            padding: spacing.block,
            fontSize: typography.heading.fontSize,
            fontWeight: typography.heading.fontWeight,
            color: colors.primary,
          },
        };
      
      case 'text':
        return {
          ...block,
          settings: {
            ...block.settings,
            padding: spacing.block,
            fontSize: typography.body.fontSize,
            fontWeight: typography.body.fontWeight,
            color: colors.text,
            lineHeight: typography.body.lineHeight,
          },
        };
      
      case 'button':
        return {
          ...block,
          settings: {
            ...block.settings,
            containerPadding: spacing.block,
            color: colors.accent,
          },
        };
      
      case 'stats':
        return {
          ...block,
          settings: {
            ...block.settings,
            padding: spacing.section,
            valueColor: colors.primary,
            labelColor: colors.textLight,
          },
        };
      
      case 'testimonial':
        return {
          ...block,
          settings: {
            ...block.settings,
            padding: spacing.section,
            backgroundColor: colors.background,
            quoteColor: colors.text,
            authorColor: colors.textLight,
          },
        };
      
      case 'spacer':
        return {
          ...block,
          settings: {
            ...block.settings,
            height: spacing.spacer,
          },
        };
      
      default:
        return block;
    }
  });
}

