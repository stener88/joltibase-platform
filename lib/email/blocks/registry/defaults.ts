/**
 * Block Defaults
 * 
 * Default settings and content for all block types
 */

import type { BlockType, Padding } from '../types';

const DEFAULT_PADDING: Padding = { top: 20, bottom: 20, left: 20, right: 20 };

/**
 * Get default settings for a block type
 */
export function getDefaultBlockSettings(type: BlockType, options?: { layoutVariation?: string }): any {
  switch (type) {
    case 'logo':
      return {
        align: 'center' as const,
        width: '150px',
        height: 'auto',
        backgroundColor: 'transparent',
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
      };
    
    case 'spacer':
      return {
        height: 40,
        backgroundColor: 'transparent',
      };
    
    case 'text':
      return {
        fontSize: '16px',
        fontWeight: 400,
        fontFamily: undefined, // Uses global font by default
        color: '#374151',
        align: 'left' as const,
        backgroundColor: 'transparent',
        padding: DEFAULT_PADDING,
        lineHeight: '1.6',
      };
    
    case 'image':
      return {
        align: 'center' as const,
        width: '100%',
        height: 'auto',
        borderRadius: '0px',
        padding: DEFAULT_PADDING,
        columns: 1,
        aspectRatio: 'auto' as const,
        gap: 8,
        backgroundColor: 'transparent',
      };
    
    case 'button':
      return {
        style: 'solid' as const,
        color: '#2563eb',
        textColor: '#ffffff',
        align: 'center' as const,
        size: 'medium' as const,
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 600,
        padding: { top: 14, bottom: 14, left: 32, right: 32 },
        containerPadding: { top: 20, bottom: 20, left: 20, right: 20 },
      };
    
    case 'divider':
      return {
        style: 'solid' as const,
        color: '#e5e7eb',
        thickness: 1,
        width: '100%',
        padding: { top: 32, bottom: 32, left: 20, right: 20 },
      };
    
    case 'social-links':
      return {
        align: 'center' as const,
        iconSize: '32px',
        spacing: 24,
        iconStyle: 'color' as const,
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
      };
    
    case 'layouts': {
      const variation = (options as any)?.layoutVariation;
      
      // Base settings
      const baseSettings = {
        align: 'center',
        showHeader: true,
        showTitle: true,
        showDivider: false,
        showParagraph: true,
        showButton: true,
        showImage: false,
      };
      
      // Hero layouts - Bold, spacious
      if (variation === 'hero-center') {
        return {
          ...baseSettings,
          padding: { top: 80, right: 40, bottom: 80, left: 40 },
          backgroundColor: '#ffffff',
          titleColor: '#000000',
          paragraphColor: '#374151',
          dividerColor: '#d17655',
          titleFontSize: '36px',
          paragraphFontSize: '18px',
          buttonBackgroundColor: '#000000',
          buttonTextColor: '#ffffff',
          buttonBorderRadius: '6px',
          buttonFontSize: '16px',
        };
      }
      
      // Two-column layouts - Clean, professional
      if (variation?.startsWith('two-column')) {
        return {
          ...baseSettings,
          padding: { top: 40, right: 20, bottom: 40, left: 20 },
          backgroundColor: '#ffffff',
          titleColor: '#000000',
          paragraphColor: '#374151',
          buttonBackgroundColor: '#000000',
          buttonTextColor: '#ffffff',
          buttonBorderRadius: '6px',
          buttonFontSize: '16px',
          titleFontSize: '28px',
          paragraphFontSize: '16px',
        };
      }
      
      // Stats layouts - Subtle backgrounds, accent colors
      if (variation?.startsWith('stats-')) {
        return {
          ...baseSettings,
          padding: { top: 40, right: 20, bottom: 40, left: 20 },
          backgroundColor: '#eeecea',
          titleColor: '#366460',
          paragraphColor: '#374151',
          titleFontSize: '32px',
          paragraphFontSize: '14px',
        };
      }
      
      // Image overlay - Dramatic, minimal padding
      if (variation === 'image-overlay') {
        return {
          ...baseSettings,
          padding: { top: 60, right: 40, bottom: 60, left: 40 },
          backgroundColor: 'transparent',
          titleColor: '#ffffff',
          paragraphColor: '#ffffff',
          buttonBackgroundColor: '#000000',
          buttonTextColor: '#ffffff',
          buttonBorderRadius: '6px',
          buttonFontSize: '16px',
          titleFontSize: '40px',
          paragraphFontSize: '18px',
        };
      }
      
      // Card centered - Subtle background, centered
      if (variation === 'card-centered') {
        return {
          ...baseSettings,
          padding: { top: 60, right: 40, bottom: 60, left: 40 },
          backgroundColor: '#ded9d5',
          titleColor: '#000000',
          paragraphColor: '#374151',
          buttonBackgroundColor: '#000000',
          buttonTextColor: '#ffffff',
          buttonBorderRadius: '6px',
          buttonFontSize: '16px',
          titleFontSize: '32px',
          paragraphFontSize: '16px',
        };
      }
      
      // Compact image text - Efficient, tighter spacing
      if (variation === 'compact-image-text') {
        return {
          ...baseSettings,
          padding: { top: 30, right: 20, bottom: 30, left: 20 },
          backgroundColor: '#ffffff',
          align: 'left',
          titleColor: '#000000',
          paragraphColor: '#374151',
          titleFontSize: '20px',
          paragraphFontSize: '14px',
        };
      }
      
      // Magazine feature - Editorial style
      if (variation === 'magazine-feature') {
        return {
          ...baseSettings,
          padding: { top: 40, right: 20, bottom: 40, left: 20 },
          backgroundColor: '#ffffff',
          align: 'left',
          titleColor: '#000000',
          paragraphColor: '#374151',
          titleFontSize: '28px',
          paragraphFontSize: '16px',
        };
      }
      
      // Default generic settings for unknown variations
      return {
        ...baseSettings,
        padding: { top: 40, right: 20, bottom: 40, left: 20 },
        backgroundColor: 'transparent',
      };
    }
    
    case 'footer':
      return {
        backgroundColor: '#f9fafb',
        textColor: '#6b7280',
        fontSize: '12px',
        align: 'center' as const,
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        lineHeight: '1.6',
        linkColor: '#2563eb',
      };
    
    case 'link-bar':
      return {
        align: 'center' as const,
        orientation: 'horizontal' as const,
        padding: DEFAULT_PADDING,
        spacing: 16,
        fontSize: '14px',
        textColor: '#374151',
        linkColor: '#2563eb',
        backgroundColor: 'transparent',
      };
    
    case 'address':
      return {
        align: 'center' as const,
        padding: DEFAULT_PADDING,
        fontSize: '12px',
        textColor: '#6b7280',
        lineHeight: '1.6',
        backgroundColor: 'transparent',
      };
    
    default:
      return {};
  }
}

