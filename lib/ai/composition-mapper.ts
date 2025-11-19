/**
 * Semantic Composition Mapper
 * 
 * Translates high-level semantic intent into concrete design token values.
 * Enables AI to speak in human terms ("balanced spacing", "pronounced hierarchy")
 * while maintaining technical precision.
 */

import { 
  designTokens,
  getSpacingToken,
  getColorToken,
  getTypographyToken,
  pxToNumber,
  type SemanticSpacingKey,
  type ColorKey,
  type TypographyKey,
} from '../email/design-tokens';

// ============================================================================
// Semantic Intent Types
// ============================================================================

/**
 * High-level aesthetic decisions AI can understand
 */
export interface SemanticCompositionConfig {
  aesthetic?: {
    mood?: 'professional' | 'playful' | 'elegant' | 'minimal';
    energy?: 'calm' | 'balanced' | 'dynamic';
    density?: 'compact' | 'comfortable' | 'spacious';
    contrast?: 'subtle' | 'moderate' | 'strong';
  };
  spacing?: {
    verticalRhythm?: 'tight' | 'balanced' | 'relaxed' | 'loose';
    horizontalFlow?: 'compact' | 'standard' | 'wide';
    breathing?: 'minimal' | 'comfortable' | 'generous';
  };
  typography?: {
    scale?: 'minor-second' | 'major-second' | 'minor-third' | 'major-third' | 'perfect-fourth';
    hierarchy?: 'flat' | 'moderate' | 'pronounced';
    pairing?: 'monochrome' | 'serif-sans' | 'display-body';
  };
  hierarchy?: {
    emphasis?: 'header' | 'content' | 'actions' | 'balanced';
    flow?: 'top-down' | 'left-right' | 'center-out' | 'z-pattern';
    scannability?: 'high' | 'medium' | 'low';
  };
  layout?: {
    structure?: 'single-column' | 'two-column' | 'grid' | 'masonry';
    alignment?: 'strict' | 'organic' | 'grid-aligned';
    balance?: 'symmetrical' | 'asymmetrical' | 'radial';
  };
}

/**
 * Concrete design values mapped from semantic intent
 */
export interface ConcreteDesignValues {
  spacing: {
    section: string;
    component: string;
    content: string;
    padding: string;
  };
  typography: {
    headingSize: string;
    bodySize: string;
    scale: number;
    headingWeight: number;
    bodyWeight: number;
  };
  colors: {
    text: string;
    heading: string;
    background: string;
    action: string;
  };
  hierarchy: {
    primaryWeight: number;
    secondaryWeight: number;
    tertiaryWeight: number;
  };
}

// ============================================================================
// Semantic Composition Mapper Class
// ============================================================================

export class SemanticCompositionMapper {
  /**
   * Map semantic intent to concrete design token values
   */
  mapToConcreteValues(config: SemanticCompositionConfig): ConcreteDesignValues {
    return {
      spacing: this.mapSpacing(config.spacing || {}),
      typography: this.mapTypography(config.typography || {}),
      colors: this.mapColors(config.aesthetic || {}),
      hierarchy: this.mapHierarchy(config.hierarchy || {}),
    };
  }
  
  /**
   * Map spacing semantic values to tokens
   */
  private mapSpacing(spacing: SemanticCompositionConfig['spacing']): ConcreteDesignValues['spacing'] {
    const verticalRhythm = spacing?.verticalRhythm || 'balanced';
    const horizontalFlow = spacing?.horizontalFlow || 'standard';
    const breathing = spacing?.breathing || 'comfortable';
    
    const spacingMap = {
      // Vertical rhythm (section spacing)
      tight: getSpacingToken('section.standard'),      // 40px
      balanced: getSpacingToken('section.comfortable'), // 48px
      relaxed: getSpacingToken('section.hero'),        // 80px
      loose: getSpacingToken('section.hero'),          // 80px
      
      // Horizontal flow (component spacing)
      compact: getSpacingToken('content.tight'),      // 8px
      standard: getSpacingToken('content.balanced'),   // 16px
      wide: getSpacingToken('content.relaxed'),       // 24px
      
      // Breathing room (content spacing)
      minimal: getSpacingToken('content.tight'),      // 8px
      comfortable: getSpacingToken('content.balanced'), // 16px
      generous: getSpacingToken('content.spacious'),  // 32px
    };
    
    return {
      section: spacingMap[verticalRhythm],
      component: spacingMap[horizontalFlow],
      content: spacingMap[breathing],
      padding: spacingMap[breathing],
    };
  }
  
