/**
 * Transform Functions
 * 
 * Converts semantic content blocks into React Email components (EmailComponent structure)
 * Uses direct component creation for consistent, deterministic rendering with perfect visuals
 */

import type { EmailComponent, GlobalEmailSettings } from '../types';
import type { SemanticBlock } from './blocks';
import {
  getSafeHeadlineColor,
  getSafeBodyColor,
  getSafeTextColor,
  DEFAULT_COLORS,
  validateHexColor,
} from '../color-utils';

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
 * Creates EmailComponent structure directly with precise styling
 */
export function transformBlockToEmail(
  block: SemanticBlock,
  settings: GlobalEmailSettings
): EmailComponent {
  // Map block type to component structure
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
    case 'heading':
      return createHeadingSection(block, settings);
    case 'text':
      return createTextSection(block, settings);
    case 'link':
      return createLinkSection(block, settings);
    case 'buttons':
      return createButtonsSection(block, settings);
    case 'image':
      return createImageSection(block, settings);
    case 'avatars':
      return createAvatarsSection(block, settings);
    case 'code':
      return createCodeSection(block, settings);
    case 'markdown':
      return createMarkdownSection(block, settings);
    case 'articles':
      return createArticlesSection(block, settings);
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

// ============================================================================
// Block Creation Functions
// ============================================================================

function createHeroSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  // Smart color selection for hero:
  // If user provided heroTextColor, use it (with safety check)
  // Otherwise, use white (good contrast on colored backgrounds)
  const heroHeadlineColor = getSafeHeadlineColor(
    validateHexColor(settings.heroTextColor),
    settings.primaryColor,
    DEFAULT_COLORS.heroHeadline
  );
  
  const heroSubheadlineColor = getSafeBodyColor(
    validateHexColor(settings.heroTextColor),
    settings.primaryColor,
    DEFAULT_COLORS.heroSubheadline
  );
  
  const children: EmailComponent[] = [
    {
      id: 'hero-heading',
      component: 'Heading',
      props: {
        as: 'h1',
        style: {
          color: heroHeadlineColor, // Now respects user preference with safety checks
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
          color: heroSubheadlineColor, // Now respects user preference
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
  // Smart color selection for features (on white background):
  // Use headlineColor if provided, otherwise default to dark gray
  const featureHeadlineColor = getSafeHeadlineColor(
    validateHexColor(settings.headlineColor),
    DEFAULT_COLORS.white,
    DEFAULT_COLORS.contentHeadline
  );
  
  const featureBodyColor = getSafeBodyColor(
    validateHexColor(settings.bodyTextColor),
    DEFAULT_COLORS.white,
    DEFAULT_COLORS.contentSubtext
  );
  
  const children: EmailComponent[] = [];

  if (block.heading) {
    children.push({
      id: 'features-heading',
      component: 'Heading',
      props: {
        as: 'h2',
        style: {
          color: featureHeadlineColor, // Now respects user preference
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
          color: featureBodyColor, // Now respects user preference
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

  const featureColumns: EmailComponent[] = block.features.map((feature: any, index: number) => {
    const featureChildren: EmailComponent[] = [];

    // Feature image/icon
    if (feature.imageUrl && isValidImageUrl(feature.imageUrl)) {
      featureChildren.push({
        id: `feature-img-${index}`,
        component: 'Img',
        props: {
          src: feature.imageUrl,
          alt: feature.title,
          width: 48,
          height: 48,
          style: {
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            display: 'block',
          },
        },
      });
    }

    // Feature title
    featureChildren.push({
      id: `feature-title-${index}`,
      component: 'Heading',
      props: {
        as: 'h3',
        style: {
          color: '#111827',
          fontSize: '20px',
          fontWeight: 600,
          margin: '0 0 8px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: feature.title,
    });

    // Feature description
    featureChildren.push({
      id: `feature-desc-${index}`,
      component: 'Text',
      props: {
        style: {
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: '0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: feature.description,
    });

    return {
      id: `feature-col-${index}`,
      component: 'Column',
      props: {
        style: {
          width: columnWidth,
          padding: '16px',
          verticalAlign: 'top',
        },
      },
      children: featureChildren,
    };
  });

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
          fontWeight: 700,
          color: '#111827',
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
                    backgroundColor: settings.primaryColor || '#4f46e5',
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
                      fontWeight: 600,
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
                      color: settings.primaryColor || '#4f46e5',
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
              width: 240,
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
                  backgroundColor: settings.primaryColor || '#4f46e5',
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
                  color: '#111827',
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
                  color: settings.primaryColor || '#4f46e5',
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
        padding: '48px 24px',
        backgroundColor: '#ffffff',
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

function createHeaderSection(block: any, settings: GlobalEmailSettings): EmailComponent {
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

function createHeadingSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const variant = block.variant || 'simple-heading';
  
  if (variant === 'multiple-headings' && block.headings && Array.isArray(block.headings)) {
    // Multiple headings variant
    const children: EmailComponent[] = block.headings.map((heading: any, index: number) => ({
      id: `heading-${index}`,
      component: 'Heading',
      props: {
        as: heading.level === 2 ? 'h2' : heading.level === 3 ? 'h3' : 'h1',
        style: {
          fontWeight: 700,
          color: '#111827',
          fontSize: heading.level === 2 ? '28px' : heading.level === 3 ? '24px' : '32px',
          lineHeight: '1.3',
          margin: index === 0 ? '0 0 16px 0' : '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: heading.text,
    }));

    return {
      id: 'heading-section',
      component: 'Section',
      props: {
        style: {
          padding: '48px 24px',
          backgroundColor: '#ffffff',
        },
      },
      children,
    };
  } else {
    // Simple heading variant
    return {
      id: 'heading-section',
      component: 'Section',
      props: {
        style: {
          padding: '48px 24px',
          backgroundColor: '#ffffff',
        },
      },
      children: [{
        id: 'heading-main',
        component: 'Heading',
        props: {
          as: 'h1',
          style: {
            fontWeight: 700,
            color: '#111827',
            fontSize: '32px',
            lineHeight: '1.3',
            margin: '0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.heading || block.text || '',
      }],
    };
  }
}

function createTextSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const children: EmailComponent[] = [];

  if (block.accentedText) {
    children.push({
      id: 'text-accented',
      component: 'Text',
      props: {
        style: {
          fontSize: '24px',
          fontWeight: 600,
          color: settings.primaryColor,
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.accentedText,
    });
  }

  children.push({
    id: 'text-content',
    component: 'Text',
    props: {
      style: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151',
        margin: '0',
        fontFamily: settings.fontFamily,
      },
      dangerouslySetInnerHTML: block.content ? { __html: parseMarkdown(block.content) } : undefined,
    },
    content: block.content && !block.content.includes('**') && !block.content.includes('*') ? block.content : undefined,
  });

  return {
    id: 'text-section',
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
        backgroundColor: '#ffffff',
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

// Placeholder functions for remaining block types (to be implemented)
function createGallerySection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'gallery-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'gallery-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Gallery section (to be implemented)',
    }],
  };
}

function createStatsSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'stats-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'stats-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Stats section (to be implemented)',
    }],
  };
}

function createPricingSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'pricing-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'pricing-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Pricing section (to be implemented)',
    }],
  };
}

function createArticleSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'article-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'article-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Article section (to be implemented)',
    }],
  };
}

function createEcommerceSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'ecommerce-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'ecommerce-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Ecommerce section (to be implemented)',
    }],
  };
}

function createMarketingSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'marketing-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'marketing-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Marketing section (to be implemented)',
    }],
  };
}

function createFeedbackSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'feedback-section',
    component: 'Section',
    props: { style: { padding: '48px 24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'feedback-placeholder',
      component: 'Text',
      props: { style: { color: '#6b7280', fontSize: '16px', fontFamily: settings.fontFamily } },
      content: 'Feedback section (to be implemented)',
    }],
  };
}

function createLinkSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'link-section',
    component: 'Section',
    props: { style: { padding: '24px', backgroundColor: '#ffffff' } },
    children: [{
      id: 'link-main',
      component: 'Link',
      props: {
        href: block.url || '#',
        style: {
          color: settings.primaryColor || '#4f46e5',
          textDecoration: 'underline',
          fontSize: '16px',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.text || block.label || 'Link',
    }],
  };
}

function createButtonsSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const buttons = block.buttons || [];
  const buttonChildren: EmailComponent[] = buttons.map((button: any, index: number) => ({
    id: `button-${index}`,
    component: 'Button',
    props: {
      href: button.url || '#',
      style: {
        backgroundColor: settings.primaryColor || '#4f46e5',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        margin: index > 0 ? '0 0 0 12px' : '0',
        fontFamily: settings.fontFamily,
      },
    },
    content: button.text || button.label || 'Button',
  }));

  return {
    id: 'buttons-section',
    component: 'Section',
    props: {
      style: {
        padding: '48px 24px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
      },
    },
    children: buttonChildren,
  };
}

function createImageSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const imageUrl = isValidImageUrl(block.imageUrl)
    ? block.imageUrl
    : getPlaceholderImage(600, 400, block.alt || 'Image');

  return {
    id: 'image-section',
    component: 'Section',
    props: {
      style: {
        padding: '24px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
      },
    },
    children: [{
      id: 'image-main',
      component: 'Img',
      props: {
        src: imageUrl,
        alt: block.alt || '',
        width: block.width || 600,
        height: block.height || 400,
        style: {
          width: '100%',
          maxWidth: `${block.width || 600}px`,
          height: 'auto',
          borderRadius: '8px',
          display: 'block',
          margin: '0 auto',
        },
      },
    }],
  };
}

function createAvatarsSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const avatars = block.avatars || [];
  const avatarChildren: EmailComponent[] = avatars.map((avatar: any, index: number) => ({
    id: `avatar-${index}`,
    component: 'Img',
    props: {
      src: avatar.imageUrl || getPlaceholderImage(48, 48, avatar.name || `avatar-${index}`),
      alt: avatar.name || '',
      width: 48,
      height: 48,
      style: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        margin: '0 4px',
        display: 'inline-block',
      },
    },
  }));

  return {
    id: 'avatars-section',
    component: 'Section',
    props: {
      style: {
        padding: '24px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
      },
    },
    children: avatarChildren,
  };
}

function createCodeSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'code-section',
    component: 'Section',
    props: {
      style: {
        padding: '24px',
        backgroundColor: '#1f2937',
      },
    },
    children: [{
      id: 'code-content',
      component: 'CodeBlock',
      props: {
        style: {
          color: '#e5e7eb',
          fontSize: '14px',
          fontFamily: 'monospace',
        },
      },
      content: block.code || '',
    }],
  };
}

function createMarkdownSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'markdown-section',
    component: 'Section',
    props: {
      style: {
        padding: '48px 24px',
        backgroundColor: '#ffffff',
      },
    },
    children: [{
      id: 'markdown-content',
      component: 'Markdown',
      props: {
        style: {
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          fontFamily: settings.fontFamily,
        },
      },
      content: block.content || '',
    }],
  };
}

function createArticlesSection(block: any, settings: GlobalEmailSettings): EmailComponent {
  const articles = block.articles || [];
  const articleChildren: EmailComponent[] = articles.map((article: any, index: number) => ({
    id: `article-item-${index}`,
    component: 'Section',
    props: {
      style: {
        marginBottom: index < articles.length - 1 ? '24px' : '0',
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
      },
    },
    children: [
      {
        id: `article-headline-${index}`,
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
        content: article.headline || '',
      },
      {
        id: `article-excerpt-${index}`,
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
        content: article.excerpt || '',
      },
    ],
  }));

  return {
    id: 'articles-section',
    component: 'Section',
    props: {
      style: {
        padding: '48px 24px',
        backgroundColor: '#ffffff',
      },
    },
    children: [
      ...(block.heading ? [{
        id: 'articles-heading',
        component: 'Heading' as const,
        props: {
          as: 'h2',
          style: {
            color: '#111827',
            fontSize: '32px',
            fontWeight: 700,
            margin: '0 0 24px 0',
            textAlign: 'center',
            fontFamily: settings.fontFamily,
          },
        },
        content: block.heading,
      } as EmailComponent] : []),
      ...articleChildren,
    ],
  };
}
