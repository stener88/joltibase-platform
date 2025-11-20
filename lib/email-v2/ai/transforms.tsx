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
 * Generate placeholder image URL using picsum.photos
 */
function getPlaceholderImage(width: number, height: number, seed?: string): string {
  if (seed) {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
  }
  return `https://picsum.photos/${width}/${height}`;
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
    case 'article':
      return createArticleSection(block, settings);
    case 'gallery':
      return createGallerySection(block, settings);
    case 'stats':
      return createStatsSection(block, settings);
    case 'pricing':
      return createPricingSection(block, settings);
    case 'list':
      return createListSection(block, settings);
    case 'ecommerce':
      return createEcommerceSection(block, settings);
    case 'marketing':
      return createMarketingSection(block, settings);
    case 'header':
      return createHeaderSection(block, settings);
    case 'feedback':
      return createFeedbackSection(block, settings);
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

  // Always include image (with fallback if needed)
  const imageUrl = isValidImageUrl(block.imageUrl) 
    ? block.imageUrl 
    : getPlaceholderImage(600, 400, block.headline);
    
    children.push({
      id: 'hero-image',
      component: 'Img',
      props: {
      src: imageUrl,
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

  // Top image with fallback
  if (block.imageUrl && block.imagePosition === 'top') {
    const imageUrl = isValidImageUrl(block.imageUrl)
      ? block.imageUrl
      : getPlaceholderImage(600, 400, block.heading);
      
    children.push({
      id: 'content-image',
      component: 'Img',
      props: {
        src: imageUrl,
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

  // Bottom image with fallback
  if (block.imageUrl && block.imagePosition === 'bottom') {
    const imageUrl = isValidImageUrl(block.imageUrl)
      ? block.imageUrl
      : getPlaceholderImage(600, 400, block.heading);
      
    children.push({
      id: 'content-image',
      component: 'Img',
      props: {
        src: imageUrl,
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

  // Author image with fallback
  const avatarUrl = block.authorImage && isValidImageUrl(block.authorImage)
    ? block.authorImage
    : getPlaceholderImage(64, 64, block.authorName);
    
    authorChildren.push({
      id: 'testimonial-author-image',
      component: 'Img',
      props: {
      src: avatarUrl,
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

// New block type helpers for editor compatibility

function createArticleSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const variant = block.variant || 'image-top';
  const children: EmailComponent[] = [];
  
  if (variant === 'image-top') {
    // Image at top, content below (centered)
    if (block.imageUrl) {
      children.push({
        id: 'article-img',
        component: 'Img',
        props: {
          src: block.imageUrl || getPlaceholderImage(600, 320, block.headline),
          alt: block.imageAlt || block.headline,
          height: 320,
          style: {
            width: '100%',
            borderRadius: '12px',
            objectFit: 'cover',
            display: 'block',
          },
        },
      });
    }
    
    const contentChildren: EmailComponent[] = [];
    
    if (block.eyebrow) {
      contentChildren.push({
        id: 'article-eyebrow',
        component: 'Text',
        props: {
          style: {
            margin: '16px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#4f46e5',
            lineHeight: '28px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.eyebrow,
      });
    }
    
    contentChildren.push({
      id: 'article-headline',
      component: 'Heading',
      props: {
        as: 'h1',
        style: {
          margin: '8px 0 0 0',
          fontSize: '36px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: '36px',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.headline,
    });
    
    if (block.excerpt) {
      contentChildren.push({
        id: 'article-excerpt',
        component: 'Text',
        props: {
          style: {
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '24px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.excerpt,
      });
    }
    
    if (block.ctaText && block.ctaUrl) {
      contentChildren.push({
        id: 'article-cta',
        component: 'Button',
        props: {
          href: block.ctaUrl,
          style: {
            marginTop: '16px',
            borderRadius: '8px',
            backgroundColor: '#4f46e5',
            padding: '12px 40px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#ffffff',
            textDecoration: 'none',
            display: 'inline-block',
          },
        },
        content: block.ctaText,
      });
    }
    
    children.push({
      id: 'article-content-section',
      component: 'Section',
      props: {
        style: {
          marginTop: '32px',
          textAlign: 'center',
        },
      },
      children: contentChildren,
    });
    
  } else if (variant === 'image-right') {
    // Side by side layout
    const leftChildren: EmailComponent[] = [];
    
    if (block.eyebrow) {
      leftChildren.push({
        id: 'article-eyebrow',
        component: 'Text',
        props: {
          style: {
            margin: '0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#4f46e5',
            lineHeight: '24px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.eyebrow,
      });
    }
    
    leftChildren.push({
      id: 'article-headline',
      component: 'Text',
      props: {
        style: {
          margin: '8px 0 0 0',
          fontSize: '20px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: '28px',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.headline,
    });
    
    if (block.excerpt) {
      leftChildren.push({
        id: 'article-excerpt',
        component: 'Text',
        props: {
          style: {
            marginTop: '8px',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '24px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.excerpt,
      });
    }
    
    if (block.ctaText && block.ctaUrl) {
      leftChildren.push({
        id: 'article-cta',
        component: 'Link',
        props: {
          href: block.ctaUrl,
          style: {
            color: '#4f46e5',
            textDecoration: 'underline',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.ctaText,
      });
    }
    
    children.push({
      id: 'article-row',
      component: 'Row',
      props: {},
      children: [
        {
          id: 'article-content-col',
          component: 'Column',
          props: {
            style: {
              width: '55%',
              textAlign: 'left',
              verticalAlign: 'top',
              paddingRight: '16px',
            },
          },
          children: leftChildren,
        },
        {
          id: 'article-img-col',
          component: 'Column',
          props: {
            style: {
              width: '45%',
              verticalAlign: 'top',
            },
          },
          children: [{
            id: 'article-img',
            component: 'Img',
            props: {
              src: block.imageUrl || getPlaceholderImage(220, 220, block.headline),
              alt: block.imageAlt || block.headline,
              width: 220,
              height: 220,
              style: {
                borderRadius: '8px',
                objectFit: 'cover',
                display: 'block',
              },
            },
          }],
        },
      ],
    });
    
  } else if (variant === 'image-background') {
    // Hero-style with image background
    const bgChildren: EmailComponent[] = [];
    
    if (block.eyebrow) {
      bgChildren.push({
        id: 'article-eyebrow',
        component: 'Text',
        props: {
          style: {
            margin: '0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#e5e7eb',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.eyebrow,
      });
    }
    
    bgChildren.push({
      id: 'article-headline',
      component: 'Heading',
      props: {
        as: 'h1',
        style: {
          margin: '4px 0 0 0',
          fontSize: '36px',
          fontWeight: 700,
          color: '#ffffff',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.headline,
    });
    
    if (block.excerpt) {
      bgChildren.push({
        id: 'article-excerpt',
        component: 'Text',
        props: {
          style: {
            margin: '8px 0 0 0',
            fontSize: '16px',
            color: '#ffffff',
            lineHeight: '24px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.excerpt,
      });
    }
    
    if (block.ctaText && block.ctaUrl) {
      bgChildren.push({
        id: 'article-cta',
        component: 'Button',
        props: {
          href: block.ctaUrl,
          style: {
            marginTop: '24px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            padding: '12px 40px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
            textDecoration: 'none',
            display: 'inline-block',
          },
        },
        content: block.ctaText,
      });
    }
    
    children.push({
      id: 'article-bg-section',
      component: 'Section',
      props: {
        style: {
          height: '424px',
          borderRadius: '12px',
          backgroundColor: '#2563eb',
          backgroundImage: block.imageUrl ? `url('${block.imageUrl}')` : undefined,
          backgroundSize: '100% 100%',
          padding: '40px',
          textAlign: 'center',
        },
      },
      children: bgChildren,
    });
    
  } else if (variant === 'two-cards') {
    // Two-column cards layout
    if (block.eyebrow || block.excerpt) {
      const headerChildren: EmailComponent[] = [];
      
      if (block.eyebrow) {
        headerChildren.push({
          id: 'article-eyebrow',
          component: 'Text',
          props: {
            style: {
              margin: '0',
              fontSize: '20px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '28px',
              fontFamily: settings.fontFamily,
            },
          },
          content: block.eyebrow,
        });
      }
      
      if (block.excerpt) {
        headerChildren.push({
          id: 'article-intro',
          component: 'Text',
          props: {
            style: {
              marginTop: '8px',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '24px',
              fontFamily: settings.fontFamily,
            },
          },
          content: block.excerpt,
        });
      }
      
      children.push({
        id: 'article-header-row',
        component: 'Row',
        props: {},
        children: headerChildren,
      });
    }
    
    // Two cards side by side
    children.push({
      id: 'article-cards-row',
      component: 'Row',
      props: {
        style: {
          marginTop: '16px',
        },
      },
      children: [
        {
          id: 'article-card-1',
          component: 'Column',
          props: {
            style: {
              width: '50%',
              paddingRight: '8px',
              verticalAlign: 'baseline',
            },
          },
          children: [
            ...(block.imageUrl ? [{
              id: 'article-card-img-1',
              component: 'Img' as const,
              props: {
                src: block.imageUrl,
                alt: block.imageAlt || block.headline,
                height: 180,
                style: {
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  display: 'block',
                },
              },
            } as EmailComponent] : []),
            {
              id: 'article-card-title-1',
              component: 'Text',
              props: {
                style: {
                  margin: '24px 0 0 0',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: '28px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: block.headline,
            },
            {
              id: 'article-card-excerpt-1',
              component: 'Text',
              props: {
                style: {
                  margin: '8px 0 0 0',
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '24px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: block.excerpt ? block.excerpt.substring(0, 120) + '...' : '',
            },
          ],
        },
        {
          id: 'article-card-2',
          component: 'Column',
          props: {
            style: {
              width: '50%',
              paddingLeft: '8px',
              verticalAlign: 'baseline',
            },
          },
          children: [
            ...(block.imageUrl ? [{
              id: 'article-card-img-2',
              component: 'Img' as const,
              props: {
                src: block.imageUrl,
                alt: 'Related',
                height: 180,
                style: {
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  display: 'block',
                },
              },
            } as EmailComponent] : []),
            {
              id: 'article-card-title-2',
              component: 'Text',
              props: {
                style: {
                  margin: '24px 0 0 0',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: '28px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: 'Related Article',
            },
            {
              id: 'article-card-excerpt-2',
              component: 'Text',
              props: {
                style: {
                  margin: '8px 0 0 0',
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '24px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: 'Discover more insights on this topic.',
            },
          ],
        },
      ],
    });
    
  } else if (variant === 'single-author' || variant === 'multiple-authors') {
    // Image at top with author info
    if (block.imageUrl) {
      children.push({
        id: 'article-img',
        component: 'Img',
        props: {
          src: block.imageUrl,
          alt: block.imageAlt || block.headline,
          height: 320,
          style: {
            width: '100%',
            borderRadius: '12px',
            objectFit: 'cover',
            display: 'block',
          },
        },
      });
    }
    
    const contentChildren: EmailComponent[] = [];
    
    if (block.eyebrow) {
      contentChildren.push({
        id: 'article-eyebrow',
        component: 'Text',
        props: {
          style: {
            margin: '16px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#4f46e5',
            lineHeight: '28px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.eyebrow,
      });
    }
    
    contentChildren.push({
      id: 'article-headline',
      component: 'Heading',
      props: {
        as: 'h1',
        style: {
          margin: '8px 0 0 0',
          fontSize: '36px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: '36px',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.headline,
    });
    
    if (block.excerpt) {
      contentChildren.push({
        id: 'article-excerpt',
        component: 'Text',
        props: {
          style: {
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '24px',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.excerpt,
      });
    }
    
    children.push({
      id: 'article-content-section',
      component: 'Section',
      props: {
        style: {
          marginTop: '32px',
        },
      },
      children: contentChildren,
    });
    
    // Author section
    if (block.author) {
      children.push({
        id: 'article-author-divider',
        component: 'Hr',
        props: {
          style: {
            border: 'none',
            borderTop: '1px solid #d1d5db',
            margin: '16px 0',
          },
        },
      });
      
      children.push({
        id: 'article-author-row',
        component: 'Row',
        props: {
          style: {
            width: variant === 'single-author' ? 'auto' : '288px',
          },
        },
        children: [
          {
            id: 'article-author-img-col',
            component: 'Column',
            props: {
              style: {
                width: '48px',
                height: '48px',
                paddingTop: '5px',
              },
            },
            children: [{
              id: 'article-author-img',
              component: 'Img',
              props: {
                src: block.author.imageUrl || getPlaceholderImage(48, 48, block.author.name),
                alt: block.author.name,
                width: 48,
                height: 48,
                style: {
                  display: 'block',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                },
              },
            }],
          },
          {
            id: 'article-author-info-col',
            component: 'Column',
            props: {
              style: {
                paddingLeft: '18px',
                verticalAlign: 'top',
              },
            },
            children: [
              {
                id: 'article-author-name',
                component: 'Heading',
                props: {
                  as: 'h3',
                  style: {
                    margin: '0',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: variant === 'single-author' ? '#1f2937' : '#111827',
                    lineHeight: '20px',
                    fontFamily: settings.fontFamily,
                  },
                },
                content: block.author.name,
              },
              ...(block.author.title ? [{
                id: 'article-author-title',
                component: 'Text' as const,
                props: {
                  style: {
                    margin: '0',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#6b7280',
                    lineHeight: '14px',
                    fontFamily: settings.fontFamily,
                  },
                },
                content: block.author.title,
              } as EmailComponent] : []),
            ],
          },
        ],
      });
    }
  }
  
  return {
    id: 'article-section',
    component: 'Section',
    props: {
      style: {
        margin: '16px 0',
      },
    },
    children,
  };
}

function createGallerySection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];
  
  // Header
  if (block.heading || block.subheading) {
    const headerChildren: EmailComponent[] = [];
    
    if (block.heading) {
      headerChildren.push({
        id: 'gallery-heading',
        component: 'Text',
        props: {
          style: {
            margin: '0',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 600,
            color: '#4f46e5',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.heading,
      });
    }
    
    if (block.subheading) {
      headerChildren.push({
        id: 'gallery-subheading',
        component: 'Text',
        props: {
          style: {
            margin: '8px 0 0 0',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#6b7280',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.subheading,
      });
    }
    
    children.push({
      id: 'gallery-header-row',
      component: 'Row',
      props: { style: { marginTop: '42px' } },
      children: headerChildren,
    });
  }
  
  const variant = block.variant || 'grid-2x2';
  const images = block.images || [];
  
  // Helper to create image component
  const createImage = (image: any, index: number, height: number): EmailComponent => ({
    id: `gallery-img-${index}`,
    component: 'Img',
    props: {
      src: image.url || getPlaceholderImage(600, height, `gallery-${index}`),
      alt: image.alt || '',
      height,
      style: {
        width: '100%',
        borderRadius: '12px',
        objectFit: 'cover',
        display: 'block',
      },
    },
  });
  
  if (variant === 'grid-2x2') {
    // First row
    if (images.length >= 2) {
      children.push({
        id: 'gallery-row-1',
        component: 'Row',
        props: { style: { marginTop: '16px' } },
        children: [
          {
            id: 'gallery-col-1-1',
            component: 'Column',
            props: { style: { width: '50%', paddingRight: '8px' } },
            children: [createImage(images[0], 0, 288)],
          },
          {
            id: 'gallery-col-1-2',
            component: 'Column',
            props: { style: { width: '50%', paddingLeft: '8px' } },
            children: [createImage(images[1], 1, 288)],
          },
        ],
      });
    }
    
    // Second row
    if (images.length >= 4) {
      children.push({
        id: 'gallery-row-2',
        component: 'Row',
        props: { style: { marginTop: '16px' } },
        children: [
          {
            id: 'gallery-col-2-1',
            component: 'Column',
            props: { style: { width: '50%', paddingRight: '8px' } },
            children: [createImage(images[2], 2, 288)],
          },
          {
            id: 'gallery-col-2-2',
            component: 'Column',
            props: { style: { width: '50%', paddingLeft: '8px' } },
            children: [createImage(images[3], 3, 288)],
          },
        ],
      });
    }
  } else if (variant === '3-column') {
    const cols = images.slice(0, 3).map((image: any, index: number) => ({
      id: `gallery-col-${index}`,
      component: 'Column',
      props: { style: { width: '33.33%', paddingRight: '8px' } },
      children: [createImage(image, index, 186)],
    }));
    
    children.push({
      id: 'gallery-row-3col',
      component: 'Row',
      props: { style: { marginTop: '16px' } },
      children: cols,
    });
  } else if (variant === 'horizontal-split') {
    children.push({
      id: 'gallery-row-hsplit',
      component: 'Row',
      props: { style: { marginTop: '16px' } },
      children: [
        {
          id: 'gallery-col-left',
          component: 'Column',
          props: { style: { width: '50%', paddingRight: '8px' } },
          children: [
            {
              id: 'gallery-row-left-1',
              component: 'Row',
              props: { style: { paddingBottom: '8px' } },
              children: [createImage(images[0] || {}, 0, 152)],
            },
            {
              id: 'gallery-row-left-2',
              component: 'Row',
              props: { style: { paddingTop: '8px' } },
              children: [createImage(images[1] || {}, 1, 152)],
            },
          ],
        },
        {
          id: 'gallery-col-right',
          component: 'Column',
          props: { style: { width: '50%', padding: '8px 0 8px 8px' } },
          children: [createImage(images[2] || {}, 2, 320)],
        },
      ],
    });
  } else if (variant === 'vertical-split') {
    children.push(createImage(images[0] || {}, 0, 288));
    
    children.push({
      id: 'gallery-row-bottom',
      component: 'Row',
      props: { style: { marginTop: '16px' } },
      children: [
        {
          id: 'gallery-col-bottom-1',
          component: 'Column',
          props: { style: { width: '50%', paddingRight: '8px' } },
          children: [createImage(images[1] || {}, 1, 288)],
        },
        {
          id: 'gallery-col-bottom-2',
          component: 'Column',
          props: { style: { width: '50%', paddingLeft: '8px' } },
          children: [createImage(images[2] || {}, 2, 288)],
        },
      ],
    });
  }
  
  return {
    id: 'gallery-section',
    component: 'Section',
    props: {
      style: {
        margin: '16px 0',
      },
    },
    children,
  };
}

function createStatsSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];
  
  // Add heading and subheading if present
  if (block.heading || block.subheading) {
    const headerChildren: EmailComponent[] = [];
    
    if (block.heading) {
      headerChildren.push({
        id: 'stats-heading',
        component: 'Text',
        props: {
          style: {
            margin: '0',
            textAlign: 'center',
            fontSize: '28px',
            lineHeight: '36px',
            fontWeight: 700,
            color: '#111827',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.heading,
      });
    }
    
    if (block.subheading) {
      headerChildren.push({
        id: 'stats-subheading',
        component: 'Text',
        props: {
          style: {
            margin: '12px 0 0 0',
            textAlign: 'center',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#6b7280',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.subheading,
      });
    }
    
    children.push({
      id: 'stats-header-row',
      component: 'Row',
      props: { style: { marginBottom: '24px' } },
      children: [{
        id: 'stats-header-col',
        component: 'Column',
        props: {},
        children: headerChildren,
      }],
    });
  }
  
  const variant = block.variant || 'simple';
  
  if (variant === 'simple') {
    // Simple horizontal row layout
    const statColumns: EmailComponent[] = block.stats.map((stat: any, index: number) => {
      const statChildren: EmailComponent[] = [
        {
          id: `stat-value-${index}`,
          component: 'Text',
          props: {
            style: {
              margin: '0',
              textAlign: 'center',
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 700,
              color: '#111827',
              fontFamily: settings.fontFamily,
            },
          },
          content: stat.value,
        },
        {
          id: `stat-label-${index}`,
          component: 'Text',
          props: {
            style: {
              margin: '8px 0 0 0',
              textAlign: 'center',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 600,
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: settings.fontFamily,
            },
          },
          content: stat.label,
        },
      ];
      
      if (stat.description) {
        statChildren.push({
          id: `stat-desc-${index}`,
          component: 'Text',
          props: {
            style: {
              margin: '8px 0 0 0',
              textAlign: 'center',
              fontSize: '13px',
              lineHeight: '18px',
              color: '#6b7280',
              fontFamily: settings.fontFamily,
            },
          },
          content: stat.description,
        });
      }
      
      return {
        id: `stat-col-${index}`,
        component: 'Column',
        props: {
          style: {
            textAlign: 'center',
            padding: '0 16px',
          },
        },
        children: statChildren,
      };
    });
    
    children.push({
      id: 'stats-row',
      component: 'Row',
      props: {},
      children: statColumns,
    });
  } else if (variant === 'stepped') {
    // Stepped cards layout
    const backgrounds = ['#f9fafb', '#111827', '#4f46e5'];
    const textColors = ['#111827', '#f9fafb', '#eef2ff'];
    const descColors = ['#374151', '#d1d5db', '#c7d2fe'];
    const subDescColors = ['#6b7280', '#9ca3af', '#a5b4fc'];
    
    block.stats.forEach((stat: any, index: number) => {
      const bgColor = backgrounds[index % backgrounds.length];
      const textColor = textColors[index % textColors.length];
      const descColor = descColors[index % descColors.length];
      const subDescColor = subDescColors[index % subDescColors.length];
      
      const cardChildren: EmailComponent[] = [
        {
          id: `stepped-stat-value-${index}`,
          component: 'Text',
          props: {
            style: {
              margin: '0 0 8px 0',
              fontSize: '24px',
              lineHeight: '32px',
              fontWeight: 700,
              color: textColor,
              fontFamily: settings.fontFamily,
            },
          },
          content: stat.value,
        },
        {
          id: `stepped-stat-label-${index}`,
          component: 'Text',
          props: {
            style: {
              margin: '0',
              fontSize: '15px',
              lineHeight: '22px',
              color: descColor,
              fontFamily: settings.fontFamily,
            },
          },
          content: stat.label,
        },
      ];
      
      if (stat.description) {
        cardChildren.push({
          id: `stepped-stat-desc-${index}`,
          component: 'Text',
          props: {
            style: {
              margin: '4px 0 0 0',
              fontSize: '13px',
              lineHeight: '18px',
              color: subDescColor,
              fontFamily: settings.fontFamily,
            },
          },
          content: stat.description,
        });
      }
      
      children.push({
        id: `stepped-row-${index}`,
        component: 'Row',
        props: {
          style: {
            marginBottom: index < block.stats.length - 1 ? '8px' : '0',
          },
        },
        children: [{
          id: `stepped-col-${index}`,
          component: 'Column',
          props: {
            style: {
              minHeight: '112px',
              borderRadius: '16px',
              backgroundColor: bgColor,
              padding: '16px',
            },
          },
          children: cardChildren,
        }],
      });
    });
  }
  
  return {
    id: 'stats-section',
    component: 'Section',
    props: {
      style: {
        padding: '32px 16px',
      },
    },
    children,
  };
}

function createPricingSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];
  
  // Header
  if (block.heading || block.subheading) {
    const headerChildren: EmailComponent[] = [];
    
    if (block.heading) {
      headerChildren.push({
        id: 'pricing-heading',
        component: 'Heading',
        props: {
          as: 'h2',
          style: {
            fontSize: '24px',
            lineHeight: '32px',
            marginBottom: '12px',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.heading,
      });
    }
    
    if (block.subheading) {
      headerChildren.push({
        id: 'pricing-subheading',
        component: 'Text',
        props: {
          style: {
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '20px',
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.subheading,
      });
    }
    
    children.push({
      id: 'pricing-header-section',
      component: 'Section',
      props: {
        style: {
          marginBottom: '42px',
        },
      },
      children: headerChildren,
    });
  }
  
  const variant = block.variant || 'simple';
  const plans = block.plans || [];
  
  if (variant === 'simple' && plans.length === 1) {
    // Single pricing card
    const plan = plans[0];
    children.push({
      id: 'pricing-simple-card',
      component: 'Section',
      props: {
        style: {
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '12px',
          color: '#6b7280',
          padding: '28px',
          width: '100%',
          textAlign: 'left',
          marginBottom: '0',
        },
      },
      children: [
        {
          id: 'pricing-plan-name',
          component: 'Text',
          props: {
            style: {
              color: '#4f46e5',
              fontSize: '12px',
              lineHeight: '20px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginBottom: '16px',
              marginTop: '16px',
              textTransform: 'uppercase',
              fontFamily: settings.fontFamily,
            },
          },
          content: plan.highlighted ? 'Exclusive Offer' : plan.name,
        },
        {
          id: 'pricing-price-container',
          component: 'Text',
          props: {
            style: {
              fontSize: '30px',
              fontWeight: 700,
              lineHeight: '36px',
              marginBottom: '12px',
              marginTop: '0',
              fontFamily: settings.fontFamily,
            },
          },
          content: plan.interval 
            ? `${plan.price} / ${plan.interval}`
            : plan.price,
        },
        ...(plan.description ? [{
          id: 'pricing-description',
          component: 'Text' as const,
          props: {
            style: {
              color: '#374151',
              fontSize: '14px',
              lineHeight: '20px',
              marginTop: '16px',
              marginBottom: '24px',
              fontFamily: settings.fontFamily,
            },
          },
          content: plan.description,
        } as EmailComponent] : []),
        {
          id: 'pricing-features',
          component: 'Text',
          props: {
            style: {
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '24px',
              marginBottom: '32px',
              paddingLeft: '14px',
              fontFamily: settings.fontFamily,
            },
          },
          content: plan.features.map((f: string) => `• ${f}`).join('\n'),
        },
        {
          id: 'pricing-cta',
          component: 'Button',
          props: {
            href: plan.ctaUrl,
            style: {
              backgroundColor: '#4f46e5',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: '24px',
              padding: '14px',
              textAlign: 'center',
              width: '100%',
              display: 'block',
              textDecoration: 'none',
            },
          },
          content: plan.ctaText,
        },
        {
          id: 'pricing-divider',
          component: 'Hr',
          props: {
            style: {
              border: 'none',
              borderTop: '1px solid #e5e7eb',
              margin: '24px 0',
            },
          },
        },
        {
          id: 'pricing-fine-print-1',
          component: 'Text',
          props: {
            style: {
              color: '#6b7280',
              fontSize: '12px',
              lineHeight: '16px',
              fontStyle: 'italic',
              marginTop: '24px',
              marginBottom: '6px',
              textAlign: 'center',
              fontFamily: settings.fontFamily,
            },
          },
          content: 'Limited time offer - Upgrade now and save 20%',
        },
        {
          id: 'pricing-fine-print-2',
          component: 'Text',
          props: {
            style: {
              color: '#6b7280',
              fontSize: '12px',
              lineHeight: '16px',
              margin: '0',
              textAlign: 'center',
              fontFamily: settings.fontFamily,
            },
          },
          content: 'No credit card required. 14-day free trial available.',
        },
      ],
    });
  } else {
    // Two-tier comparison
    const planColumns = plans.slice(0, 2).map((plan: any, index: number) => {
      const isHighlighted = plan.highlighted;
      
      return {
        id: `pricing-plan-${index}`,
        component: 'Section' as const,
        props: {
          style: {
            backgroundColor: isHighlighted ? '#101827' : '#ffffff',
            border: isHighlighted ? '1px solid #101827' : '1px solid #d1d5db',
            borderRadius: '8px',
            color: isHighlighted ? '#d1d5db' : '#6b7280',
            padding: '24px',
            textAlign: 'left',
            width: '48%',
            marginBottom: isHighlighted ? '12px' : '24px',
            display: 'inline-block',
            verticalAlign: 'top',
          },
        },
        children: [
          {
            id: `pricing-plan-name-${index}`,
            component: 'Text' as const,
            props: {
              style: {
                color: isHighlighted ? '#7c86ff' : '#4f46e5',
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 600,
                marginBottom: '16px',
                fontFamily: settings.fontFamily,
              },
            },
            content: plan.name,
          } as EmailComponent,
          {
            id: `pricing-price-${index}`,
            component: 'Text' as const,
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '8px',
                marginTop: '0',
                color: isHighlighted ? '#ffffff' : '#101827',
                fontFamily: settings.fontFamily,
              },
            },
            content: plan.interval 
              ? `${plan.price} / ${plan.interval}`
              : plan.price,
          } as EmailComponent,
          ...(plan.description ? [{
            id: `pricing-desc-${index}`,
            component: 'Text' as const,
            props: {
              style: {
                marginTop: '12px',
                marginBottom: '24px',
                fontSize: '14px',
                fontFamily: settings.fontFamily,
              },
            },
            content: plan.description,
          } as EmailComponent] : []),
          {
            id: `pricing-features-${index}`,
            component: 'Text' as const,
            props: {
              style: {
                fontSize: '12px',
                lineHeight: '20px',
                marginBottom: '30px',
                paddingLeft: '14px',
                fontFamily: settings.fontFamily,
              },
            },
            content: plan.features.map((f: string) => `• ${f}`).join('\n'),
          } as EmailComponent,
          {
            id: `pricing-cta-${index}`,
            component: 'Button' as const,
            props: {
              href: plan.ctaUrl,
              style: {
                backgroundColor: '#4f46e5',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 600,
                margin: '0',
                padding: '12px',
                textAlign: 'center',
                width: '100%',
                display: 'block',
                textDecoration: 'none',
              },
            },
            content: plan.ctaText,
          } as EmailComponent,
        ],
      };
    });
    
    children.push({
      id: 'pricing-two-tier-container',
      component: 'Section',
      props: {
        style: {
          paddingBottom: '24px',
        },
      },
      children: [{
        id: 'pricing-two-tier-row',
        component: 'Row',
        props: {
          style: {
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
          },
        },
        children: planColumns,
      }],
    });
  }
  
  return {
    id: 'pricing-section',
    component: 'Section',
    props: {
      style: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
      },
    },
    children,
  };
}

function createListSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];
  
  if (block.heading) {
    children.push({
      id: 'list-heading',
      component: 'Heading',
      props: {
        as: 'h2',
        style: {
          marginBottom: '42px',
          textAlign: 'center',
          fontSize: '24px',
          lineHeight: '32px',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.heading,
    });
  }
  
  const variant = block.variant || 'numbered';
  const items = block.items || [];
  
  items.forEach((item: any, index: number) => {
    if (variant === 'numbered') {
      // Numbered list variant
      children.push({
        id: `list-item-${index}`,
        component: 'Section',
        props: {
          style: {
            marginBottom: index < items.length - 1 ? '36px' : '0',
          },
        },
        children: [{
          id: `list-item-row-${index}`,
          component: 'Row',
          props: {
            style: {
              paddingRight: '32px',
              paddingLeft: '12px',
            },
          },
          children: [
            {
              id: `list-item-number-col-${index}`,
              component: 'Column',
              props: {
                style: {
                  width: '24px',
                  height: '24px',
                  paddingRight: '18px',
                  verticalAlign: 'top',
                },
              },
              children: [{
                id: `list-item-number-${index}`,
                component: 'Text',
                props: {
                  style: {
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    textAlign: 'center',
                    display: 'inline-block',
                  },
                },
                content: String(index + 1),
              }],
            },
            {
              id: `list-item-content-col-${index}`,
              component: 'Column',
              props: {
                style: {
                  verticalAlign: 'top',
                },
              },
              children: [
                {
                  id: `list-item-title-${index}`,
                  component: 'Heading',
                  props: {
                    as: 'h2',
                    style: {
                      margin: '0 0 8px 0',
                      color: '#111827',
                      fontSize: '18px',
                      lineHeight: '28px',
                      fontFamily: settings.fontFamily,
                    },
                  },
                  content: item.title,
                },
                {
                  id: `list-item-desc-${index}`,
                  component: 'Text',
                  props: {
                    style: {
                      margin: '0',
                      color: '#6b7280',
                      fontSize: '14px',
                      lineHeight: '24px',
                      fontFamily: settings.fontFamily,
                    },
                  },
                  content: item.description,
                },
                ...(item.link ? [{
                  id: `list-item-link-${index}`,
                  component: 'Link' as const,
                  props: {
                    href: item.link,
                    style: {
                      marginTop: '12px',
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4f46e5',
                      textDecoration: 'none',
                      fontFamily: settings.fontFamily,
                    },
                  },
                  content: 'Learn more →',
                } as EmailComponent] : []),
              ],
            },
          ],
        }],
      });
    } else if (variant === 'image-left') {
      // Image-left list variant
      const itemChildren: EmailComponent[] = [
        {
          id: `list-item-img-col-${index}`,
          component: 'Column',
          props: {
            style: {
              width: '40%',
              paddingRight: '24px',
            },
          },
          children: [{
            id: `list-item-img-${index}`,
            component: 'Img',
            props: {
              src: item.imageUrl || getPlaceholderImage(240, 168, item.title),
              alt: item.title,
              width: '100%',
              height: 168,
              style: {
                display: 'block',
                width: '100%',
                borderRadius: '4px',
                objectFit: 'cover',
              },
            },
          }],
        },
        {
          id: `list-item-content-col-${index}`,
          component: 'Column',
          props: {
            style: {
              width: '60%',
              paddingRight: '24px',
            },
          },
          children: [
            {
              id: `list-item-number-${index}`,
              component: 'Text',
              props: {
                style: {
                  width: '24px',
                  height: '24px',
                  marginBottom: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: '24px',
                  textAlign: 'center',
                  display: 'inline-block',
                },
              },
              content: String(index + 1),
            },
            {
              id: `list-item-title-${index}`,
              component: 'Heading',
              props: {
                as: 'h2',
                style: {
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: '1',
                  fontFamily: settings.fontFamily,
                },
              },
              content: item.title,
            },
            {
              id: `list-item-desc-${index}`,
              component: 'Text',
              props: {
                style: {
                  margin: '0',
                  color: '#6b7280',
                  fontSize: '14px',
                  lineHeight: '24px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: item.description,
            },
            ...(item.link ? [{
              id: `list-item-link-${index}`,
              component: 'Link' as const,
              props: {
                href: item.link,
                style: {
                  marginTop: '12px',
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4f46e5',
                  textDecoration: 'none',
                  fontFamily: settings.fontFamily,
                },
              },
              content: 'Learn more →',
            } as EmailComponent] : []),
          ],
        },
      ];
      
      children.push({
        id: `list-item-${index}`,
        component: 'Section',
        props: {
          style: {
            marginBottom: index < items.length - 1 ? '30px' : '0',
          },
        },
        children: [{
          id: `list-item-row-${index}`,
          component: 'Row',
          props: {
            style: {
              marginBottom: '24px',
            },
          },
          children: itemChildren,
        }],
      });
    }
  });
  
  return {
    id: 'list-section',
    component: 'Section',
    props: {
      style: {
        margin: '16px 0',
      },
    },
    children,
  };
}

function createEcommerceSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const variant = block.variant || 'single';
  const products = block.products || [];
  
  if (variant === 'single' && products[0]) {
    // Single product centered
    const product = products[0];
    return {
      id: 'ecommerce-section',
      component: 'Section',
      props: {
        style: {
          margin: '16px 0',
        },
      },
      children: [
        {
          id: 'ecommerce-img',
          component: 'Img',
          props: {
            src: product.imageUrl || getPlaceholderImage(600, 320, product.name),
            alt: product.name,
            height: 320,
            style: {
              width: '100%',
              borderRadius: '12px',
              objectFit: 'cover',
              display: 'block',
            },
          },
        },
        {
          id: 'ecommerce-content-section',
          component: 'Section',
          props: {
            style: {
              marginTop: '32px',
              textAlign: 'center',
            },
          },
          children: [
            ...(block.heading ? [{
              id: 'ecommerce-heading',
              component: 'Text' as const,
              props: {
                style: {
                  marginTop: '16px',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#4f46e5',
                  lineHeight: '28px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: block.heading,
            } as EmailComponent] : []),
            {
              id: 'ecommerce-product-name',
              component: 'Heading',
              props: {
                as: 'h1',
                style: {
                  fontSize: '36px',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: '40px',
                  letterSpacing: '0.4px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: product.name,
            },
            ...(product.description ? [{
              id: 'ecommerce-product-desc',
              component: 'Text' as const,
              props: {
                style: {
                  marginTop: '8px',
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '24px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: product.description,
            } as EmailComponent] : []),
            {
              id: 'ecommerce-product-price',
              component: 'Text',
              props: {
                style: {
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: '24px',
                  fontFamily: settings.fontFamily,
                },
              },
              content: product.price,
            },
            {
              id: 'ecommerce-product-cta',
              component: 'Button',
              props: {
                href: product.ctaUrl,
                style: {
                  marginTop: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#4f46e5',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'inline-block',
                },
              },
              content: product.ctaText,
            },
          ],
        },
      ],
    };
  } else if (variant === 'image-left' && products[0]) {
    // Image on left layout
    const product = products[0];
    return {
      id: 'ecommerce-section',
      component: 'Section',
      props: {
        style: {
          margin: '16px 0',
        },
      },
      children: [{
        id: 'ecommerce-image-left-row',
        component: 'Row',
        props: {},
        children: [
          {
            id: 'ecommerce-img-col',
            component: 'Column',
            props: {
              style: {
                width: '50%',
                paddingRight: '32px',
              },
            },
            children: [{
              id: 'ecommerce-img',
              component: 'Img',
              props: {
                src: product.imageUrl || getPlaceholderImage(400, 220, product.name),
                alt: product.name,
                height: 220,
                style: {
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  display: 'block',
                },
              },
            }],
          },
          {
            id: 'ecommerce-content-col',
            component: 'Column',
            props: {
              style: {
                width: '50%',
                verticalAlign: 'baseline',
              },
            },
            children: [
              {
                id: 'ecommerce-product-name',
                component: 'Text',
                props: {
                  style: {
                    margin: '8px 0 0 0',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#111827',
                    lineHeight: '28px',
                    fontFamily: settings.fontFamily,
                  },
                },
                content: product.name,
              },
              ...(product.description ? [{
                id: 'ecommerce-product-desc',
                component: 'Text' as const,
                props: {
                  style: {
                    marginTop: '8px',
                    fontSize: '16px',
                    color: '#6b7280',
                    lineHeight: '24px',
                    fontFamily: settings.fontFamily,
                  },
                },
                content: product.description,
              } as EmailComponent] : []),
              {
                id: 'ecommerce-product-price',
                component: 'Text',
                props: {
                  style: {
                    marginTop: '8px',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111827',
                    lineHeight: '28px',
                    fontFamily: settings.fontFamily,
                  },
                },
                content: product.price,
              },
              {
                id: 'ecommerce-product-cta',
                component: 'Button',
                props: {
                  href: product.ctaUrl,
                  style: {
                    width: '75%',
                    borderRadius: '8px',
                    backgroundColor: '#4f46e5',
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#ffffff',
                    textDecoration: 'none',
                    display: 'inline-block',
                  },
                },
                content: product.ctaText,
              },
            ],
          },
        ],
      }],
    };
  } else if (variant === '3-column') {
    // Three columns layout
    const children: EmailComponent[] = [];
    
    if (block.heading || block.subheading) {
      const headerChildren: EmailComponent[] = [];
      if (block.heading) {
        headerChildren.push({
          id: 'ecommerce-heading',
          component: 'Text',
          props: {
            style: {
              margin: '0',
              fontSize: '20px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '28px',
              fontFamily: settings.fontFamily,
            },
          },
          content: block.heading,
        });
      }
      if (block.subheading) {
        headerChildren.push({
          id: 'ecommerce-subheading',
          component: 'Text',
          props: {
            style: {
              marginTop: '8px',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '24px',
              fontFamily: settings.fontFamily,
            },
          },
          content: block.subheading,
        });
      }
      children.push({
        id: 'ecommerce-header-row',
        component: 'Row',
        props: {},
        children: headerChildren,
      });
    }
    
    const productColumns = products.slice(0, 3).map((product: any, index: number) => ({
      id: `ecommerce-product-col-${index}`,
      component: 'Column' as const,
      props: {
        style: {
          padding: '16px 4px 16px 0',
          textAlign: 'left',
        },
      },
      children: [
        {
          id: `ecommerce-product-img-${index}`,
          component: 'Img' as const,
          props: {
            src: product.imageUrl || getPlaceholderImage(200, 180, product.name),
            alt: product.name,
            height: 180,
            style: {
              width: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
              display: 'block',
            },
          },
        } as EmailComponent,
        {
          id: `ecommerce-product-name-${index}`,
          component: 'Text' as const,
          props: {
            style: {
              margin: '24px 0 0 0',
              fontSize: '20px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '28px',
              fontFamily: settings.fontFamily,
            },
          },
          content: product.name,
        } as EmailComponent,
        ...(product.description ? [{
          id: `ecommerce-product-desc-${index}`,
          component: 'Text' as const,
          props: {
            style: {
              margin: '16px 0 0 0',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '24px',
              fontFamily: settings.fontFamily,
            },
          },
          content: product.description,
        } as EmailComponent] : []),
        {
          id: `ecommerce-product-price-${index}`,
          component: 'Text' as const,
          props: {
            style: {
              margin: '8px 0 0 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '24px',
              fontFamily: settings.fontFamily,
            },
          },
          content: product.price,
        } as EmailComponent,
        {
          id: `ecommerce-product-cta-${index}`,
          component: 'Button' as const,
          props: {
            href: product.ctaUrl,
            style: {
              marginTop: '16px',
              marginBottom: '24px',
              borderRadius: '8px',
              backgroundColor: '#4f46e5',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              textDecoration: 'none',
              display: 'inline-block',
            },
          },
          content: product.ctaText,
        } as EmailComponent,
      ],
    }));
    
    children.push({
      id: 'ecommerce-products-row',
      component: 'Row',
      props: {
        style: {
          marginTop: '16px',
        },
      },
      children: productColumns,
    });
    
    return {
      id: 'ecommerce-section',
      component: 'Section',
      props: {
        style: {
          margin: '16px 0',
        },
      },
      children,
    };
  } else if (variant === '4-grid') {
    // 2x2 grid layout - simplified version for transforms
    const children: EmailComponent[] = [];
    
    // Header
    if (block.heading || block.subheading) {
      const headerChildren: EmailComponent[] = [];
      
      if (block.heading) {
        headerChildren.push({
          id: 'ecommerce-heading',
          component: 'Text',
          props: {
            style: {
              margin: '0',
              fontSize: '20px',
              fontWeight: 600,
              color: '#111827',
              lineHeight: '28px',
              fontFamily: settings.fontFamily,
            },
          },
          content: block.heading,
        });
      }
      if (block.subheading) {
        headerChildren.push({
          id: 'ecommerce-subheading',
          component: 'Text',
          props: {
            style: {
              marginTop: '8px',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '24px',
              fontFamily: settings.fontFamily,
            },
          },
          content: block.subheading,
        });
      }
      
      children.push({
        id: 'ecommerce-header-row',
        component: 'Row',
        props: {},
        children: headerChildren,
      });
    }
    
    // Create rows for each pair of products
    for (let i = 0; i < Math.min(4, products.length); i += 2) {
      const rowProducts = products.slice(i, i + 2);
      const productColumns = rowProducts.map((product: any, colIndex: number) => ({
        id: `ecommerce-product-col-${i + colIndex}`,
        component: 'Column' as const,
        props: {
          style: {
            width: '50%',
            paddingRight: colIndex === 0 ? '8px' : '0',
            paddingLeft: colIndex === 1 ? '8px' : '0',
            textAlign: 'left',
          },
        },
        children: [
          {
            id: `ecommerce-product-img-${i + colIndex}`,
            component: 'Img' as const,
            props: {
              src: product.imageUrl || getPlaceholderImage(300, 250, product.name),
              alt: product.name,
              height: 250,
              style: {
                width: '100%',
                borderRadius: '8px',
                objectFit: 'cover',
                display: 'block',
              },
            },
          } as EmailComponent,
          {
            id: `ecommerce-product-name-${i + colIndex}`,
            component: 'Text' as const,
            props: {
              style: {
                margin: '24px 0 0 0',
                fontSize: '20px',
                fontWeight: 600,
                color: '#111827',
                lineHeight: '28px',
                fontFamily: settings.fontFamily,
              },
            },
            content: product.name,
          } as EmailComponent,
          ...(product.description ? [{
            id: `ecommerce-product-desc-${i + colIndex}`,
            component: 'Text' as const,
            props: {
              style: {
                margin: '16px 0 0 0',
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '24px',
                fontFamily: settings.fontFamily,
              },
            },
            content: product.description,
          } as EmailComponent] : []),
          {
            id: `ecommerce-product-price-${i + colIndex}`,
            component: 'Text' as const,
            props: {
              style: {
                margin: '8px 0 0 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#111827',
                lineHeight: '24px',
                fontFamily: settings.fontFamily,
              },
            },
            content: product.price,
          } as EmailComponent,
          {
            id: `ecommerce-product-cta-${i + colIndex}`,
            component: 'Button' as const,
            props: {
              href: product.ctaUrl,
              style: {
                marginTop: '16px',
                marginBottom: '24px',
                borderRadius: '8px',
                backgroundColor: '#4f46e5',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-block',
              },
            },
            content: product.ctaText,
          } as EmailComponent,
        ],
      }));
      
      children.push({
        id: `ecommerce-products-row-${Math.floor(i / 2)}`,
        component: 'Row',
        props: {
          style: {
            marginTop: '16px',
          },
        },
        children: productColumns,
      });
    }
    
    return {
      id: 'ecommerce-section',
      component: 'Section',
      props: {
        style: {
          margin: '16px 0',
        },
      },
      children,
    };
  } else if (variant === 'checkout') {
    // Checkout cart table
    const children: EmailComponent[] = [];
    
    children.push({
      id: 'ecommerce-cart-heading',
      component: 'Heading',
      props: {
        as: 'h1',
        style: {
          marginBottom: '0',
          fontSize: '30px',
          fontWeight: 600,
          lineHeight: '36px',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.heading || 'Your Cart',
    });
    
    // Cart items (simplified)
    const cartItems: EmailComponent[] = products.map((product: any, index: number) => ({
      id: `cart-item-${index}`,
      component: 'Row' as const,
      props: {
        style: {
          borderBottom: '1px solid #e5e7eb',
          padding: '8px 0',
        },
      },
      children: [
        {
          id: `cart-item-img-${index}`,
          component: 'Column' as const,
          props: {
            style: {
              width: '80px',
            },
          },
          children: [{
            id: `cart-img-${index}`,
            component: 'Img' as const,
            props: {
              src: product.imageUrl || getPlaceholderImage(80, 110, product.name),
              alt: product.name,
              height: 110,
              style: {
                borderRadius: '8px',
                objectFit: 'cover',
              },
            },
          } as EmailComponent],
        } as EmailComponent,
        {
          id: `cart-item-details-${index}`,
          component: 'Column' as const,
          props: {
            style: {
              paddingLeft: '16px',
            },
          },
          children: [
            {
              id: `cart-item-name-${index}`,
              component: 'Text' as const,
              props: {
                style: {
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: settings.fontFamily,
                },
              },
              content: product.name,
            } as EmailComponent,
            {
              id: `cart-item-price-${index}`,
              component: 'Text' as const,
              props: {
                style: {
                  fontSize: '14px',
                  color: '#6b7280',
                  fontFamily: settings.fontFamily,
                },
              },
              content: `Qty: 1 × ${product.price}`,
            } as EmailComponent,
          ],
        } as EmailComponent,
      ],
    }));
    
    children.push({
      id: 'ecommerce-cart-section',
      component: 'Section',
      props: {
        style: {
          margin: '16px 0',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '16px',
          paddingTop: '0',
        },
      },
      children: [
        ...cartItems,
        {
          id: 'cart-checkout-row',
          component: 'Row',
          props: {
            style: {
              marginTop: '16px',
            },
          },
          children: [{
            id: 'cart-checkout-col',
            component: 'Column',
            props: {
              style: {
                textAlign: 'center',
              },
            },
            children: [{
              id: 'cart-checkout-button',
              component: 'Button',
              props: {
                href: products[0]?.ctaUrl || '#',
                style: {
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: '#4f46e5',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'block',
                },
              },
              content: products[0]?.ctaText || 'Checkout',
            }],
          }],
        },
      ],
    });
    
    return {
      id: 'ecommerce-section',
      component: 'Section',
      props: {
        style: {
          padding: '16px 0',
          textAlign: 'center',
        },
      },
      children,
    };
  }
  
  // Fallback
  return {
    id: 'ecommerce-section',
    component: 'Section',
    props: {
      style: {
        padding: '48px 24px',
      },
    },
    children: [{
      id: 'ecommerce-heading',
      component: 'Heading',
      props: {
        as: 'h2',
        style: {
          fontSize: '32px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.heading || 'Products',
    }],
  };
}

// ============================================================================
// Marketing (Bento Grid) Transform
// ============================================================================

function createMarketingSection(
  block: any,
  settings: GlobalEmailSettings
): EmailComponent {
  const { heading, subheading, featuredItem, items } = block;
  const children: EmailComponent[] = [];

  // Header
  if (heading || subheading) {
    if (heading) {
      children.push({
        id: 'marketing-heading',
        component: 'Heading',
        props: {
          as: 'h2',
          style: {
            color: '#1a1a1a',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: heading,
      });
    }

    if (subheading) {
      children.push({
        id: 'marketing-subheading',
        component: 'Text',
        props: {
          style: {
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: subheading,
      });
    }
  }

  // Bento Grid Row
  const featuredColumn: EmailComponent = {
    id: 'marketing-featured-col',
    component: 'Column',
    props: {
      style: {
        width: '100%',
        maxWidth: '360px',
        verticalAlign: 'top',
        padding: '0 8px 16px 0',
      },
    },
    children: [
      {
        id: 'marketing-featured-container',
        component: 'Section',
        props: {
          style: {
            backgroundColor: '#f5f5f5',
            borderRadius: '12px',
            padding: '0',
          },
        },
        children: (() => {
          const featuredChildren: EmailComponent[] = [];

          // Featured Image
          if (featuredItem.imageUrl) {
            featuredChildren.push({
              id: 'marketing-featured-img',
              component: 'Img',
              props: {
                src: featuredItem.imageUrl || getPlaceholderImage(360, 240, featuredItem.title),
                alt: featuredItem.imageAlt || featuredItem.title,
                style: {
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                },
              },
            });
          }

          // Featured Content Container
          const featuredContentChildren: EmailComponent[] = [];

          // Featured Title
          featuredContentChildren.push({
            id: 'marketing-featured-title',
            component: 'Heading',
            props: {
              as: 'h3',
              style: {
                color: '#1a1a1a',
                fontSize: '24px',
                fontWeight: 700,
                lineHeight: '1.3',
                margin: '0 0 8px 0',
                fontFamily: settings.fontFamily,
              },
            },
            content: featuredItem.title,
          });

          // Featured Description
          if (featuredItem.description) {
            featuredContentChildren.push({
              id: 'marketing-featured-desc',
              component: 'Text',
              props: {
                style: {
                  color: '#666666',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                  fontFamily: settings.fontFamily,
                },
              },
              content: featuredItem.description,
            });
          }

          // Featured CTA
          if (featuredItem.ctaText && featuredItem.ctaUrl) {
            featuredContentChildren.push({
              id: 'marketing-featured-cta',
              component: 'Button',
              props: {
                href: featuredItem.ctaUrl,
                style: {
                  backgroundColor: settings.primaryColor,
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'inline-block',
                  fontFamily: settings.fontFamily,
                },
              },
              content: featuredItem.ctaText,
            });
          }

          // Add content section
          featuredChildren.push({
            id: 'marketing-featured-content',
            component: 'Section',
            props: {
              style: {
                padding: '24px',
              },
            },
            children: featuredContentChildren,
          });

          return featuredChildren;
        })(),
      },
    ],
  };

  // Smaller Items Column
  const itemsColumn: EmailComponent = {
    id: 'marketing-items-col',
    component: 'Column',
    props: {
      style: {
        width: '100%',
        maxWidth: '360px',
        verticalAlign: 'top',
        padding: '0 0 0 8px',
      },
    },
    children: items.map((item: any, index: number) => ({
      id: `marketing-item-${index}`,
      component: 'Section' as const,
      props: {
        style: {
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: index < items.length - 1 ? '16px' : '0',
        },
      },
      children: (() => {
        const itemChildren: EmailComponent[] = [];

        // Item Image
        if (item.imageUrl) {
          itemChildren.push({
            id: `marketing-item-img-${index}`,
            component: 'Img' as const,
            props: {
              src: item.imageUrl || getPlaceholderImage(320, 180, item.title),
              alt: item.imageAlt || item.title,
              style: {
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
                marginBottom: '12px',
              },
            },
          });
        }

        // Item Title
        itemChildren.push({
          id: `marketing-item-title-${index}`,
          component: 'Heading' as const,
          props: {
            as: 'h4',
            style: {
              color: '#1a1a1a',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '1.3',
              margin: '0 0 8px 0',
              fontFamily: settings.fontFamily,
            },
          },
          content: item.title,
        });

        // Item Description
        if (item.description) {
          itemChildren.push({
            id: `marketing-item-desc-${index}`,
            component: 'Text' as const,
            props: {
              style: {
                color: '#666666',
                fontSize: '13px',
                lineHeight: '1.5',
                margin: '0 0 12px 0',
                fontFamily: settings.fontFamily,
              },
            },
            content: item.description,
          });
        }

        // Item CTA
        if (item.ctaText && item.ctaUrl) {
          itemChildren.push({
            id: `marketing-item-cta-${index}`,
            component: 'Link' as const,
            props: {
              href: item.ctaUrl,
              style: {
                color: settings.primaryColor,
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: settings.fontFamily,
              },
            },
            content: `${item.ctaText} →`,
          });
        }

        return itemChildren;
      })(),
    })),
  };

  // Add Grid Row
  children.push({
    id: 'marketing-grid-row',
    component: 'Row',
    props: {},
    children: [featuredColumn, itemsColumn],
  });

  return {
    id: 'marketing-section',
    component: 'Section',
    props: {
      style: {
        padding: '60px 24px',
      },
    },
    children,
  };
}

// ============================================================================
// Header Transform
// ============================================================================

function createHeaderSection(
  block: any,
  settings: GlobalEmailSettings
): EmailComponent {
  const { variant = 'centered-menu', logoUrl, logoAlt, companyName, menuItems = [], socialLinks = [] } = block;

  if (variant === 'side-menu') {
    // Side Menu Header: Logo on left, menu items on right
    const columns: EmailComponent[] = [];

    // Logo Column
    const logoChildren: EmailComponent[] = [];
    if (logoUrl && isValidImageUrl(logoUrl)) {
      logoChildren.push({
        id: 'header-logo-img',
        component: 'Img',
        props: {
          src: logoUrl,
          alt: logoAlt || companyName || 'Logo',
          width: 120,
          style: {
            maxWidth: '120px',
            height: 'auto',
          },
        },
      });
    } else if (companyName) {
      logoChildren.push({
        id: 'header-company-name',
        component: 'Text',
        props: {
          style: {
            fontSize: '20px',
            fontWeight: 700,
            color: settings.primaryColor,
            margin: '0',
            fontFamily: settings.fontFamily,
          },
        },
        content: companyName,
      });
    }

    columns.push({
      id: 'header-logo-col',
      component: 'Column',
      props: {
        style: {
          width: '40%',
          verticalAlign: 'middle',
        },
      },
      children: logoChildren,
    });

    // Menu Column
    if (menuItems.length > 0) {
      const menuChildren: EmailComponent[] = menuItems.map((item: any, index: number) => ({
        id: `header-menu-${index}`,
        component: 'Link' as const,
        props: {
          href: item.url,
          style: {
            color: '#666666',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            padding: '0 8px',
            fontFamily: settings.fontFamily,
          },
        },
        content: item.label,
      }));

      columns.push({
        id: 'header-menu-col',
        component: 'Column',
        props: {
          style: {
            width: '60%',
            verticalAlign: 'middle',
            textAlign: 'right',
          },
        },
        children: menuChildren,
      });
    }

    return {
      id: 'header-section',
      component: 'Section',
      props: {
        style: {
          padding: '32px 24px',
        },
      },
      children: [{
        id: 'header-row',
        component: 'Row',
        props: {},
        children: columns,
      }],
    };
  } else if (variant === 'social-icons') {
    // Social Icons Header: Logo centered at top, social icons below
    const children: EmailComponent[] = [];

    // Logo
    if (logoUrl && isValidImageUrl(logoUrl)) {
      children.push({
        id: 'header-logo-img',
        component: 'Img',
        props: {
          src: logoUrl,
          alt: logoAlt || companyName || 'Logo',
          width: 140,
          style: {
            maxWidth: '140px',
            height: 'auto',
            margin: '0 auto 20px',
            display: 'block',
          },
        },
      });
    } else if (companyName) {
      children.push({
        id: 'header-company-name',
        component: 'Text',
        props: {
          style: {
            fontSize: '24px',
            fontWeight: 700,
            color: settings.primaryColor,
            margin: '0 0 20px 0',
            fontFamily: settings.fontFamily,
          },
        },
        content: companyName,
      });
    }

    // Social Icons
    if (socialLinks.length > 0) {
      const socialChildren: EmailComponent[] = socialLinks.map((social: any, index: number) => ({
        id: `header-social-${index}`,
        component: 'Link' as const,
        props: {
          href: social.url,
          style: {
            display: 'inline-block',
            margin: '0 8px',
          },
        },
        children: [{
          id: `header-social-img-${index}`,
          component: 'Img' as const,
          props: {
            src: getSocialIconUrl(social.platform),
            alt: social.platform,
            width: 24,
            height: 24,
            style: {
              width: '24px',
              height: '24px',
              display: 'block',
            },
          },
        }] as EmailComponent[],
      }));

      children.push({
        id: 'header-social-row',
        component: 'Row',
        props: {},
        children: [{
          id: 'header-social-col',
          component: 'Column',
          props: {
            style: {
              textAlign: 'center',
            },
          },
          children: socialChildren,
        }],
      });
    }

    return {
      id: 'header-section',
      component: 'Section',
      props: {
        style: {
          padding: '40px 24px 32px',
          textAlign: 'center',
        },
      },
      children,
    };
  } else {
    // Default: Centered Menu Header
    const children: EmailComponent[] = [];

    // Logo
    if (logoUrl && isValidImageUrl(logoUrl)) {
      children.push({
        id: 'header-logo-img',
        component: 'Img',
        props: {
          src: logoUrl,
          alt: logoAlt || companyName || 'Logo',
          width: 140,
          style: {
            maxWidth: '140px',
            height: 'auto',
            margin: '0 auto 20px',
            display: 'block',
          },
        },
      });
    } else if (companyName) {
      children.push({
        id: 'header-company-name',
        component: 'Text',
        props: {
          style: {
            fontSize: '24px',
            fontWeight: 700,
            color: settings.primaryColor,
            margin: '0 0 20px 0',
            fontFamily: settings.fontFamily,
          },
        },
        content: companyName,
      });
    }

    // Menu Items
    if (menuItems.length > 0) {
      const menuChildren: EmailComponent[] = [];
      
      menuItems.forEach((item: any, index: number) => {
        menuChildren.push({
          id: `header-menu-${index}`,
          component: 'Link' as const,
          props: {
            href: item.url,
            style: {
              color: '#666666',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '0 12px',
              fontFamily: settings.fontFamily,
            },
          },
          content: item.label,
        });

        // Add separator
        if (index < menuItems.length - 1) {
          menuChildren.push({
            id: `header-menu-sep-${index}`,
            component: 'Text' as const,
            props: {
              style: {
                color: '#cccccc',
                padding: '0 4px',
                display: 'inline',
              },
            },
            content: '|',
          });
        }
      });

      children.push({
        id: 'header-menu-row',
        component: 'Row',
        props: {},
        children: [{
          id: 'header-menu-col',
          component: 'Column',
          props: {
            style: {
              textAlign: 'center',
            },
          },
          children: menuChildren,
        }],
      });
    }

    return {
      id: 'header-section',
      component: 'Section',
      props: {
        style: {
          padding: '40px 24px 32px',
          textAlign: 'center',
        },
      },
      children,
    };
  }
}

// Helper for social icon URLs
function getSocialIconUrl(platform: string): string {
  const icons: Record<string, string> = {
    twitter: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"%3E%3C/path%3E%3C/svg%3E',
    facebook: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"%3E%3C/path%3E%3C/svg%3E',
    instagram: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Crect x="2" y="2" width="20" height="20" rx="5" ry="5"%3E%3C/rect%3E%3Cpath d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"%3E%3C/path%3E%3Cline x1="17.5" y1="6.5" x2="17.51" y2="6.5"%3E%3C/line%3E%3C/svg%3E',
    linkedin: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"%3E%3C/path%3E%3Ccircle cx="4" cy="4" r="2"%3E%3C/circle%3E%3C/svg%3E',
  };
  return icons[platform.toLowerCase()] || icons.twitter;
}

// ============================================================================
// Feedback Transform
// ============================================================================

function createFeedbackSection(
  block: any,
  settings: GlobalEmailSettings
): EmailComponent {
  const { variant = 'simple-rating', heading, subheading, ctaText, ctaUrl, questions = [], reviews = [] } = block;

  if (variant === 'survey') {
    // Survey Feedback: Multi-question survey
    const children: EmailComponent[] = [];

    // Header
    if (heading) {
      children.push({
        id: 'feedback-heading',
        component: 'Heading',
        props: {
          as: 'h2',
          style: {
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: heading,
      });
    }

    if (subheading) {
      children.push({
        id: 'feedback-subheading',
        component: 'Text',
        props: {
          style: {
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: subheading,
      });
    }

    // Questions
    questions.forEach((question: any, index: number) => {
      const questionChildren: EmailComponent[] = [];

      // Question Text
      questionChildren.push({
        id: `feedback-question-${index}`,
        component: 'Text',
        props: {
          style: {
            color: '#1a1a1a',
            fontSize: '16px',
            fontWeight: 600,
            margin: '0 0 16px 0',
            fontFamily: settings.fontFamily,
          },
        },
        content: `${index + 1}. ${question.text}`,
      });

      // Answer Options
      if (question.options && question.options.length > 0) {
        const optionChildren: EmailComponent[] = question.options.map((option: string, optIndex: number) => ({
          id: `feedback-option-${index}-${optIndex}`,
          component: 'Link' as const,
          props: {
            href: ctaUrl ? `${ctaUrl}?q=${index + 1}&a=${optIndex + 1}` : '#',
            style: {
              display: 'block',
              padding: '10px 16px',
              backgroundColor: '#ffffff',
              color: '#666666',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: settings.fontFamily,
              border: '1px solid #e5e5e5',
              marginBottom: '8px',
            },
          },
          content: option,
        }));

        questionChildren.push({
          id: `feedback-options-${index}`,
          component: 'Column',
          props: {},
          children: optionChildren,
        });
      }

      children.push({
        id: `feedback-question-container-${index}`,
        component: 'Section',
        props: {
          style: {
            marginBottom: '32px',
            padding: '24px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          },
        },
        children: questionChildren,
      });
    });

    // CTA Button
    if (ctaText && ctaUrl) {
      children.push({
        id: 'feedback-cta-row',
        component: 'Row',
        props: {},
        children: [{
          id: 'feedback-cta-col',
          component: 'Column',
          props: {
            style: {
              textAlign: 'center',
            },
          },
          children: [{
            id: 'feedback-cta-button',
            component: 'Button',
            props: {
              href: ctaUrl,
              style: {
                backgroundColor: settings.primaryColor,
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                display: 'inline-block',
                fontFamily: settings.fontFamily,
              },
            },
            content: ctaText,
          }],
        }],
      });
    }

    return {
      id: 'feedback-section',
      component: 'Section',
      props: {
        style: {
          padding: '60px 24px',
        },
      },
      children,
    };
  } else if (variant === 'customer-reviews') {
    // Customer Reviews Display
    const children: EmailComponent[] = [];

    // Header
    if (heading) {
      children.push({
        id: 'feedback-heading',
        component: 'Heading',
        props: {
          as: 'h2',
          style: {
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: heading,
      });
    }

    if (subheading) {
      children.push({
        id: 'feedback-subheading',
        component: 'Text',
        props: {
          style: {
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: subheading,
      });
    }

    // Reviews Grid
    if (reviews.length > 0) {
      const reviewColumns: EmailComponent[] = reviews.map((review: any, index: number) => ({
        id: `feedback-review-col-${index}`,
        component: 'Column' as const,
        props: {
          style: {
            width: reviews.length === 1 ? '100%' : '50%',
            padding: '0 8px',
            verticalAlign: 'top',
          },
        },
        children: [{
          id: `feedback-review-${index}`,
          component: 'Section' as const,
          props: {
            style: {
              padding: '24px',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              marginBottom: '16px',
            },
          },
          children: (() => {
            const reviewChildren: EmailComponent[] = [];

            // Rating Stars
            if (review.rating) {
              reviewChildren.push({
                id: `feedback-rating-${index}`,
                component: 'Text' as const,
                props: {
                  style: {
                    fontSize: '20px',
                    margin: '0 0 12px 0',
                  },
                },
                content: '⭐'.repeat(Math.min(5, Math.max(1, review.rating))),
              });
            }

            // Review Text
            reviewChildren.push({
              id: `feedback-text-${index}`,
              component: 'Text' as const,
              props: {
                style: {
                  color: '#1a1a1a',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                  fontFamily: settings.fontFamily,
                  fontStyle: 'italic',
                },
              },
              content: `"${review.text}"`,
            });

            // Author Info
            const authorText = review.authorTitle 
              ? `${review.authorName} • ${review.authorTitle}`
              : review.authorName;
            
            reviewChildren.push({
              id: `feedback-author-${index}`,
              component: 'Text' as const,
              props: {
                style: {
                  color: '#666666',
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: '0',
                  fontFamily: settings.fontFamily,
                },
              },
              content: authorText,
            });

            return reviewChildren;
          })(),
        }],
      }));

      children.push({
        id: 'feedback-reviews-row',
        component: 'Row',
        props: {},
        children: reviewColumns,
      });
    }

    return {
      id: 'feedback-section',
      component: 'Section',
      props: {
        style: {
          padding: '60px 24px',
        },
      },
      children,
    };
  } else {
    // Default: Simple Rating
    const children: EmailComponent[] = [];

    // Header
    if (heading) {
      children.push({
        id: 'feedback-heading',
        component: 'Heading',
        props: {
          as: 'h2',
          style: {
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: heading,
      });
    }

    if (subheading) {
      children.push({
        id: 'feedback-subheading',
        component: 'Text',
        props: {
          style: {
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: subheading,
      });
    }

    // Star Rating Buttons
    const ratingButtons: EmailComponent[] = [1, 2, 3, 4, 5].map((rating) => ({
      id: `feedback-rating-${rating}`,
      component: 'Link' as const,
      props: {
        href: ctaUrl ? `${ctaUrl}?rating=${rating}` : '#',
        style: {
          display: 'inline-block',
          padding: '12px 16px',
          backgroundColor: '#f5f5f5',
          color: '#1a1a1a',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '24px',
          fontWeight: 600,
          fontFamily: settings.fontFamily,
          margin: '0 4px',
        },
      },
      content: '⭐'.repeat(rating),
    }));

    children.push({
      id: 'feedback-rating-row',
      component: 'Row',
      props: {},
      children: [{
        id: 'feedback-rating-col',
        component: 'Column',
        props: {
          style: {
            textAlign: 'center',
          },
        },
        children: ratingButtons,
      }],
    });

    // Alternative Text Link
    if (ctaUrl) {
      children.push({
        id: 'feedback-alt-text',
        component: 'Text',
        props: {
          style: {
            marginTop: '24px',
            fontSize: '14px',
            color: '#999999',
            fontFamily: settings.fontFamily,
          },
        },
        children: [{
          id: 'feedback-alt-link',
          component: 'Link' as const,
          props: {
            href: ctaUrl,
            style: {
              color: settings.primaryColor,
              textDecoration: 'none',
            },
          },
          content: 'Or leave detailed feedback →',
        }] as EmailComponent[],
      });
    }

    return {
      id: 'feedback-section',
      component: 'Section',
      props: {
        style: {
          padding: '60px 24px',
          textAlign: 'center',
        },
      },
      children,
    };
  }
}