  /**
   * Map typography semantic values to concrete settings
   */
  private mapTypography(typography: SemanticCompositionConfig['typography']): ConcreteDesignValues['typography'] {
    const scale = typography?.scale || 'major-third';
    const hierarchy = typography?.hierarchy || 'moderate';
    
    // Typography scale ratios
    const scaleMap = {
      'minor-second': 1.067,
      'major-second': 1.125,
      'minor-third': 1.2,
      'major-third': 1.25,
      'perfect-fourth': 1.333,
    };
    
    // Hierarchy weight multipliers
    const hierarchyMap = {
      flat: { primary: 1.2, secondary: 1.1, tertiary: 1 },
      moderate: { primary: 2, secondary: 1.5, tertiary: 1 },
      pronounced: { primary: 3, secondary: 2, tertiary: 1 },
    };
    
    const scaleRatio = scaleMap[scale];
    const hierarchyWeights = hierarchyMap[hierarchy];
    
    const bodySize = designTokens.primitives.typography.fontSizes.base;
    const baseSize = pxToNumber(bodySize);
    const headingSize = Math.round(baseSize * hierarchyWeights.primary);
    
    return {
      headingSize: `${headingSize}px`,
      bodySize: bodySize,
      scale: scaleRatio,
      headingWeight: 700,
      bodyWeight: 400,
    };
  }
  
  /**
   * Map aesthetic values to color tokens
   */
  private mapColors(aesthetic: SemanticCompositionConfig['aesthetic']): ConcreteDesignValues['colors'] {
    const mood = aesthetic?.mood || 'professional';
    const contrast = aesthetic?.contrast || 'moderate';
    
    // Mood affects color palette choices
    const moodColorMap = {
      professional: {
        text: getColorToken('text.primary'),
        heading: getColorToken('text.primary'),
        background: getColorToken('background.default'),
        action: getColorToken('action.primary'),
      },
      playful: {
        text: getColorToken('text.secondary'),
        heading: getColorToken('text.primary'),
        background: getColorToken('background.alt'),
        action: getColorToken('action.secondary'),
      },
      elegant: {
        text: getColorToken('text.primary'),
        heading: getColorToken('text.primary'),
        background: getColorToken('background.default'),
        action: designTokens.primitives.colors.neutral[900],
      },
      minimal: {
        text: getColorToken('text.secondary'),
        heading: getColorToken('text.primary'),
        background: getColorToken('background.default'),
        action: getColorToken('text.primary'),
      },
    };
    
    return moodColorMap[mood];
  }
  
  /**
   * Map hierarchy values to weight settings
   */
  private mapHierarchy(hierarchy: SemanticCompositionConfig['hierarchy']): ConcreteDesignValues['hierarchy'] {
    const emphasis = hierarchy?.emphasis || 'balanced';
    
    const emphasisMap = {
      header: { primaryWeight: 3, secondaryWeight: 1.5, tertiaryWeight: 1 },
      content: { primaryWeight: 1.5, secondaryWeight: 2.5, tertiaryWeight: 1 },
      actions: { primaryWeight: 1, secondaryWeight: 1, tertiaryWeight: 3 },
      balanced: { primaryWeight: 2, secondaryWeight: 2, tertiaryWeight: 2 },
    };
    
    return emphasisMap[emphasis];
  }
  
