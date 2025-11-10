/**
 * AI Block Intelligence System
 * 
 * Smart block selection, typography recommendations, and campaign analysis
 * to help AI generate optimal block-based emails.
 */

import { BlockType, EmailBlock } from '../../email/blocks/types';

// ============================================================================
// Campaign Analysis Types
// ============================================================================

export type CampaignType = 
  | 'product-launch' 
  | 'newsletter' 
  | 'promo' 
  | 'welcome' 
  | 'announcement'
  | 'update'
  | 'editorial'
  | 'sales';

export type ContentCharacteristics = {
  hasStats: boolean;
  hasTestimonials: boolean;
  hasFeatures: boolean;
  hasComparison: boolean;
  hasUrgency: boolean;
  hasSocialProof: boolean;
  isStoryDriven: boolean;
  isDataDriven: boolean;
};

export type CampaignAnalysis = {
  type: CampaignType;
  characteristics: ContentCharacteristics;
  urgencyLevel: 'low' | 'medium' | 'high';
  importanceLevel: 'standard' | 'important' | 'major';
  tone: 'professional' | 'friendly' | 'casual';
};

// ============================================================================
// Typography Scale Definitions
// ============================================================================

export const TYPOGRAPHY_SCALES = {
  premium: {
    name: 'Premium Scale',
    description: 'High impact, urgent, major announcements',
    heroHeadline: '70px',
    sectionHeadline: '56px',
    statsValue: '100px',
    statsValueAlt: '48px',
    bodyEmphasis: '18px',
    bodyStandard: '16px',
    weightHero: 900,
    weightHeadline: 800,
    weightEmphasis: 600,
    weightBody: 400,
  },
  standard: {
    name: 'Standard Scale',
    description: 'Most campaigns, balanced approach',
    heroHeadline: '56px',
    sectionHeadline: '44px',
    statsValue: '80px',
    statsValueAlt: '48px',
    bodyEmphasis: '16px',
    bodyStandard: '16px',
    weightHero: 800,
    weightHeadline: 700,
    weightEmphasis: 600,
    weightBody: 400,
  },
  minimal: {
    name: 'Minimal Scale',
    description: 'Editorial, professional, sophisticated',
    heroHeadline: '44px',
    sectionHeadline: '32px',
    statsValue: '64px',
    statsValueAlt: '48px',
    bodyEmphasis: '16px',
    bodyStandard: '14px',
    weightHero: 700,
    weightHeadline: 600,
    weightEmphasis: 500,
    weightBody: 400,
  },
} as const;

export type TypographyScale = keyof typeof TYPOGRAPHY_SCALES;

// ============================================================================
// Spacing Scale Definitions
// ============================================================================

export const SPACING_SCALES = {
  generous: {
    name: 'Generous Spacing',
    description: 'Premium feel, breathing room',
    section: { top: 60, bottom: 60, left: 40, right: 40 },
    hero: { top: 80, bottom: 80, left: 40, right: 40 },
    spacerHeight: 60,
  },
  standard: {
    name: 'Standard Spacing',
    description: 'Balanced, most campaigns',
    section: { top: 40, bottom: 40, left: 20, right: 20 },
    hero: { top: 60, bottom: 60, left: 40, right: 40 },
    spacerHeight: 40,
  },
  compact: {
    name: 'Compact Spacing',
    description: 'Content-dense, information-heavy',
    section: { top: 20, bottom: 20, left: 20, right: 20 },
    hero: { top: 40, bottom: 40, left: 20, right: 20 },
    spacerHeight: 24,
  },
} as const;

export type SpacingScale = keyof typeof SPACING_SCALES;

// ============================================================================
// Block Sequence Patterns
// ============================================================================

