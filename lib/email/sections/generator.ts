/**
 * Section Variant Generator
 * 
 * Systematically generates design variants of base section templates
 * to scale the library from 15 to 50+ sections.
 */

import type { SectionTemplate, DesignStyle } from './types';
import { applyDesignVariant, COLOR_SCHEMES, SPACING_SCALES, TYPOGRAPHY_SCALES } from './design-system';

// ============================================================================
// Variant Generation
// ============================================================================

export interface VariantConfig {
  colorScheme: string;
  spacingScale?: string;
  typographyScale?: string;
  nameSuffix: string;
  idSuffix: string;
}

/**
 * Default variant configurations
 */
export const DEFAULT_VARIANT_CONFIGS: VariantConfig[] = [
  {
    colorScheme: 'minimal-gray',
    spacingScale: 'standard',
    typographyScale: 'standard',
    nameSuffix: 'Minimal',
    idSuffix: 'minimal',
  },
  {
    colorScheme: 'bold-purple',
    spacingScale: 'spacious',
    typographyScale: 'bold',
    nameSuffix: 'Bold Purple',
    idSuffix: 'bold-purple',
  },
  {
    colorScheme: 'warm-red',
    spacingScale: 'standard',
    typographyScale: 'bold',
    nameSuffix: 'Warm Red',
    idSuffix: 'warm-red',
  },
  {
    colorScheme: 'cool-blue',
    spacingScale: 'spacious',
    typographyScale: 'standard',
    nameSuffix: 'Cool Blue',
    idSuffix: 'cool-blue',
  },
  {
    colorScheme: 'elegant-black',
    spacingScale: 'premium',
    typographyScale: 'luxury',
    nameSuffix: 'Elegant',
    idSuffix: 'elegant',
  },
  {
    colorScheme: 'gradient-sunset',
    spacingScale: 'spacious',
    typographyScale: 'bold',
    nameSuffix: 'Gradient',
    idSuffix: 'gradient',
  },
];

/**
 * Generate a variant of a section template
 */
export function generateVariant(
  baseSection: SectionTemplate,
  variantConfig: VariantConfig
): SectionTemplate {
  // Apply design variant to blocks
  const variantBlocks = applyDesignVariant(baseSection.blocks, {
    colorScheme: variantConfig.colorScheme,
    spacingScale: variantConfig.spacingScale || 'standard',
    typographyScale: variantConfig.typographyScale || 'standard',
  });
  
  // Determine design style based on config
  const designStyle = determineDesignStyle(variantConfig);
  
  // Create variant section
  return {
    ...baseSection,
    id: `${baseSection.id}-${variantConfig.idSuffix}`,
    name: `${baseSection.name} (${variantConfig.nameSuffix})`,
    colorScheme: variantConfig.colorScheme,
    designStyle,
    blocks: variantBlocks,
    aiContext: {
      ...baseSection.aiContext,
      keywords: [
        ...baseSection.aiContext.keywords,
        variantConfig.nameSuffix.toLowerCase(),
        variantConfig.colorScheme.replace('-', ' '),
      ],
      selectionWeight: baseSection.aiContext.selectionWeight - 5, // Slightly lower than base
    },
  };
}

/**
 * Generate multiple variants of a base section
 */
export function generateVariants(
  baseSection: SectionTemplate,
  configs?: VariantConfig[]
): SectionTemplate[] {
  const variantConfigs = configs || DEFAULT_VARIANT_CONFIGS;
  
  return variantConfigs.map(config => generateVariant(baseSection, config));
}

/**
 * Generate variants for multiple base sections
 */
export function generateVariantsForSections(
  baseSections: SectionTemplate[],
  configs?: VariantConfig[]
): SectionTemplate[] {
  const allVariants: SectionTemplate[] = [];
  
  baseSections.forEach(baseSection => {
    const variants = generateVariants(baseSection, configs);
    allVariants.push(...variants);
  });
  
  return allVariants;
}

/**
 * Determine design style based on variant config
 */
function determineDesignStyle(config: VariantConfig): DesignStyle {
  const colorScheme = config.colorScheme;
  const typographyScale = config.typographyScale || 'standard';
  
  if (colorScheme === 'elegant-black' || typographyScale === 'luxury') {
    return 'elegant';
  }
  
  if (colorScheme === 'gradient-sunset' || colorScheme.includes('gradient')) {
    return 'gradient';
  }
  
  if (typographyScale === 'bold' || colorScheme.includes('bold')) {
    return 'bold';
  }
  
  if (colorScheme === 'minimal-gray') {
    return 'minimal';
  }
  
  return 'modern';
}

// ============================================================================
// Batch Generation Helpers
// ============================================================================

/**
 * Generate a complete library from a small set of base templates
 */
export function generateCompleteLibrary(
  baseTemplates: SectionTemplate[]
): SectionTemplate[] {
  const library: SectionTemplate[] = [];
  
  // Include original base templates
  library.push(...baseTemplates);
  
  // Generate 2-3 variants per base template
  const limitedConfigs = DEFAULT_VARIANT_CONFIGS.slice(0, 3); // Use first 3 variants
  
  baseTemplates.forEach(baseTemplate => {
    const variants = generateVariants(baseTemplate, limitedConfigs);
    library.push(...variants);
  });
  
  return library;
}

/**
 * Generate targeted variants based on needs
 */
export function generateTargetedVariants(
  baseTemplate: SectionTemplate,
  targetCount: number = 3
): SectionTemplate[] {
  const variants: SectionTemplate[] = [];
  
  // Select most appropriate variants based on category
  const configs = selectConfigsForCategory(baseTemplate.category, targetCount);
  
  configs.forEach(config => {
    variants.push(generateVariant(baseTemplate, config));
  });
  
  return variants;
}

/**
 * Select appropriate variant configs based on category
 */
function selectConfigsForCategory(
  category: string,
  count: number
): VariantConfig[] {
  const categoryPreferences: Record<string, string[]> = {
    hero: ['bold-purple', 'minimal', 'elegant'],
    promo: ['warm-red', 'bold-purple', 'gradient'],
    content: ['minimal', 'cool-blue', 'elegant'],
    'social-proof': ['cool-blue', 'minimal', 'elegant'],
    cta: ['bold-purple', 'warm-red', 'gradient'],
    pricing: ['cool-blue', 'minimal', 'elegant'],
    features: ['cool-blue', 'bold-purple', 'minimal'],
  };
  
  const preferred = categoryPreferences[category] || ['minimal', 'bold-purple', 'cool-blue'];
  
  return DEFAULT_VARIANT_CONFIGS
    .filter(config => preferred.some(pref => config.idSuffix.includes(pref)))
    .slice(0, count);
}