  /**
   * Generate AI-friendly prompt snippet from semantic config
   */
  generatePromptSnippet(config: SemanticCompositionConfig): string {
    const values = this.mapToConcreteValues(config);
    
    return `
COMPOSITION GUIDANCE:
- Spacing: Use ${values.spacing.section} between major sections, ${values.spacing.content} between related elements
- Typography: Headings at ${values.typography.headingSize}, body at ${values.typography.bodySize}
- Colors: Text ${values.colors.text}, headings ${values.colors.heading}, actions ${values.colors.action}
- Hierarchy: ${config.hierarchy?.emphasis || 'balanced'} emphasis with ${config.typography?.hierarchy || 'moderate'} scale
    `.trim();
  }
  
  /**
   * Get recommended layout based on semantic config
   */
  recommendLayout(config: SemanticCompositionConfig): string[] {
    const structure = config.layout?.structure || 'single-column';
    const density = config.aesthetic?.density || 'comfortable';
    
    if (structure === 'two-column') {
      if (density === 'compact') {
        return ['two-column-60-40', 'two-column-50-50'];
      }
      return ['two-column-50-50', 'two-column-60-40', 'two-column-40-60'];
    }
    
    if (structure === 'grid') {
      return ['stats-3-col', 'stats-4-col'];
    }
    
    // Single column recommendations
    if (density === 'spacious') {
      return ['hero-center', 'card-centered'];
    } else if (density === 'compact') {
      return ['compact-image-text', 'two-column-text'];
    }
    
    return ['hero-center', 'two-column-50-50', 'card-centered'];
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a default semantic composition config
 */
export function createDefaultSemanticConfig(): SemanticCompositionConfig {
  return {
    aesthetic: {
      mood: 'professional',
      energy: 'balanced',
      density: 'comfortable',
      contrast: 'moderate',
    },
    spacing: {
      verticalRhythm: 'balanced',
      horizontalFlow: 'standard',
      breathing: 'comfortable',
    },
    typography: {
      scale: 'major-third',
      hierarchy: 'moderate',
      pairing: 'monochrome',
    },
    hierarchy: {
      emphasis: 'balanced',
      flow: 'top-down',
      scannability: 'high',
    },
    layout: {
      structure: 'single-column',
      alignment: 'grid-aligned',
      balance: 'symmetrical',
    },
  };
}

/**
 * Parse natural language intent into semantic config
 */
export function parseNaturalLanguageIntent(intent: string): Partial<SemanticCompositionConfig> {
  const lower = intent.toLowerCase();
  const config: Partial<SemanticCompositionConfig> = {};
  
  // Detect spacing preferences
  if (lower.includes('tight') || lower.includes('compact')) {
    config.spacing = { verticalRhythm: 'tight', horizontalFlow: 'compact', breathing: 'minimal' };
  } else if (lower.includes('spacious') || lower.includes('generous')) {
    config.spacing = { verticalRhythm: 'loose', horizontalFlow: 'wide', breathing: 'generous' };
  }
  
  // Detect mood
  if (lower.includes('professional') || lower.includes('business')) {
    config.aesthetic = { ...config.aesthetic, mood: 'professional' };
  } else if (lower.includes('playful') || lower.includes('fun')) {
    config.aesthetic = { ...config.aesthetic, mood: 'playful' };
  } else if (lower.includes('elegant') || lower.includes('sophisticated')) {
    config.aesthetic = { ...config.aesthetic, mood: 'elegant' };
  } else if (lower.includes('minimal') || lower.includes('clean')) {
    config.aesthetic = { ...config.aesthetic, mood: 'minimal' };
  }
  
  // Detect hierarchy
  if (lower.includes('flat') || lower.includes('subtle')) {
    config.typography = { ...config.typography, hierarchy: 'flat' };
  } else if (lower.includes('pronounced') || lower.includes('strong') || lower.includes('bold')) {
    config.typography = { ...config.typography, hierarchy: 'pronounced' };
  }
  
  return config;
}

// ============================================================================
// Export Default Mapper
// ============================================================================

export const defaultSemanticMapper = new SemanticCompositionMapper();