/**
 * Get default content for a block type
 */
export function getDefaultBlockContent(type: BlockType, options?: { layoutVariation?: string }): any {
  switch (type) {
    case 'logo':
      return {
        imageUrl: '',
        altText: 'Company Logo',
      };
    
    case 'spacer':
      return {};
    
    case 'text':
      return {
        text: 'Your text content goes here. Edit this to add your message.',
      };
    
    case 'image':
      return {
        images: [
          {
            url: '',
            altText: 'Image',
            linkUrl: '',
          },
        ],
      };
    
    case 'button':
      return {
        text: 'Click Here',
        url: '{{cta_url}}',
      };
    
    case 'divider':
      return {};
    
    case 'social-links':
      return {
        links: [
          { platform: 'twitter' as const, url: 'https://twitter.com/yourcompany' },
          { platform: 'linkedin' as const, url: 'https://linkedin.com/company/yourcompany' },
          { platform: 'facebook' as const, url: 'https://facebook.com/yourcompany' },
        ],
      };
    
    case 'layouts': {
      const variation = (options as any)?.layoutVariation;
      
      if (variation === 'hero-center') {
        return {
          header: 'Introducing',
          title: 'Your Headline Here',
          paragraph: 'Add your description text here.',
          button: { text: 'Get Started', url: '#' },
        };
      }
      
      if (variation === 'two-column-50-50' || variation === 'two-column-60-40' || variation === 'two-column-40-60' || variation === 'two-column-70-30' || variation === 'two-column-30-70') {
        return {
          title: 'Feature Title',
          paragraph: 'Feature description goes here. Explain the benefits and value proposition in a clear, compelling way.',
          button: { text: 'Learn More', url: '#' },
          image: { url: '', altText: 'Feature image' },
        };
      }
      
      if (variation === 'two-column-text') {
        return {
          leftColumn: 'This is the left column. You can use this layout to present information side-by-side, perfect for comparisons or parallel content streams.',
          rightColumn: 'This is the right column. Both columns will display at equal width, creating a balanced and professional appearance in your email.',
        };
      }
      
      if (variation === 'image-overlay') {
        return {
          badge: 'NEW',
          title: 'Stunning Visual Impact',
          paragraph: 'Create dramatic presentations with full-width imagery and overlaid text.',
          button: { text: 'Explore Now', url: '#' },
          image: { url: '', altText: 'Background image' },
        };
      }
      
      if (variation === 'card-centered') {
        return {
          title: 'Centered Message',
          paragraph: 'Perfect for announcements, special offers, or any message that deserves spotlight attention.',
          button: { text: 'Take Action', url: '#' },
        };
      }
      
      if (variation === 'compact-image-text') {
        return {
          image: { url: '', altText: 'Compact image' },
          title: 'Compact Layout',
          subtitle: 'Quick highlights',
          paragraph: 'Efficient side-by-side presentation with a small image and focused text content.',
        };
      }
      
      if (variation === 'magazine-feature') {
        return {
          badge: 'FEATURED',
          image: { url: '', altText: 'Feature image' },
          title: 'Editorial Style Presentation',
          paragraph: 'Create magazine-quality layouts that combine compelling imagery with engaging editorial content for maximum reader engagement.',
        };
      }
      
      if (variation === 'stats-2-col') {
        return {
          items: [
            { value: '10K+', title: 'Users', description: 'Active monthly users' },
            { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
          ],
        };
      }
      
      if (variation === 'stats-3-col') {
        return {
          items: [
            { value: '10K+', title: 'Users', description: 'Active monthly users' },
            { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
            { value: '24/7', title: 'Support', description: 'Always here to help' },
          ],
        };
      }
      
      if (variation === 'stats-4-col') {
        return {
          items: [
            { value: '10K+', title: 'Users', description: 'Active monthly users' },
            { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
            { value: '24/7', title: 'Support', description: 'Always here to help' },
            { value: '<1s', title: 'Response', description: 'Lightning fast' },
          ],
        };
      }
      
      // Default content for unknown variations
      return {
        title: 'Layout Title',
        paragraph: 'Add your content here.',
      };
    }
    
    case 'footer':
      return {
        companyName: '{{company_name}}',
        companyAddress: '123 Main St, City, State 12345',
        customText: 'Questions? Just reply to this email.',
        unsubscribeUrl: '{{unsubscribe_url}}',
        preferencesUrl: '{{preferences_url}}',
      };
    
    case 'link-bar':
      return {
        links: [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#' },
          { text: 'Contact', url: '#' },
        ],
      };
    
    case 'address':
      return {
        companyName: '{{company_name}}',
        street: '123 Main Street',
        city: 'City',
        state: 'State',
        zip: '12345',
        country: 'Country',
      };
    
    default:
      return {};
  }
}

