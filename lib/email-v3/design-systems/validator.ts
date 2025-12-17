/**
 * Design System Validator
 * 
 * Validates generated design systems for quality, accessibility, and email compatibility
 */

import type { DesignSystem, DesignValidation } from '../agents/types';
import type { BrandIdentity } from '@/lib/types/brand';

/**
 * Validate a design system
 */
export function validateDesignSystem(
  designSystem: DesignSystem,
  brandIdentity: BrandIdentity
): DesignValidation {
  const issues: string[] = [];

  // 1. Color contrast validation (WCAG AA compliance)
  const headingContrast = getContrastRatio(
    designSystem.colors.heading,
    designSystem.colors.background.primary
  );
  if (headingContrast < 4.5) {
    issues.push(`Heading color fails WCAG contrast (${headingContrast.toFixed(2)} < 4.5)`);
  }

  const bodyContrast = getContrastRatio(
    designSystem.colors.body,
    designSystem.colors.background.primary
  );
  if (bodyContrast < 4.5) {
    issues.push(`Body text fails WCAG contrast (${bodyContrast.toFixed(2)} < 4.5)`);
  }

  // 2. Button visibility check
  const buttonContrast = getContrastRatio(
    designSystem.colors.primary,
    designSystem.colors.background.primary
  );
  if (buttonContrast < 3) {
    issues.push(`Primary button color too similar to background (${buttonContrast.toFixed(2)} < 3)`);
  }

  // 3. Color harmony check (DISABLED - too opinionated, trust Claude's judgment)
  // const primaryHsl = hexToHsl(designSystem.colors.primary);
  // const secondaryHsl = hexToHsl(designSystem.colors.secondary);
  // if (primaryHsl && secondaryHsl) {
  //   const hueDiff = Math.abs(primaryHsl.h - secondaryHsl.h);
  //   if (hueDiff < 10 && hueDiff > 5) {
  //     issues.push('Primary/secondary colors too similar - creates muddy palette');
  //   }
  // }

  // 4. Brand color usage validation
  const allColors = Object.values(designSystem.colors)
    .flatMap(c => typeof c === 'string' ? [c] : Object.values(c));
  const brandColorInPalette = allColors.some(color => 
    color.toLowerCase() === brandIdentity.primaryColor.toLowerCase()
  );
  if (!brandColorInPalette) {
    issues.push('Brand primary color not incorporated in design palette');
  }

  // 5. Typography scale validation
  const h1Size = parseInt(designSystem.typography.h1.size.match(/\d+/)?.[0] || '0');
  const bodySize = parseInt(designSystem.typography.body.size.match(/\d+/)?.[0] || '0');

  if (h1Size < bodySize * 1.5) {
    issues.push(`H1 too small for hierarchy (${h1Size}px vs body ${bodySize}px)`);
  }

  if (h1Size > 56) {
    issues.push(`H1 too large for email clients (${h1Size}px > 56px)`);
  }

  if (h1Size < 24) {
    issues.push(`H1 too small (${h1Size}px < 24px)`);
  }

  // 6. Spacing validation
  if (!designSystem.spacing.section.includes('py-')) {
    issues.push('Section spacing missing vertical padding (py-)');
  }

  if (!designSystem.spacing.section.includes('px-')) {
    issues.push('Section spacing missing horizontal padding (px-)');
  }

  // 7. Email-safe Tailwind class validation
  const forbiddenPatterns = [
    { pattern: /hover:/g, name: 'hover: pseudo-class' },
    { pattern: /sm:/g, name: 'sm: breakpoint' },
    { pattern: /md:/g, name: 'md: breakpoint' },
    { pattern: /lg:/g, name: 'lg: breakpoint' },
    { pattern: /xl:/g, name: 'xl: breakpoint' },
    { pattern: /dark:/g, name: 'dark: mode' },
    { pattern: /group-hover:/g, name: 'group-hover' },
  ];

  const systemString = JSON.stringify(designSystem);
  forbiddenPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(systemString)) {
      issues.push(`Forbidden pattern detected: ${name} (not email-safe)`);
    }
  });

  // 8. Valid Tailwind format check
  const tailwindPatterns = [
    designSystem.typography.h1.size,
    designSystem.typography.body.size,
    designSystem.spacing.section,
    designSystem.effects.borderRadius
  ];

  tailwindPatterns.forEach((value, index) => {
    if (!isTailwindClass(value)) {
      issues.push(`Invalid Tailwind format at position ${index}: "${value}"`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert hex to HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Check if string is valid Tailwind class format
 */
function isTailwindClass(value: string): boolean {
  // Allow common Tailwind patterns:
  // - text-[16px]
  // - py-[48px]
  // - rounded-[8px]
  // - font-bold
  // - leading-[24px]
  // - Multiple classes separated by spaces
  
  const tailwindPattern = /^(text-|py-|px-|mb-|mt-|p-|m-|rounded-|font-|leading-|tracking-|shadow-|bg-|border-)[\w\[\]\-\.]+(\s+(text-|py-|px-|mb-|mt-|p-|m-|rounded-|font-|leading-|tracking-|shadow-|bg-|border-)[\w\[\]\-\.]+)*$/;
  
  return tailwindPattern.test(value);
}

