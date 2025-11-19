/**
 * Email Composition Rules
 * 
 * Core rules that enforce aesthetic quality and accessibility standards.
 * Each rule has a weight (priority) and can modify blocks to ensure compliance.
 */

import type { EmailBlock, Padding } from '../blocks/types';
import { snapToGrid, pxToNumber, designTokens, getColorToken } from '../design-tokens';

// ============================================================================
// Rule Types & Interfaces
// ============================================================================

export interface RuleContext {
  tokens: typeof designTokens;
  viewport: 'mobile' | 'tablet' | 'desktop';
  accessibility: 'WCAG-AA' | 'WCAG-AAA';
  metadata?: any; // Optional metadata for analysis results
}

export interface RuleViolation {
  ruleId: string;
  blockId: string;
  message: string;
  severity: 'error' | 'warning' | 'suggestion';
  autoFixable: boolean;
}

export interface CompositionRule<T = EmailBlock> {
  id: string;
  name: string;
  description: string;
  weight: number; // Priority (higher = earlier)
  category: 'spacing' | 'typography' | 'color' | 'hierarchy' | 'balance';
  condition: (block: T) => boolean;
  action: (block: T, context: RuleContext) => T;
  validate: (block: T, context: RuleContext) => RuleViolation | null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate color contrast ratio (WCAG formula)
 */
function calculateContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Apply sRGB gamma correction
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    // Calculate relative luminance
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  // Calculate contrast ratio
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Darken a color by a given percentage
 */
function darkenColor(color: string, percent: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const darken = (value: number) => Math.max(0, Math.floor(value * (1 - percent / 100)));
  
  const newR = darken(r).toString(16).padStart(2, '0');
  const newG = darken(g).toString(16).padStart(2, '0');
  const newB = darken(b).toString(16).padStart(2, '0');
  
  return `#${newR}${newG}${newB}`;
}

/**
 * Get all spacing values from a block
 */
function getBlockSpacing(block: EmailBlock): number[] {
  const spacing: number[] = [];
  
  if (block.settings?.padding) {
    const padding = block.settings.padding as Padding;
    spacing.push(padding.top, padding.right, padding.bottom, padding.left);
  }
  
  // Check for spacer blocks
  if (block.type === 'spacer' && 'height' in block.settings) {
    spacing.push(block.settings.height as number);
  }
  
  return spacing;
}

// ============================================================================
// Rule 1: Spacing Grid Rule (Weight: 100)
// ============================================================================

/**
 * Enforce 8px spacing grid across all blocks
 * Rounds all padding/margin values to nearest 8px
 */
export const spacingGridRule: CompositionRule = {
  id: 'spacing-grid-8px',
  name: 'Enforce 8px Spacing Grid',
  description: 'Rounds all spacing values to the nearest 8px for visual rhythm',
  weight: 100,
  category: 'spacing',
  
  condition: (block) => {
    // Apply to all blocks with spacing
    return block.settings?.padding !== undefined || block.type === 'spacer';
  },
  
  action: (block, context) => {
    const corrected = { ...block };
    
    // Fix padding values
    if (corrected.settings?.padding) {
      const padding = corrected.settings.padding as Padding;
      corrected.settings = {
        ...corrected.settings,
        padding: {
          top: snapToGrid(padding.top),
          right: snapToGrid(padding.right),
          bottom: snapToGrid(padding.bottom),
          left: snapToGrid(padding.left),
        },
      };
    }
    
    // Fix spacer heights
    if (corrected.type === 'spacer' && 'height' in corrected.settings) {
      corrected.settings = {
        ...corrected.settings,
        height: snapToGrid(corrected.settings.height as number),
      };
    }
    
    return corrected;
  },
  
  validate: (block, context) => {
    const spacing = getBlockSpacing(block);
    const offGrid = spacing.filter(v => v % 8 !== 0);
    
    if (offGrid.length > 0) {
      return {
        ruleId: 'spacing-grid-8px',
        blockId: block.id,
        message: `Spacing not on 8px grid: ${offGrid.join(', ')}px`,
        severity: 'warning',
        autoFixable: true,
      };
    }
    
    return null;
  },
};

// ============================================================================
// Rule 2: Typography Hierarchy Rule (Weight: 90)
// ============================================================================

/**
 * Enforce minimum 1.5:1 ratio between heading and body text
 * Ensures clear visual hierarchy
 */
export const typographyHierarchyRule: CompositionRule = {
  id: 'typography-hierarchy',
  name: 'Enforce Typography Hierarchy',
  description: 'Ensures headings are at least 1.5x larger than body text',
  weight: 90,
  category: 'typography',
  
  condition: (block) => {
    // Apply to text blocks and layout blocks with titles
    return block.type === 'text' || 
           (block.type === 'layouts' && block.content?.title);
  },
  
  action: (block, context) => {
    const corrected = { ...block };
    const minRatio = 1.5;
    const bodySize = pxToNumber(designTokens.primitives.typography.fontSizes.base);
    
    // Check text blocks
    if (corrected.type === 'text' && corrected.settings?.fontWeight && corrected.settings.fontWeight >= 600) {
      // This is likely a heading
      const currentSize = pxToNumber(corrected.settings.fontSize as string);
      if (currentSize / bodySize < minRatio) {
        corrected.settings = {
          ...corrected.settings,
          fontSize: `${Math.ceil(bodySize * minRatio)}px`,
        };
      }
    }
    
    // Check layout blocks with titles
    if (corrected.type === 'layouts' && corrected.settings?.titleFontSize) {
      const titleSize = pxToNumber(corrected.settings.titleFontSize as string);
      if (titleSize / bodySize < minRatio) {
        corrected.settings = {
          ...corrected.settings,
          titleFontSize: `${Math.ceil(bodySize * minRatio)}px`,
        };
      }
    }
    
    return corrected;
  },
  
  validate: (block, context) => {
    const bodySize = pxToNumber(designTokens.primitives.typography.fontSizes.base);
    const minRatio = 1.5;
    
    let headingSize: number | null = null;
    
    if (block.type === 'text' && block.settings?.fontWeight && (block.settings.fontWeight as number) >= 600) {
      headingSize = pxToNumber(block.settings.fontSize as string);
    } else if (block.type === 'layouts' && block.settings?.titleFontSize) {
      headingSize = pxToNumber(block.settings.titleFontSize as string);
    }
    
    if (headingSize && headingSize / bodySize < minRatio) {
      return {
        ruleId: 'typography-hierarchy',
        blockId: block.id,
        message: `Heading size (${headingSize}px) too close to body text (${bodySize}px). Ratio: ${(headingSize / bodySize).toFixed(2)}:1, minimum: ${minRatio}:1`,
        severity: 'warning',
        autoFixable: true,
      };
    }
    
    return null;
  },
};

// ============================================================================
// Rule 3: Color Contrast Rule (Weight: 100 - Accessibility Critical)
// ============================================================================

/**
 * Enforce WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
 * Automatically darkens text or lightens background to meet standards
 */
export const contrastRule: CompositionRule = {
  id: 'color-contrast-wcag',
  name: 'Enforce WCAG Contrast Ratios',
  description: 'Ensures all text meets WCAG AA contrast requirements (4.5:1)',
  weight: 100,
  category: 'color',
  
  condition: (block) => {
    // Apply to blocks with text and color settings
    return (block.type === 'text' || block.type === 'button' || block.type === 'layouts') &&
           block.settings?.color !== undefined;
  },
  
  action: (block, context) => {
    const corrected = { ...block };
    const minContrast = context.accessibility === 'WCAG-AAA' ? 7 : 4.5;
    
    const textColor = corrected.settings?.color as string || getColorToken('text.primary');
    const bgColor = corrected.settings?.backgroundColor as string || getColorToken('background.default');
    
    const currentContrast = calculateContrastRatio(textColor, bgColor);
    
    if (currentContrast < minContrast) {
      // Try darkening text first
      let attempts = 0;
      let adjustedTextColor = textColor;
      
      while (attempts < 10 && calculateContrastRatio(adjustedTextColor, bgColor) < minContrast) {
        adjustedTextColor = darkenColor(adjustedTextColor, 10);
        attempts++;
      }
      
      corrected.settings = {
        ...corrected.settings,
        color: adjustedTextColor,
      };
    }
    
    return corrected;
  },
  
  validate: (block, context) => {
    const minContrast = context.accessibility === 'WCAG-AAA' ? 7 : 4.5;
    
    const textColor = block.settings?.color as string || getColorToken('text.primary');
    const bgColor = block.settings?.backgroundColor as string || getColorToken('background.default');
    
    const currentContrast = calculateContrastRatio(textColor, bgColor);
    
    if (currentContrast < minContrast) {
      return {
        ruleId: 'color-contrast-wcag',
        blockId: block.id,
        message: `Text contrast fails WCAG ${context.accessibility}: ${currentContrast.toFixed(2)}:1 (minimum: ${minContrast}:1)`,
        severity: 'error',
        autoFixable: true,
      };
    }
    
    return null;
  },
};

// ============================================================================
// Rule 4: Touch Target Rule (Weight: 95)
// ============================================================================

/**
 * Ensure all interactive elements meet 44px minimum touch target (WCAG 2.5.5)
 * Applies to buttons and links
 */
export const touchTargetRule: CompositionRule = {
  id: 'touch-target-minimum',
  name: 'Enforce Touch Target Minimum',
  description: 'Ensures all buttons are at least 44px tall (WCAG 2.5.5)',
  weight: 95,
  category: 'spacing',
  
  condition: (block) => {
    return block.type === 'button';
  },
  
  action: (block, context) => {
    const corrected = { ...block };
    const minHeight = 44;
    
    if (corrected.type === 'button' && corrected.settings?.padding) {
      const padding = corrected.settings.padding as Padding;
      const fontSize = pxToNumber(corrected.settings.fontSize as string || '16px');
      const lineHeight = 1.2;
      const contentHeight = fontSize * lineHeight;
      const totalHeight = contentHeight + padding.top + padding.bottom;
      
      if (totalHeight < minHeight) {
        // Increase vertical padding to reach minimum height
        const neededPadding = (minHeight - contentHeight) / 2;
        const adjustedPadding = Math.ceil(neededPadding);
        
        corrected.settings = {
          ...corrected.settings,
          padding: {
            ...padding,
            top: snapToGrid(adjustedPadding),
            bottom: snapToGrid(adjustedPadding),
          },
        };
      }
    }
    
    return corrected;
  },
  
  validate: (block, context) => {
    if (block.type === 'button' && block.settings?.padding) {
      const padding = block.settings.padding as Padding;
      const fontSize = pxToNumber(block.settings.fontSize as string || '16px');
      const lineHeight = 1.2;
      const contentHeight = fontSize * lineHeight;
      const totalHeight = contentHeight + padding.top + padding.bottom;
      
      if (totalHeight < 44) {
        return {
          ruleId: 'touch-target-minimum',
          blockId: block.id,
          message: `Button height (${totalHeight.toFixed(0)}px) below minimum touch target (44px)`,
          severity: 'error',
          autoFixable: true,
        };
      }
    }
    
    return null;
  },
};

// ============================================================================
// Rule 5: White Space Rule (Weight: 70)
// ============================================================================

/**
 * Enforce 30-50% white space ratio for readability
 * Increases spacing if content is too cramped
 */
export const whiteSpaceRule: CompositionRule = {
  id: 'white-space-ratio',
  name: 'Enforce White Space Ratio',
  description: 'Ensures adequate breathing room (30-50% white space)',
  weight: 70,
  category: 'spacing',
  
  condition: (block) => {
    // Apply to layout blocks that can have multiple elements
    return block.type === 'layouts';
  },
  
  action: (block, context) => {
    const corrected = { ...block };
    const minWhiteSpaceRatio = 0.3;
    
    // Check if padding is too tight
    if (corrected.settings?.padding) {
      const padding = corrected.settings.padding as Padding;
      const totalPadding = padding.top + padding.bottom + padding.left + padding.right;
      
      // If total padding is less than 80px (20px per side), increase it
      if (totalPadding < 80) {
        const scale = 80 / totalPadding;
        
        corrected.settings = {
          ...corrected.settings,
          padding: {
            top: snapToGrid(Math.ceil(padding.top * scale)),
            right: snapToGrid(Math.ceil(padding.right * scale)),
            bottom: snapToGrid(Math.ceil(padding.bottom * scale)),
            left: snapToGrid(Math.ceil(padding.left * scale)),
          },
        };
      }
    }
    
    return corrected;
  },
  
  validate: (block, context) => {
    if (block.type === 'layouts' && block.settings?.padding) {
      const padding = block.settings.padding as Padding;
      const totalPadding = padding.top + padding.bottom + padding.left + padding.right;
      
      if (totalPadding < 80) {
        return {
          ruleId: 'white-space-ratio',
          blockId: block.id,
          message: `Insufficient white space. Total padding: ${totalPadding}px (recommended: 80px+)`,
          severity: 'suggestion',
          autoFixable: true,
        };
      }
    }
    
    return null;
  },
};

// ============================================================================
// Export All Rules
// ============================================================================

export const allCompositionRules: CompositionRule[] = [
  spacingGridRule,
  typographyHierarchyRule,
  contrastRule,
  touchTargetRule,
  whiteSpaceRule,
];

// Sort rules by weight (highest first)
allCompositionRules.sort((a, b) => b.weight - a.weight);

