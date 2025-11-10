/**
 * Email Block Migration Utilities
 * 
 * Convert between ContentSection (legacy) and Block (new) formats.
 * Maintains backward compatibility while transitioning to block-based system.
 */

import type { ContentSection, EmailContent } from '../templates/types';
import type {
  EmailBlock,
  BlockType,
  HeadingBlock,
  TextBlock,
  ButtonBlock,
  DividerBlock,
  HeroBlock,
  StatsBlock,
  TestimonialBlock,
  FeatureGridBlock,
  ComparisonBlock,
  SpacerBlock,
} from './types';
import { generateBlockId, getDefaultBlockSettings } from './registry';

// ============================================================================
// ContentSection → Block Conversion
// ============================================================================

/**
 * Convert a ContentSection to a Block
 */
export function sectionToBlock(section: ContentSection, position: number): EmailBlock | null {
  switch (section.type) {
    case 'heading':
      return sectionToHeadingBlock(section, position);
    
    case 'text':
      return sectionToTextBlock(section, position);
    
    case 'list':
      return sectionToTextBlock(section, position); // Convert list to formatted text
    
    case 'divider':
      return sectionToDividerBlock(section, position);
    
    case 'spacer':
      return sectionToSpacerBlock(section, position);
    
    case 'hero':
      return sectionToHeroBlock(section, position);
    
    case 'feature-grid':
      return sectionToFeatureGridBlock(section, position);
    
    case 'testimonial':
      return sectionToTestimonialBlock(section, position);
    
    case 'stats':
      return sectionToStatsBlock(section, position);
    
    case 'comparison':
      return sectionToComparisonBlock(section, position);
    
    case 'cta-block':
      return sectionToButtonBlock(section, position);
    
    default:
      console.warn(`Unknown section type: ${section.type}`);
      return null;
  }
}

/**
 * Convert EmailContent to array of Blocks
 */
export function contentToBlocks(content: EmailContent): EmailBlock[] {
  const blocks: EmailBlock[] = [];
  let position = 0;
  
  // Add hero block from headline/subheadline if present
  if (content.headline || content.subheadline) {
    const heroBlock: HeroBlock = {
      id: generateBlockId(),
      type: 'hero',
      position: position++,
      settings: {
        ...getDefaultBlockSettings('hero'),
        headlineFontSize: '56px',
        headlineFontWeight: 800,
        headlineColor: '#111827',
        subheadlineFontSize: '18px',
        subheadlineColor: '#6b7280',
      },
      content: {
        headline: content.headline,
        subheadline: content.subheadline,
      },
    };
    blocks.push(heroBlock);
  }
  
  // Convert body sections
  content.sections.forEach(section => {
    const block = sectionToBlock(section, position);
    if (block) {
      blocks.push(block);
      position++;
    }
  });
  
  // Add CTA button
  if (content.cta) {
    const buttonBlock: ButtonBlock = {
      id: generateBlockId(),
      type: 'button',
      position: position++,
      settings: {
        ...getDefaultBlockSettings('button'),
        color: '#2563eb',
        textColor: '#ffffff',
      },
      content: {
        text: content.cta.text,
        url: content.cta.url,
      },
    };
    blocks.push(buttonBlock);
  }
  
  // Add footer if present
  if (content.footer) {
    const footerBlock = {
      id: generateBlockId(),
      type: 'footer' as const,
      position: position++,
      settings: getDefaultBlockSettings('footer'),
      content: {
        companyName: content.footer.companyName,
        companyAddress: content.footer.companyAddress,
        customText: content.footer.customText,
        unsubscribeUrl: '{{unsubscribe_url}}',
        preferencesUrl: '{{preferences_url}}',
      },
    };
    blocks.push(footerBlock);
  }
  
  return blocks;
}

// ============================================================================
// Individual Section Converters
// ============================================================================

function sectionToHeadingBlock(section: ContentSection, position: number): HeadingBlock {
  return {
    id: generateBlockId(),
    type: 'heading',
    position,
    settings: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#111827',
      align: 'left',
      padding: { top: 32, bottom: 16, left: 20, right: 20 },
      lineHeight: '1.3',
    },
    content: {
      text: section.content || '',
    },
  };
}

function sectionToTextBlock(section: ContentSection, position: number): TextBlock {
  let text = section.content || '';
  
  // Convert list items to formatted text
  if (section.type === 'list' && section.items) {
    text = section.items.map(item => `• ${item}`).join('\n');
  }
  
  return {
    id: generateBlockId(),
    type: 'text',
    position,
    settings: {
      fontSize: '16px',
      fontWeight: 400,
      color: '#374151',
      align: 'left',
      padding: { top: 0, bottom: 20, left: 20, right: 20 },
      lineHeight: '1.6',
    },
    content: {
      text,
    },
  };
}

