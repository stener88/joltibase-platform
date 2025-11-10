/**
 * Pre-Built Block Templates
 * 
 * Proven block patterns and sequences that AI can reference
 * for generating optimal email campaigns.
 */

import type { EmailBlock } from '../../email/blocks/types';

// ============================================================================
// Block Template Type
// ============================================================================

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: 'product-launch' | 'newsletter' | 'promo' | 'welcome' | 'announcement';
  blocks: EmailBlock[];
  useCases: string[];
  conversionRate?: string;
}

// ============================================================================
// Product Launch Templates
// ============================================================================

export const PRODUCT_LAUNCH_PREMIUM: BlockTemplate = {
  id: 'product-launch-premium',
  name: 'Premium Product Launch',
  description: 'High-impact launch with premium typography and generous spacing',
  category: 'product-launch',
  useCases: ['Major product releases', 'Funding announcements', 'Big milestones'],
  conversionRate: '8-12%',
  blocks: [
    {
      type: 'spacer',
      settings: { height: 40, backgroundColor: '#ffffff' },
      position: 0,
    },
    {
      type: 'logo',
      content: { src: '{{logo_url}}', alt: 'Company Logo' },
      settings: {
        align: 'center',
        width: '150px',
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
        backgroundColor: '#ffffff',
      },
      position: 1,
    },
    {
      type: 'spacer',
      settings: { height: 40, backgroundColor: '#ffffff' },
      position: 2,
    },
    {
      type: 'hero',
      content: {
        headline: 'Introducing [Product Name]',
        subheadline: 'The future of [category] is here',
      },
      settings: {
        padding: { top: 80, bottom: 80, left: 40, right: 40 },
        align: 'center',
        backgroundColor: '#f9fafb',
        headlineFontSize: '70px',
        headlineFontWeight: 900,
        headlineColor: '#111827',
        subheadlineFontSize: '18px',
        subheadlineColor: '#6b7280',
      },
      position: 3,
    },
    {
      type: 'text',
      content: {
        text: 'After [time] of development, we\'re thrilled to share [key value proposition].',
      },
      settings: {
        fontSize: '18px',
        fontWeight: 400,
        color: '#374151',
        align: 'center',
        lineHeight: 1.6,
        padding: { top: 40, bottom: 40, left: 40, right: 40 },
      },
      position: 4,
    },
    {
      type: 'stats',
      content: {
        stats: [
          { value: '10,000+', label: 'Beta Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '2x', label: 'Faster' },
        ],
      },
      settings: {
        padding: { top: 60, bottom: 60, left: 20, right: 20 },
        valueFontSize: '100px',
        valueFontWeight: 900,
        valueColor: '#111827',
        labelFontSize: '14px',
        labelColor: '#6b7280',
        spacing: 40,
      },
      position: 5,
    },
    {
      type: 'featuregrid',
      content: {
        features: [
          { icon: '🚀', title: 'Lightning Fast', description: '10x faster than competitors' },
          { icon: '🎨', title: 'Beautiful Design', description: 'Gorgeous out of the box' },
          { icon: '🔒', title: 'Enterprise Security', description: 'Bank-level encryption' },
        ],
      },
      settings: {
        columns: 3,
        padding: { top: 60, bottom: 60, left: 20, right: 20 },
        titleFontSize: '20px',
        titleColor: '#111827',
        descriptionFontSize: '14px',
        descriptionColor: '#6b7280',
        spacing: 32,
      },
      position: 6,
    },
    {
      type: 'testimonial',
      content: {
        quote: 'This is exactly what we\'ve been waiting for. Game changer!',
        author: 'Sarah Johnson',
        role: 'CEO, TechCorp',
      },
      settings: {
        padding: { top: 60, bottom: 60, left: 40, right: 40 },
        backgroundColor: '#f9fafb',
        quoteFontSize: '18px',
        quoteColor: '#111827',
        authorFontSize: '14px',
        authorColor: '#6b7280',
      },
      position: 7,
    },
    {
      type: 'button',
      content: { text: 'Get Early Access', url: '{{cta_url}}' },
      settings: {
        style: 'solid',
        color: '#2563eb',
        textColor: '#ffffff',
        align: 'center',
        size: 'large',
        borderRadius: '6px',
        padding: { top: 16, bottom: 16, left: 40, right: 40 },
      },
      position: 8,
    },
    {
      type: 'divider',
      settings: {
        color: '#e5e7eb',
        width: '100%',
        height: 1,
        style: 'solid',
        padding: { top: 60, bottom: 60, left: 20, right: 20 },
      },
      position: 9,
    },
    {
      type: 'footer',
      content: {
        companyName: '{{company_name}}',
        address: '{{company_address}}',
        unsubscribeUrl: '{{unsubscribe_url}}',
      },
      settings: {
        fontSize: '12px',
        color: '#9ca3af',
        align: 'center',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        backgroundColor: '#f3f4f6',
      },
      position: 10,
    },
  ],
};

// ============================================================================
// Newsletter Templates
// ============================================================================

export const NEWSLETTER_STANDARD: BlockTemplate = {
  id: 'newsletter-standard',
  name: 'Standard Newsletter',
  description: 'Clean multi-section layout for regular updates',
  category: 'newsletter',
  useCases: ['Weekly updates', 'Monthly digests', 'Company news'],
  conversionRate: '3-5%',
  blocks: [
    {
      type: 'spacer',
      settings: { height: 40, backgroundColor: '#ffffff' },
      position: 0,
    },
    {
      type: 'heading',
      content: { text: 'This Week\'s Highlights' },
      settings: {
        fontSize: '56px',
        fontWeight: 800,
        color: '#111827',
        align: 'center',
        padding: { top: 20, bottom: 20, left: 40, right: 40 },
      },
      position: 1,
    },
    {
      type: 'text',
      content: { text: 'Here\'s what\'s new in [product/company] this week.' },
      settings: {
        fontSize: '16px',
        fontWeight: 400,
        color: '#6b7280',
        align: 'center',
        lineHeight: 1.6,
        padding: { top: 10, bottom: 40, left: 40, right: 40 },
      },
      position: 2,
    },
    {
      type: 'divider',
      settings: {
        color: '#e5e7eb',
        width: '100%',
        height: 1,
        style: 'solid',
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
      },
      position: 3,
    },
    {
      type: 'heading',
      content: { text: '📰 Feature Update' },
      settings: {
        fontSize: '44px',
        fontWeight: 700,
        color: '#111827',
        align: 'left',
        padding: { top: 20, bottom: 10, left: 20, right: 20 },
      },
      position: 4,
    },
    {
      type: 'text',
      content: { text: 'We just shipped [feature name]. Here\'s what it does and why you\'ll love it.' },
      settings: {
        fontSize: '16px',
        fontWeight: 400,
        color: '#374151',
        align: 'left',
        lineHeight: 1.6,
        padding: { top: 10, bottom: 20, left: 20, right: 20 },
      },
      position: 5,
    },
    {
      type: 'button',
      content: { text: 'Try It Now', url: '{{cta_url}}' },
      settings: {
        style: 'solid',
        color: '#2563eb',
        textColor: '#ffffff',
        align: 'left',
        size: 'medium',
        borderRadius: '6px',
        padding: { top: 12, bottom: 12, left: 24, right: 24 },
      },
      position: 6,
    },
    {
      type: 'divider',
      settings: {
        color: '#e5e7eb',
        width: '100%',
        height: 1,
        style: 'solid',
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
      },
      position: 7,
    },
    {
      type: 'footer',
      content: {
        companyName: '{{company_name}}',
        address: '{{company_address}}',
        unsubscribeUrl: '{{unsubscribe_url}}',
      },
      settings: {
        fontSize: '12px',
        color: '#9ca3af',
        align: 'center',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        backgroundColor: '#f3f4f6',
      },
      position: 8,
    },
  ],
};

// ============================================================================
// Promotional Templates
// ============================================================================

export const PROMO_URGENCY: BlockTemplate = {
  id: 'promo-urgency',
  name: 'High-Urgency Promo',
  description: 'Bold promotional email with urgency and social proof',
  category: 'promo',
  useCases: ['Limited-time offers', 'Flash sales', 'Discount campaigns'],
  conversionRate: '10-15%',
  blocks: [
    {
      type: 'spacer',
      settings: { height: 40, backgroundColor: '#ffffff' },
      position: 0,
    },
    {
      type: 'hero',
      content: {
        headline: '🔥 Flash Sale: 50% Off',
        subheadline: 'Expires in 24 hours. Don\'t miss out!',
      },
      settings: {
        padding: { top: 60, bottom: 60, left: 40, right: 40 },
        align: 'center',
        backgroundColor: '#fef2f2',
        headlineFontSize: '70px',
        headlineFontWeight: 900,
        headlineColor: '#dc2626',
        subheadlineFontSize: '18px',
        subheadlineColor: '#991b1b',
      },
      position: 1,
    },
    {
      type: 'comparison',
      content: {
        before: {
          label: 'REGULAR PRICE',
          text: '$199/month - Complex setup, limited features',
        },
        after: {
          label: 'TODAY ONLY',
          text: '$99/month - Full access, priority support',
        },
      },
      settings: {
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        spacing: 16,
        beforeColor: '#fef2f2',
        afterColor: '#f0fdf4',
        labelColor: '#dc2626',
        labelColorAfter: '#16a34a',
      },
      position: 2,
    },
    {
      type: 'stats',
      content: {
        stats: [
          { value: '5,000+', label: 'Happy Customers' },
          { value: '4.9/5', label: 'Rating' },
        ],
      },
      settings: {
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        valueFontSize: '80px',
        valueFontWeight: 900,
        valueColor: '#111827',
        labelFontSize: '14px',
        labelColor: '#6b7280',
        spacing: 40,
      },
      position: 3,
    },
    {
      type: 'button',
      content: { text: 'Claim 50% Off Now', url: '{{cta_url}}' },
      settings: {
        style: 'solid',
        color: '#dc2626',
        textColor: '#ffffff',
        align: 'center',
        size: 'large',
        borderRadius: '6px',
        padding: { top: 16, bottom: 16, left: 40, right: 40 },
      },
      position: 4,
    },
    {
      type: 'text',
      content: { text: '⏰ Offer expires in 24 hours. No code needed!' },
      settings: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#dc2626',
        align: 'center',
        lineHeight: 1.6,
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
      },
      position: 5,
    },
    {
      type: 'footer',
      content: {
        companyName: '{{company_name}}',
        address: '{{company_address}}',
        unsubscribeUrl: '{{unsubscribe_url}}',
      },
      settings: {
        fontSize: '12px',
        color: '#9ca3af',
        align: 'center',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        backgroundColor: '#f3f4f6',
      },
      position: 6,
    },
  ],
};

