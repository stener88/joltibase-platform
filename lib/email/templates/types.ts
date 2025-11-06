/**
 * Email Template System - Type Definitions
 * 
 * Defines interfaces for our 5 email templates:
 * 1. Gradient Hero
 * 2. Color Blocks
 * 3. Bold Modern
 * 4. Minimal Accent
 * 5. Text First
 */

// ============================================================================
// Core Template Types
// ============================================================================

export type TemplateType =
  | 'gradient-hero'
  | 'color-blocks'
  | 'bold-modern'
  | 'minimal-accent'
  | 'text-first';

/**
 * Design configuration that AI generates
 */
export interface DesignConfig {
  template: TemplateType;
  headerGradient?: {
    from: string; // hex color
    to: string;   // hex color
    direction?: 'to-right' | 'to-bottom' | 'to-br' | 'to-tr'; // default: to-br
  };
  ctaColor: string;      // Primary CTA button color
  accentColor?: string;  // Secondary accent color
  backgroundColor?: string; // Email body background (default: #f3f4f6)
}

/**
 * Brand colors from brand_kits table
 */
export interface BrandColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontStyle?: 'modern' | 'classic' | 'playful';
}

/**
 * Merge tags that can be used in email content
 */
export interface MergeTags {
  first_name?: string;
  last_name?: string;
  email?: string;
  company_name?: string;
  cta_url?: string;
  unsubscribe_url?: string;
  preferences_url?: string;
  [key: string]: string | undefined; // Allow custom merge tags
}

// ============================================================================
// Email Content Structure
// ============================================================================

/**
 * Content blocks that make up an email
 */
export interface EmailContent {
  // Header section
  preheader?: string;           // Preview text (50-100 chars)
  headline: string;             // Main headline (H1)
  subheadline?: string;         // Supporting text under headline
  
  // Body sections
  sections: ContentSection[];
  
  // Call to Action
  cta: {
    text: string;               // Button text
    url: string;                // Button URL (can include merge tags)
    secondary?: {               // Optional secondary CTA
      text: string;
      url: string;
    };
  };
  
  // Footer
  footer?: {
    companyName: string;
    companyAddress?: string;
    socialLinks?: SocialLink[];
    customText?: string;        // Custom footer text
  };
}

export interface ContentSection {
  type: 'text' | 'heading' | 'list' | 'divider' | 'spacer';
  content?: string;             // For text/heading
  items?: string[];             // For lists
  size?: 'small' | 'medium' | 'large'; // For spacers
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  url: string;
}

// ============================================================================
// Template Rendering Input
// ============================================================================

/**
 * Everything needed to render a complete email
 */
export interface TemplateRenderInput {
  template: TemplateType;
  design: DesignConfig;
  content: EmailContent;
  brandColors: BrandColors;
  mergeTags?: MergeTags;        // For preview/testing
}

/**
 * Output from template rendering
 */
export interface RenderedEmail {
  html: string;                 // Complete HTML email
  plainText: string;            // Plain text version
  previewText: string;          // For email client preview
  subject: string;              // Email subject line
}

// ============================================================================
// Template-Specific Configurations
// ============================================================================

/**
 * Gradient Hero Template Config
 * Use for: Welcome emails, product launches, announcements
 */
export interface GradientHeroConfig {
  gradientDirection: 'diagonal' | 'vertical' | 'horizontal';
  headlineSize: 'large' | 'xlarge';
  buttonStyle: 'solid' | 'outlined';
}

/**
 * Color Blocks Template Config
 * Use for: Updates, newsletters, feature announcements
 */
export interface ColorBlocksConfig {
  sidebarPosition: 'left' | 'right';
  sidebarWidth: 4 | 8 | 12; // in pixels
  dividerStyle: 'solid' | 'dashed' | 'none';
}

/**
 * Bold Modern Template Config
 * Use for: Promotions, urgent messages, sales
 */
export interface BoldModernConfig {
  headlineSize: 'xlarge' | 'xxlarge';
  contrastMode: 'high' | 'ultra';
  ctaStyle: 'underline' | 'solid';
}

/**
 * Minimal Accent Template Config
 * Use for: Transactional, professional, B2B
 */
export interface MinimalAccentConfig {
  accentLinePosition: 'top' | 'bottom' | 'both';
  accentLineThickness: 1 | 2 | 3; // in pixels
  whiteSpace: 'normal' | 'generous' | 'ultra';
}

/**
 * Text First Template Config
 * Use for: Newsletters, content, personal messages
 */
export interface TextFirstConfig {
  lineHeight: 1.5 | 1.6 | 1.8;
  paragraphSpacing: 'normal' | 'relaxed';
  ctaStyle: 'text-link' | 'button-link';
}

// ============================================================================
// Email Client Compatibility
// ============================================================================

/**
 * Email client compatibility settings
 */
export interface CompatibilitySettings {
  inlineCSS: boolean;           // Always true for email
  useTableLayout: boolean;      // Always true for email
  maxWidth: number;             // Default: 600px
  safeFonts: string[];          // Default: Arial, Helvetica, sans-serif
  supportDarkMode: boolean;     // Default: true
  mobileOptimized: boolean;     // Default: true
}

/**
 * Default compatibility settings for all templates
 */
export const DEFAULT_COMPATIBILITY: CompatibilitySettings = {
  inlineCSS: true,
  useTableLayout: true,
  maxWidth: 600,
  safeFonts: ['Arial', 'Helvetica', 'sans-serif'],
  supportDarkMode: true,
  mobileOptimized: true,
};

// ============================================================================
// Validation & Helpers
// ============================================================================

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Get safe font stack for email
 */
export function getFontStack(style?: 'modern' | 'classic' | 'playful'): string {
  switch (style) {
    case 'modern':
      return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    case 'classic':
      return 'Georgia, "Times New Roman", Times, serif';
    case 'playful':
      return '"Comic Sans MS", "Marker Felt", "Arial Rounded MT Bold", Arial, sans-serif';
    default:
      return 'Arial, Helvetica, sans-serif';
  }
}

/**
 * Convert gradient direction to CSS
 */
export function gradientDirectionToCSS(direction?: string): string {
  switch (direction) {
    case 'to-right':
      return 'linear-gradient(to right, {{from}}, {{to}})';
    case 'to-bottom':
      return 'linear-gradient(to bottom, {{from}}, {{to}})';
    case 'to-tr':
      return 'linear-gradient(to top right, {{from}}, {{to}})';
    case 'to-br':
    default:
      return 'linear-gradient(135deg, {{from}}, {{to}})';
  }
}

/**
 * Replace merge tags in content
 */
export function replaceMergeTags(content: string, mergeTags?: MergeTags): string {
  if (!mergeTags) return content;
  
  let result = content;
  Object.entries(mergeTags).forEach(([key, value]) => {
    const pattern = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(pattern, value || '');
  });
  
  return result;
}

/**
 * Generate contrast text color (white or black) based on background
 */
export function getContrastTextColor(backgroundColor: string): string {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark backgrounds, black for light
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Ensure minimum contrast ratio for accessibility (WCAG AA)
 */
export function ensureAccessibleContrast(
  textColor: string,
  backgroundColor: string
): string {
  // Simplified: returns white or black based on background
  // In production, you'd calculate actual contrast ratio
  return getContrastTextColor(backgroundColor);
}