function sectionToButtonBlock(section: ContentSection, position: number): ButtonBlock {
  return {
    id: generateBlockId(),
    type: 'button',
    position,
    settings: {
      style: 'solid',
      color: '#2563eb',
      textColor: '#ffffff',
      align: 'center',
      size: 'medium',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 600,
      padding: { top: 14, bottom: 14, left: 32, right: 32 },
      containerPadding: { top: 32, bottom: 32, left: 20, right: 20 },
    },
    content: {
      text: section.ctaText || 'Click Here',
      url: section.ctaUrl || '{{cta_url}}',
    },
  };
}

function sectionToDividerBlock(section: ContentSection, position: number): DividerBlock {
  return {
    id: generateBlockId(),
    type: 'divider',
    position,
    settings: {
      style: 'solid',
      color: '#e5e7eb',
      thickness: 1,
      width: '100%',
      padding: { top: 32, bottom: 32, left: 20, right: 20 },
    },
    content: {},
  };
}

function sectionToSpacerBlock(section: ContentSection, position: number): SpacerBlock {
  const height = section.size === 'small' ? 16 : section.size === 'large' ? 48 : 32;
  
  return {
    id: generateBlockId(),
    type: 'spacer',
    position,
    settings: {
      height,
    },
    content: {},
  };
}

function sectionToHeroBlock(section: ContentSection, position: number): HeroBlock {
  return {
    id: generateBlockId(),
    type: 'hero',
    position,
    settings: {
      backgroundColor: '#f9fafb',
      padding: { top: 60, bottom: 60, left: 40, right: 40 },
      align: 'center',
      headlineFontSize: '56px',
      headlineFontWeight: 800,
      headlineColor: '#111827',
      subheadlineFontSize: '18px',
      subheadlineColor: '#6b7280',
    },
    content: {
      headline: section.headline || '',
      subheadline: section.subheadline,
    },
  };
}

function sectionToFeatureGridBlock(section: ContentSection, position: number): FeatureGridBlock {
  const features = (section.features || []).map(feature => ({
    icon: feature.icon,
    title: feature.title,
    description: feature.description,
  }));
  
  return {
    id: generateBlockId(),
    type: 'feature-grid',
    position,
    settings: {
      layout: features.length === 2 ? '2-col' : '3-col',
      align: 'center',
      iconSize: '48px',
      titleFontSize: '20px',
      titleFontWeight: 700,
      titleColor: '#111827',
      descriptionFontSize: '14px',
      descriptionColor: '#6b7280',
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
      spacing: 32,
    },
    content: {
      features,
    },
  };
}

function sectionToTestimonialBlock(section: ContentSection, position: number): TestimonialBlock {
  if (!section.testimonial) {
    throw new Error('Testimonial section missing testimonial data');
  }
  
  return {
    id: generateBlockId(),
    type: 'testimonial',
    position,
    settings: {
      backgroundColor: '#f9fafb',
      borderColor: '#2563eb',
      borderWidth: 4,
      borderRadius: '4px',
      padding: { top: 24, bottom: 24, left: 24, right: 24 },
      quoteFontSize: '18px',
      quoteColor: '#374151',
      quoteFontStyle: 'italic',
      authorFontSize: '14px',
      authorColor: '#6b7280',
      authorFontWeight: 600,
    },
    content: {
      quote: section.testimonial.quote,
      author: section.testimonial.author,
      role: section.testimonial.role,
      avatarUrl: section.testimonial.avatar,
    },
  };
}

function sectionToStatsBlock(section: ContentSection, position: number): StatsBlock {
  const stats = (section.stats || []).map(stat => ({
    value: stat.value,
    label: stat.label,
  }));
  
  return {
    id: generateBlockId(),
    type: 'stats',
    position,
    settings: {
      layout: stats.length === 2 ? '2-col' : stats.length === 4 ? '4-col' : '3-col',
      align: 'center',
      valueFontSize: '64px',
      valueFontWeight: 900,
      valueColor: '#2563eb',
      labelFontSize: '14px',
      labelFontWeight: 600,
      labelColor: '#6b7280',
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
      spacing: 32,
    },
    content: {
      stats,
    },
  };
}

