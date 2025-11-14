/**
 * AI Section Assembly Logic
 * 
 * Helps AI assemble section templates into complete, cohesive emails.
 */

import { getSectionById } from '../email/sections';
import type { EmailBlock } from '../email/blocks/types';
import { generateBlockId } from '../email/blocks/registry';

// ============================================================================
// Types
// ============================================================================

export interface SectionAssemblyInput {
  sectionIds: string[]; // IDs of sections to assemble
  customizations?: Record<string, any>; // Content customizations per section
}

export interface AssemblyResult {
  blocks: EmailBlock[];
  success: boolean;
  error?: string;
}

// ============================================================================
// Assembly Functions
// ============================================================================

/**
 * Assemble multiple sections into a complete blocks array
 */
export function assembleSections(input: SectionAssemblyInput): AssemblyResult {
  const { sectionIds, customizations = {} } = input;
  
  if (!sectionIds || sectionIds.length === 0) {
    return {
      success: false,
      blocks: [],
      error: 'No section IDs provided',
    };
  }
  
  const allBlocks: EmailBlock[] = [];
  let currentPosition = 0;
  
  // Assemble each section
  for (const sectionId of sectionIds) {
    const section = getSectionById(sectionId);
    
    if (!section) {
      console.warn(`Section not found: ${sectionId}`);
      continue;
    }
    
    // Clone blocks from section
    section.blocks.forEach((block) => {
      const newBlock: EmailBlock = {
        ...JSON.parse(JSON.stringify(block)), // Deep clone
        id: `${sectionId}-${generateBlockId()}`,
        position: currentPosition++,
      };
      
      // Apply customizations if provided
      const blockCustomizations = customizations[`${sectionId}.${block.type}`];
      if (blockCustomizations) {
        Object.assign(newBlock.content, blockCustomizations);
      }
      
      allBlocks.push(newBlock);
    });
  }
  
  return {
    success: true,
    blocks: allBlocks,
  };
}

/**
 * Create a complete email structure with sections
 * Ensures proper structure (logo, spacer, sections, footer)
 */
export function createEmailFromSections(
  sectionIds: string[],
  options?: {
    includeLogo?: boolean;
    includeFooter?: boolean;
    customizations?: Record<string, any>;
  }
): AssemblyResult {
  const blocks: EmailBlock[] = [];
  let position = 0;
  
  // Add logo and spacer at top
  if (options?.includeLogo !== false) {
    blocks.push({
      id: `logo-${Date.now()}`,
      type: 'logo',
      position: position++,
      content: {
        imageUrl: '{{logo_url}}',
        altText: 'Company Logo',
        linkUrl: '{{website_url}}',
      },
      settings: {
        align: 'center',
        width: '150px',
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
        backgroundColor: '#ffffff',
      },
    });
    
    blocks.push({
      id: `spacer-${Date.now()}`,
      type: 'spacer',
      position: position++,
      content: {},
      settings: {
        height: 40,
        backgroundColor: '#ffffff',
      },
    });
  }
  
  // Assemble main sections
  const sectionsResult = assembleSections({
    sectionIds,
    customizations: options?.customizations,
  });
  
  if (!sectionsResult.success) {
    return sectionsResult;
  }
  
  // Add section blocks with adjusted positions
  sectionsResult.blocks.forEach((block) => {
    blocks.push({
      ...block,
      position: position++,
    });
  });
  
  // Add footer at bottom
  if (options?.includeFooter !== false) {
    blocks.push({
      id: `footer-${Date.now()}`,
      type: 'footer',
      position: position++,
      content: {
        companyName: '{{company_name}}',
        companyAddress: '{{company_address}}',
        unsubscribeUrl: '{{unsubscribe_url}}',
      },
      settings: {
        fontSize: '12px',
        textColor: '#9ca3af',
        align: 'center',
        lineHeight: '1.5',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        backgroundColor: '#f3f4f6',
      },
    });
  }
  
  return {
    success: true,
    blocks,
  };
}

/**
 * Validate section assembly (check for logical flow)
 */
export function validateSectionAssembly(sectionIds: string[]): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check for at least one hero/heading section
  const hasHero = sectionIds.some(id => {
    const section = getSectionById(id);
    return section && (section.category === 'hero' || section.category === 'content');
  });
  
  if (!hasHero) {
    warnings.push('Consider adding a hero or content section for better email opening');
  }
  
  // Check for CTA
  const hasCTA = sectionIds.some(id => {
    const section = getSectionById(id);
    return section && section.category === 'cta';
  });
  
  if (!hasCTA) {
    warnings.push('Consider adding a CTA section for better conversion');
  }
  
  // Warn if too many sections
  if (sectionIds.length > 5) {
    warnings.push('Email might be too long with more than 5 sections');
  }
  
  return {
    valid: warnings.length < 3, // Valid if fewer than 3 warnings
    warnings,
  };
}

/**
 * Suggest section order for optimal flow
 */
export function suggestSectionOrder(sectionIds: string[]): string[] {
  const sections = sectionIds
    .map(id => ({ id, section: getSectionById(id) }))
    .filter(item => item.section !== undefined);
  
  // Preferred order: hero -> content/social-proof -> cta
  const categoryOrder: Record<string, number> = {
    hero: 1,
    content: 2,
    'social-proof': 3,
    promo: 4,
    pricing: 5,
    features: 6,
    cta: 7,
  };
  
  sections.sort((a, b) => {
    const orderA = categoryOrder[a.section!.category] || 5;
    const orderB = categoryOrder[b.section!.category] || 5;
    return orderA - orderB;
  });
  
  return sections.map(item => item.id);
}