export const BLOCK_PATTERNS = {
  'product-launch': {
    description: 'Major product release with impact',
    recommendedSequence: [
      'spacer',
      'logo',
      'spacer',
      'hero',
      'text',
      'stats',
      'featuregrid',
      'testimonial',
      'button',
      'divider',
      'footer',
    ] as BlockType[],
    typographyScale: 'premium' as TypographyScale,
    spacingScale: 'generous' as SpacingScale,
  },
  newsletter: {
    description: 'Regular updates and news',
    recommendedSequence: [
      'spacer',
      'heading',
      'text',
      'divider',
      'heading',
      'text',
      'button',
      'footer',
    ] as BlockType[],
    typographyScale: 'standard' as TypographyScale,
    spacingScale: 'standard' as SpacingScale,
  },
  promo: {
    description: 'Promotional offers with urgency',
    recommendedSequence: [
      'spacer',
      'hero',
      'comparison',
      'stats',
      'button',
      'text',
      'button',
      'footer',
    ] as BlockType[],
    typographyScale: 'premium' as TypographyScale,
    spacingScale: 'generous' as SpacingScale,
  },
  welcome: {
    description: 'Welcoming new users or subscribers',
    recommendedSequence: [
      'spacer',
      'logo',
      'spacer',
      'hero',
      'text',
      'featuregrid',
      'button',
      'divider',
      'text',
      'footer',
    ] as BlockType[],
    typographyScale: 'standard' as TypographyScale,
    spacingScale: 'standard' as SpacingScale,
  },
  announcement: {
    description: 'Important company updates',
    recommendedSequence: [
      'spacer',
      'hero',
      'text',
      'stats',
      'button',
      'divider',
      'footer',
    ] as BlockType[],
    typographyScale: 'premium' as TypographyScale,
    spacingScale: 'generous' as SpacingScale,
  },
  update: {
    description: 'Feature updates or improvements',
    recommendedSequence: [
      'spacer',
      'heading',
      'text',
      'featuregrid',
      'button',
      'footer',
    ] as BlockType[],
    typographyScale: 'standard' as TypographyScale,
    spacingScale: 'standard' as SpacingScale,
  },
  editorial: {
    description: 'Content-focused, thought leadership',
    recommendedSequence: [
      'spacer',
      'heading',
      'text',
      'divider',
      'text',
      'testimonial',
      'button',
      'footer',
    ] as BlockType[],
    typographyScale: 'minimal' as TypographyScale,
    spacingScale: 'generous' as SpacingScale,
  },
  sales: {
    description: 'Direct sales pitch',
    recommendedSequence: [
      'spacer',
      'hero',
      'stats',
      'comparison',
      'testimonial',
      'button',
      'text',
      'button',
      'footer',
    ] as BlockType[],
    typographyScale: 'premium' as TypographyScale,
    spacingScale: 'standard' as SpacingScale,
  },
} as const;

// ============================================================================
// Campaign Analysis Functions
// ============================================================================

/**
 * Analyze campaign prompt and content to determine campaign type
 */
export function analyzeCampaign(prompt: string, tone: string = 'friendly'): CampaignAnalysis {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect urgency keywords
  const urgencyKeywords = ['urgent', 'limited', 'deadline', 'expires', 'today', 'now', 'hurry', 'last chance'];
  const hasUrgency = urgencyKeywords.some(keyword => lowerPrompt.includes(keyword));
  
  // Detect importance keywords
  const majorKeywords = ['launch', 'introducing', 'announcing', 'major', 'big news', 'milestone', 'funding'];
  const importantKeywords = ['important', 'update', 'new feature', 'improvement'];
  const isMajor = majorKeywords.some(keyword => lowerPrompt.includes(keyword));
  const isImportant = importantKeywords.some(keyword => lowerPrompt.includes(keyword));
  
  // Detect content characteristics
  const characteristics: ContentCharacteristics = {
    hasStats: /\d+%|\d+x|numbers|stats|growth|users|customers/i.test(prompt),
    hasTestimonials: /testimonial|review|customer|quote|success story/i.test(prompt),
    hasFeatures: /feature|capability|benefit|advantage/i.test(prompt),
    hasComparison: /before|after|vs|versus|compare|old way|new way/i.test(prompt),
    hasUrgency,
    hasSocialProof: /proven|trusted|customers|users|reviews/i.test(prompt),
    isStoryDriven: /story|journey|behind the scenes|founder/i.test(prompt),
    isDataDriven: /data|analytics|metrics|performance|results/i.test(prompt),
  };
  
  // Determine campaign type
  let type: CampaignType = 'newsletter'; // default
  
  if (/launch|introducing|new product/i.test(prompt)) {
    type = 'product-launch';
  } else if (/welcome|getting started|onboarding/i.test(prompt)) {
    type = 'welcome';
  } else if (/promo|discount|sale|offer|deal/i.test(prompt)) {
    type = 'promo';
  } else if (/announce|announcement|news/i.test(prompt)) {
    type = 'announcement';
  } else if (/update|improvement|changelog/i.test(prompt)) {
    type = 'update';
  } else if (/thought leadership|editorial|article|blog/i.test(prompt)) {
    type = 'editorial';
  } else if (/sell|buy|purchase|demo|trial/i.test(prompt)) {
    type = 'sales';
  }
  
  // Determine urgency level
  let urgencyLevel: 'low' | 'medium' | 'high' = 'low';
  if (hasUrgency || /flash|limited time|expires/i.test(prompt)) {
    urgencyLevel = 'high';
  } else if (type === 'promo' || type === 'sales') {
    urgencyLevel = 'medium';
  }
  
  // Determine importance level
  let importanceLevel: 'standard' | 'important' | 'major' = 'standard';
  if (isMajor) {
    importanceLevel = 'major';
  } else if (isImportant) {
    importanceLevel = 'important';
  }
  
  return {
    type,
    characteristics,
    urgencyLevel,
    importanceLevel,
    tone: tone as 'professional' | 'friendly' | 'casual',
  };
}