function sectionToComparisonBlock(section: ContentSection, position: number): ComparisonBlock {
  if (!section.comparison) {
    throw new Error('Comparison section missing comparison data');
  }
  
  return {
    id: generateBlockId(),
    type: 'comparison',
    position,
    settings: {
      beforeBackgroundColor: '#fef2f2',
      afterBackgroundColor: '#f0fdf4',
      beforeLabelColor: '#dc2626',
      afterLabelColor: '#16a34a',
      labelFontSize: '12px',
      labelFontWeight: 600,
      contentFontSize: '14px',
      contentColor: '#374151',
      borderRadius: '4px',
      padding: { top: 24, bottom: 24, left: 0, right: 0 },
      cellPadding: 16,
    },
    content: {
      before: {
        text: section.comparison.before,
      },
      after: {
        text: section.comparison.after,
      },
    },
  };
}

// ============================================================================
// Block → ContentSection Conversion (Backward Compatibility)
// ============================================================================

/**
 * Convert a Block back to ContentSection format
 */
export function blockToSection(block: EmailBlock): ContentSection {
  switch (block.type) {
    case 'heading':
      return {
        type: 'heading',
        content: (block.content as any).text,
      };
    
    case 'text':
      return {
        type: 'text',
        content: (block.content as any).text,
      };
    
    case 'button':
      return {
        type: 'cta-block',
        ctaText: (block.content as any).text,
        ctaUrl: (block.content as any).url,
      };
    
    case 'divider':
      return {
        type: 'divider',
      };
    
    case 'spacer':
      const height = (block.settings as any).height;
      return {
        type: 'spacer',
        size: height <= 20 ? 'small' : height >= 48 ? 'large' : 'medium',
      };
    
    case 'hero':
      return {
        type: 'hero',
        headline: (block.content as any).headline,
        subheadline: (block.content as any).subheadline,
      };
    
    case 'feature-grid':
      return {
        type: 'feature-grid',
        features: (block.content as any).features,
      };
    
    case 'testimonial':
      const testimonialContent = block.content as any;
      return {
        type: 'testimonial',
        testimonial: {
          quote: testimonialContent.quote,
          author: testimonialContent.author,
          role: testimonialContent.role,
          avatar: testimonialContent.avatarUrl,
        },
      };
    
    case 'stats':
      return {
        type: 'stats',
        stats: (block.content as any).stats,
      };
    
    case 'comparison':
      const comparisonContent = block.content as any;
      return {
        type: 'comparison',
        comparison: {
          before: comparisonContent.before.text,
          after: comparisonContent.after.text,
        },
      };
    
    default:
      // For block types without direct section equivalents, convert to text
      return {
        type: 'text',
        content: `[${block.type} block]`,
      };
  }
}

/**
 * Convert array of Blocks back to EmailContent
 */
export function blocksToContent(blocks: EmailBlock[]): Partial<EmailContent> {
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
  
  let headline = '';
  let subheadline: string | undefined;
  const sections: ContentSection[] = [];
  let cta: EmailContent['cta'] | undefined;
  let footer: EmailContent['footer'] | undefined;
  
  sortedBlocks.forEach(block => {
    // Extract hero as headline/subheadline
    if (block.type === 'hero' && !headline) {
      headline = (block.content as any).headline || '';
      subheadline = (block.content as any).subheadline;
      return;
    }
    
    // Extract button as CTA
    if (block.type === 'button' && !cta) {
      cta = {
        text: (block.content as any).text,
        url: (block.content as any).url,
      };
      return;
    }
    
    // Extract footer
    if (block.type === 'footer') {
      const footerContent = block.content as any;
      footer = {
        companyName: footerContent.companyName,
        companyAddress: footerContent.companyAddress,
        customText: footerContent.customText,
      };
      return;
    }
    
    // Convert other blocks to sections
    const section = blockToSection(block);
    sections.push(section);
  });
  
  return {
    headline: headline || 'Email',
    subheadline,
    sections,
    cta,
    footer,
  };
}

// ============================================================================
// Validation & Testing
// ============================================================================

/**
 * Test round-trip conversion: section → block → section
 */
export function testSectionRoundTrip(section: ContentSection): boolean {
  try {
    const block = sectionToBlock(section, 0);
    if (!block) return false;
    
    const convertedSection = blockToSection(block);
    
    // Basic validation - types should match
    return section.type === convertedSection.type;
  } catch (error) {
    console.error('Round-trip test failed:', error);
    return false;
  }
}

/**
 * Test round-trip conversion: content → blocks → content
 */
export function testContentRoundTrip(content: EmailContent): boolean {
  try {
    const blocks = contentToBlocks(content);
    const convertedContent = blocksToContent(blocks);
    
    // Basic validation
    return (
      convertedContent.headline === content.headline &&
      convertedContent.sections?.length === content.sections.length
    );
  } catch (error) {
    console.error('Content round-trip test failed:', error);
    return false;
  }
}

