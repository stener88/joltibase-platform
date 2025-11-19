/**
 * Transform Functions
 * 
 * Converts semantic content blocks into React Email components (EmailComponent structure)
 * Uses pattern components for consistent, deterministic rendering
 */

import { render } from '@react-email/render';
import type { EmailComponent, GlobalEmailSettings } from '../types';
import type { SemanticBlock } from './blocks';
import { HeroPattern } from '../patterns/HeroPattern';
import { FeaturesPattern } from '../patterns/FeaturesPattern';
import { ContentPattern } from '../patterns/ContentPattern';
import { TestimonialPattern } from '../patterns/TestimonialPattern';
import { CtaPattern } from '../patterns/CtaPattern';
import { FooterPattern } from '../patterns/FooterPattern';

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Simple markdown to HTML parser for email content
 * Handles: **bold**, *italic*, and basic formatting
 */
function parseMarkdown(text: string): string {
  return text
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em>text</em>
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Basic line breaks
    .replace(/\n/g, '<br/>');
}

/**
 * Check if URL is a valid image (not placeholder/example)
 */
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes('example.com')) return false;
  if (url.includes('[') || url.includes(']')) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Generate placeholder image URL
 */
function getPlaceholderImage(width: number, height: number, text?: string): string {
  const displayText = text ? encodeURIComponent(text) : 'Image';
  return `https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=${displayText}`;
}

/**
 * Convert a semantic block to an EmailComponent structure
 * 
 * Note: This renders the pattern to get the component structure
 * In a real implementation, we'd want to map directly to EmailComponent
 * without rendering to HTML first
 */
export function transformBlockToEmail(
  block: SemanticBlock,
  settings: GlobalEmailSettings
): EmailComponent {
  // Map block type to component structure
  // We'll create the EmailComponent structure directly based on the pattern logic
  
  switch (block.blockType) {
    case 'hero':
      return createHeroSection(block, settings);
    case 'features':
      return createFeaturesSection(block, settings);
    case 'content':
      return createContentSection(block, settings);
    case 'testimonial':
      return createTestimonialSection(block, settings);
    case 'cta':
      return createCtaSection(block, settings);
    case 'footer':
      return createFooterSection(block, settings);
    default:
      throw new Error(`Unknown block type: ${(block as any).blockType}`);
  }
}

/**
 * Transform all semantic blocks to email components
 */
export function transformBlocksToEmail(
  blocks: SemanticBlock[],
  settings: GlobalEmailSettings
): EmailComponent[] {
  return blocks.map(block => transformBlockToEmail(block, settings));
}

// Helper functions to create EmailComponent structures

function createHeroSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [
    {
      id: 'hero-heading',
      component: 'Heading',
      props: {
        as: 'h1',
        style: {
          color: '#ffffff',
          fontSize: '42px',
          fontWeight: 700,
          lineHeight: '1.2',
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.headline,
    },
  ];

  if (block.subheadline) {
    children.push({
      id: 'hero-subheading',
      component: 'Text',
      props: {
        style: {
          color: '#e9d5ff',
          fontSize: '18px',
          lineHeight: '1.5',
          margin: '0 0 32px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.subheadline,
    });
  }

  if (block.imageUrl && isValidImageUrl(block.imageUrl)) {
    children.push({
      id: 'hero-image',
      component: 'Img',
      props: {
        src: block.imageUrl,
        alt: block.headline,
        width: 600,
        style: {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          margin: '0 auto 32px',
          borderRadius: '8px',
          display: 'block',
        },
      },
    });
  }

  children.push({
    id: 'hero-cta',
    component: 'Button',
    props: {
      href: block.ctaUrl,
      style: {
        backgroundColor: '#ffffff',
        color: settings.primaryColor,
        padding: '16px 40px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: settings.fontFamily,
      },
    },
    content: block.ctaText,
  });

  return {
    id: 'hero-section',
    component: 'Section',
    props: {
      style: {
        backgroundColor: settings.primaryColor,
        padding: '60px 24px',
        textAlign: 'center',
      },
    },
    children,
  };
}

function createFeaturesSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];

  if (block.heading) {
    children.push({
      id: 'features-heading',
      component: 'Heading',
      props: {
        as: 'h2',
        style: {
          color: '#111827',
          fontSize: '32px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.heading,
    });
  }

  if (block.subheading) {
    children.push({
      id: 'features-subheading',
      component: 'Text',
      props: {
        style: {
          color: '#6b7280',
          fontSize: '16px',
          margin: '0 0 40px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.subheading,
    });
  }

  const featureCount = block.features.length;
  const columnWidth = featureCount === 2 ? '50%' : featureCount === 3 ? '33.33%' : '25%';

  const featureColumns: EmailComponent[] = block.features.map((feature: any, index: number) => ({
    id: `feature-col-${index}`,
    component: 'Column',
    props: {
      style: {
        width: columnWidth,
        padding: '16px',
        verticalAlign: 'top',
      },
    },
    children: [
      {
        id: `feature-title-${index}`,
        component: 'Heading',
        props: {
          as: 'h3',
          style: {
            color: '#111827',
            fontSize: '20px',
            fontWeight: 600,
            margin: '0 0 8px 0',
            fontFamily: settings.fontFamily,
          },
        },
        content: feature.title,
      },
      {
        id: `feature-desc-${index}`,
        component: 'Text',
        props: {
          style: {
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: '0',
            fontFamily: settings.fontFamily,
          },
        },
        content: feature.description,
      },
    ],
  }));

  children.push({
    id: 'features-row',
    component: 'Row',
    props: {},
    children: featureColumns,
  });

  return {
    id: 'features-section',
    component: 'Section',
    props: {
      style: {
        padding: '48px 24px',
        backgroundColor: '#ffffff',
      },
    },
    children,
  };
}

function createContentSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];

  if (block.heading) {
    children.push({
      id: 'content-heading',
      component: 'Heading',
      props: {
        as: 'h2',
        style: {
          color: '#111827',
          fontSize: '28px',
          fontWeight: 700,
          margin: '0 0 24px 0',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.heading,
    });
  }

  if (block.imageUrl && block.imagePosition === 'top' && isValidImageUrl(block.imageUrl)) {
    children.push({
      id: 'content-image',
      component: 'Img',
      props: {
        src: block.imageUrl,
        alt: block.imageAlt || '',
        width: 600,
        style: {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          margin: '0 0 24px 0',
          borderRadius: '8px',
        },
      },
    });
  }

  block.paragraphs.forEach((paragraph: string, index: number) => {
    children.push({
      id: `content-para-${index}`,
      component: 'Text',
      props: {
        style: {
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          margin: index === block.paragraphs.length - 1 ? '0' : '0 0 16px 0',
          fontFamily: settings.fontFamily,
        },
        dangerouslySetInnerHTML: { __html: parseMarkdown(paragraph) },
      },
      content: undefined, // Use dangerouslySetInnerHTML instead
    });
  });

  if (block.imageUrl && block.imagePosition === 'bottom' && isValidImageUrl(block.imageUrl)) {
    children.push({
      id: 'content-image',
      component: 'Img',
      props: {
        src: block.imageUrl,
        alt: block.imageAlt || '',
        width: 600,
        style: {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          margin: '24px 0 0 0',
          borderRadius: '8px',
        },
      },
    });
  }

  return {
    id: 'content-section',
    component: 'Section',
    props: {
      style: {
        padding: '48px 24px',
      },
    },
    children,
  };
}

function createTestimonialSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [
    {
      id: 'testimonial-quote',
      component: 'Text',
      props: {
        style: {
          color: '#111827',
          fontSize: '20px',
          fontStyle: 'italic',
          lineHeight: '1.6',
          margin: '0 0 24px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: `"${block.quote}"`,
    },
  ];

  if (block.rating) {
    children.push({
      id: 'testimonial-rating',
      component: 'Text',
      props: {
        style: {
          fontSize: '20px',
          margin: '0 0 16px 0',
          textAlign: 'center',
        },
      },
      content: '★'.repeat(block.rating) + '☆'.repeat(5 - block.rating),
    });
  }

  const authorChildren: EmailComponent[] = [];

  if (block.authorImage && isValidImageUrl(block.authorImage)) {
    authorChildren.push({
      id: 'testimonial-author-image',
      component: 'Img',
      props: {
        src: block.authorImage,
        alt: block.authorName,
        width: 64,
        height: 64,
        style: {
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          margin: '0 auto 12px',
          display: 'block',
        },
      },
    });
  }

  authorChildren.push({
    id: 'testimonial-author-name',
    component: 'Text',
    props: {
      style: {
        color: '#111827',
        fontSize: '16px',
        fontWeight: 600,
        margin: '0',
        fontFamily: settings.fontFamily,
      },
    },
    content: block.authorName,
  });

  if (block.authorTitle || block.authorCompany) {
    const titleParts = [block.authorTitle, block.authorCompany].filter(Boolean);
    authorChildren.push({
      id: 'testimonial-author-title',
      component: 'Text',
      props: {
        style: {
          color: '#6b7280',
          fontSize: '14px',
          margin: '4px 0 0 0',
          fontFamily: settings.fontFamily,
        },
      },
      content: titleParts.join(' at '),
    });
  }

  children.push({
    id: 'testimonial-author-row',
    component: 'Row',
    props: {},
    children: [
      {
        id: 'testimonial-author-col',
        component: 'Column',
        props: {
          style: {
            textAlign: 'center',
          },
        },
        children: authorChildren,
      },
    ],
  });

  return {
    id: 'testimonial-section',
    component: 'Section',
    props: {
      style: {
        backgroundColor: '#f9fafb',
        padding: '48px 24px',
      },
    },
    children,
  };
}

function createCtaSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [
    {
      id: 'cta-heading',
      component: 'Heading',
      props: {
        as: 'h2',
        style: {
          color: '#111827',
          fontSize: '32px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.headline,
    },
  ];

  if (block.subheadline) {
    children.push({
      id: 'cta-subheading',
      component: 'Text',
      props: {
        style: {
          color: '#6b7280',
          fontSize: '16px',
          margin: '0 0 32px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.subheadline,
    });
  }

  let buttonBg = settings.primaryColor;
  let buttonColor = '#ffffff';
  let buttonBorder = undefined;

  if (block.style === 'secondary') {
    buttonBg = '#374151';
  } else if (block.style === 'outline') {
    buttonBg = 'transparent';
    buttonColor = settings.primaryColor;
    buttonBorder = `2px solid ${settings.primaryColor}`;
  }

  children.push({
    id: 'cta-button',
    component: 'Button',
    props: {
      href: block.buttonUrl,
      style: {
        backgroundColor: buttonBg,
        color: buttonColor,
        padding: '16px 40px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: settings.fontFamily,
        ...(buttonBorder && { border: buttonBorder }),
      },
    },
    content: block.buttonText,
  });

  return {
    id: 'cta-section',
    component: 'Section',
    props: {
      style: {
        backgroundColor: block.backgroundColor || '#f9fafb',
        padding: '60px 24px',
        textAlign: 'center',
      },
    },
    children,
  };
}

function createFooterSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [
    {
      id: 'footer-company',
      component: 'Text',
      props: {
        style: {
          color: '#6b7280',
          fontSize: '14px',
          margin: '0 0 8px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: `© ${new Date().getFullYear()} ${block.companyName}. All rights reserved.`,
    },
  ];

  if (block.address) {
    children.push({
      id: 'footer-address',
      component: 'Text',
      props: {
        style: {
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.address,
    });
  }

  // Build links as proper Link components
  const linkChildren: EmailComponent[] = [];
  
  if (block.preferenceUrl) {
    linkChildren.push({
      id: 'footer-link-preferences',
      component: 'Link',
      props: {
        href: block.preferenceUrl,
        style: {
          color: '#6b7280',
          textDecoration: 'underline',
          margin: '0 4px',
        },
      },
      content: 'Preferences',
    });
    
    linkChildren.push({
      id: 'footer-link-separator-1',
      component: 'Text',
      props: {
        style: {
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0 4px',
          display: 'inline',
        },
      },
      content: ' • ',
    });
  }
  
  linkChildren.push({
    id: 'footer-link-unsubscribe',
    component: 'Link',
    props: {
      href: block.unsubscribeUrl,
      style: {
        color: '#6b7280',
        textDecoration: 'underline',
        margin: '0 4px',
      },
    },
    content: 'Unsubscribe',
  });
  
  if (block.additionalLinks && block.additionalLinks.length > 0) {
    block.additionalLinks.forEach((link: any, index: number) => {
      linkChildren.push({
        id: `footer-link-separator-${index + 2}`,
        component: 'Text',
        props: {
          style: {
            color: '#9ca3af',
            fontSize: '12px',
            margin: '0 4px',
            display: 'inline',
          },
        },
        content: ' • ',
      });
      
      linkChildren.push({
        id: `footer-link-additional-${index}`,
        component: 'Link',
        props: {
          href: link.url,
          style: {
            color: '#6b7280',
            textDecoration: 'underline',
            margin: '0 4px',
          },
        },
        content: link.text,
      });
    });
  }

  children.push({
    id: 'footer-links',
    component: 'Text',
    props: {
      style: {
        color: '#9ca3af',
        fontSize: '12px',
        margin: '0',
        textAlign: 'center',
        fontFamily: settings.fontFamily,
      },
    },
    children: linkChildren,
  });

  return {
    id: 'footer-section',
    component: 'Section',
    props: {
      style: {
        backgroundColor: '#f9fafb',
        padding: '32px 24px',
        borderTop: '1px solid #e5e7eb',
      },
    },
    children,
  };
}