// ============================================================================
// Welcome Templates
// ============================================================================

export const WELCOME_ONBOARDING: BlockTemplate = {
  id: 'welcome-onboarding',
  name: 'Welcome & Onboarding',
  description: 'Friendly welcome with clear next steps',
  category: 'welcome',
  useCases: ['New signups', 'Trial starts', 'First purchase'],
  conversionRate: '15-20%',
  blocks: [
    {
      type: 'spacer',
      settings: { height: 40, backgroundColor: '#ffffff' },
      position: 0,
    },
    {
      type: 'logo',
      content: { src: '{{logo_url}}', alt: 'Company Logo' },
      settings: {
        align: 'center',
        width: '150px',
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
        backgroundColor: '#ffffff',
      },
      position: 1,
    },
    {
      type: 'spacer',
      settings: { height: 40, backgroundColor: '#ffffff' },
      position: 2,
    },
    {
      type: 'hero',
      content: {
        headline: 'Welcome to [Product]! 👋',
        subheadline: 'We\'re excited to have you here. Let\'s get started!',
      },
      settings: {
        padding: { top: 60, bottom: 60, left: 40, right: 40 },
        align: 'center',
        backgroundColor: '#f9fafb',
        headlineFontSize: '56px',
        headlineFontWeight: 800,
        headlineColor: '#111827',
        subheadlineFontSize: '18px',
        subheadlineColor: '#6b7280',
      },
      position: 3,
    },
    {
      type: 'text',
      content: { text: 'Your account is all set up. Here are three quick steps to get the most out of [Product]:' },
      settings: {
        fontSize: '16px',
        fontWeight: 400,
        color: '#374151',
        align: 'left',
        lineHeight: 1.6,
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
      },
      position: 4,
    },
    {
      type: 'featuregrid',
      content: {
        features: [
          { icon: '1️⃣', title: 'Complete Your Profile', description: 'Add your details to personalize your experience' },
          { icon: '2️⃣', title: 'Invite Your Team', description: 'Collaborate with teammates and share access' },
          { icon: '3️⃣', title: 'Create Your First Project', description: 'Get started with our guided setup wizard' },
        ],
      },
      settings: {
        columns: 3,
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        titleFontSize: '18px',
        titleColor: '#111827',
        descriptionFontSize: '14px',
        descriptionColor: '#6b7280',
        spacing: 32,
      },
      position: 5,
    },
    {
      type: 'button',
      content: { text: 'Get Started', url: '{{cta_url}}' },
      settings: {
        style: 'solid',
        color: '#2563eb',
        textColor: '#ffffff',
        align: 'center',
        size: 'large',
        borderRadius: '6px',
        padding: { top: 14, bottom: 14, left: 32, right: 32 },
      },
      position: 6,
    },
    {
      type: 'divider',
      settings: {
        color: '#e5e7eb',
        width: '100%',
        height: 1,
        style: 'solid',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
      },
      position: 7,
    },
    {
      type: 'text',
      content: { text: 'Need help? Our support team is here 24/7. Just reply to this email or visit our help center.' },
      settings: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#6b7280',
        align: 'center',
        lineHeight: 1.6,
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
      },
      position: 8,
    },
    {
      type: 'footer',
      content: {
        companyName: '{{company_name}}',
        address: '{{company_address}}',
        unsubscribeUrl: '{{unsubscribe_url}}',
      },
      settings: {
        fontSize: '12px',
        color: '#9ca3af',
        align: 'center',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        backgroundColor: '#f3f4f6',
      },
      position: 9,
    },
  ],
};

// ============================================================================
// Template Registry
// ============================================================================

export const BLOCK_TEMPLATES: Record<string, BlockTemplate> = {
  'product-launch-premium': PRODUCT_LAUNCH_PREMIUM,
  'newsletter-standard': NEWSLETTER_STANDARD,
  'promo-urgency': PROMO_URGENCY,
  'welcome-onboarding': WELCOME_ONBOARDING,
};

/**
 * Get all block templates
 */
export function getAllBlockTemplates(): BlockTemplate[] {
  return Object.values(BLOCK_TEMPLATES);
}

/**
 * Get block template by ID
 */
export function getBlockTemplate(id: string): BlockTemplate | undefined {
  return BLOCK_TEMPLATES[id];
}

/**
 * Get block templates by category
 */
export function getBlockTemplatesByCategory(
  category: BlockTemplate['category']
): BlockTemplate[] {
  return getAllBlockTemplates().filter((template) => template.category === category);
}