/**
 * Select optimal typography scale based on campaign analysis
 */
export function selectTypographyScale(analysis: CampaignAnalysis): TypographyScale {
  // Premium scale for major announcements and high-urgency campaigns
  if (analysis.importanceLevel === 'major' || analysis.urgencyLevel === 'high') {
    return 'premium';
  }
  
  // Minimal scale for editorial and professional content
  if (analysis.type === 'editorial' || analysis.tone === 'professional') {
    return 'minimal';
  }
  
  // Standard scale for everything else
  return 'standard';
}

/**
 * Select optimal spacing scale based on campaign analysis
 */
export function selectSpacingScale(analysis: CampaignAnalysis): SpacingScale {
  // Generous spacing for premium campaigns
  if (analysis.importanceLevel === 'major' || analysis.type === 'product-launch') {
    return 'generous';
  }
  
  // Compact spacing for newsletters and updates
  if (analysis.type === 'newsletter' || analysis.type === 'update') {
    return 'compact';
  }
  
  // Standard spacing for everything else
  return 'standard';
}

/**
 * Get recommended block sequence for campaign type
 */
export function getRecommendedBlockSequence(analysis: CampaignAnalysis): BlockType[] {
  const pattern = BLOCK_PATTERNS[analysis.type];
  return pattern ? pattern.recommendedSequence : BLOCK_PATTERNS.newsletter.recommendedSequence;
}

/**
 * Generate typography settings based on scale
 */
export function getTypographySettings(scale: TypographyScale) {
  return TYPOGRAPHY_SCALES[scale];
}

/**
 * Generate spacing settings based on scale
 */
export function getSpacingSettings(scale: SpacingScale) {
  return SPACING_SCALES[scale];
}

/**
 * Get AI recommendations for a campaign
 */
export function getCampaignRecommendations(prompt: string, tone: string = 'friendly') {
  const analysis = analyzeCampaign(prompt, tone);
  const typographyScale = selectTypographyScale(analysis);
  const spacingScale = selectSpacingScale(analysis);
  const blockSequence = getRecommendedBlockSequence(analysis);
  const typography = getTypographySettings(typographyScale);
  const spacing = getSpacingSettings(spacingScale);
  
  return {
    analysis,
    typographyScale,
    spacingScale,
    blockSequence,
    typography,
    spacing,
    recommendations: {
      useStats: analysis.characteristics.hasStats,
      useTestimonial: analysis.characteristics.hasTestimonials || analysis.characteristics.hasSocialProof,
      useComparison: analysis.characteristics.hasComparison,
      useFeatureGrid: analysis.characteristics.hasFeatures,
      useHero: analysis.importanceLevel !== 'standard',
      emphasizeCTA: analysis.urgencyLevel === 'high',
    },
  };
}

// ============================================================================
// Color Palette
// ============================================================================

export const COLOR_PALETTE = {
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6b7280',
  
  // Background colors
  bgWhite: '#ffffff',
  bgLight: '#f9fafb',
  bgGray: '#f3f4f6',
  
  // Brand colors (defaults)
  brandPrimary: '#2563eb',
  brandSecondary: '#7c3aed',
  
  // State colors
  success: '#16a34a',
  successBg: '#f0fdf4',
  warning: '#dc2626',
  warningBg: '#fef2f2',
  
  // Borders
  borderLight: '#e5e7eb',
  borderDark: '#d1d5db',
} as const;

/**
 * Get brand colors from brand kit or use defaults
 */
export function getBrandColors(brandKit?: { primaryColor?: string; secondaryColor?: string; accentColor?: string }) {
  return {
    primary: brandKit?.primaryColor || COLOR_PALETTE.brandPrimary,
    secondary: brandKit?.secondaryColor || COLOR_PALETTE.brandSecondary,
    accent: brandKit?.accentColor || COLOR_PALETTE.brandPrimary,
  };
}

