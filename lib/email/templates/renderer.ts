/**
 * Email Template Renderer
 * 
 * Orchestrates all email templates, routes to the correct one,
 * applies brand colors, replaces merge tags, and generates plain text versions
 */

import type { TemplateRenderInput, RenderedEmail, EmailContent, MergeTags } from './types';
import { renderTextFirst } from './text-first';
import { renderMinimalAccent } from './minimal-accent';
import { renderColorBlocks } from './color-blocks';
import { renderGradientHero } from './gradient-hero';
import { renderBoldModern } from './bold-modern';

/**
 * Main render function - routes to appropriate template
 */
export function renderEmail(input: TemplateRenderInput): RenderedEmail {
  // Route to the correct template
  let html: string;
  
  switch (input.template) {
    case 'text-first':
      html = renderTextFirst(input);
      break;
    
    case 'minimal-accent':
      html = renderMinimalAccent(input);
      break;
    
    case 'color-blocks':
      html = renderColorBlocks(input);
      break;
    
    case 'gradient-hero':
      html = renderGradientHero(input);
      break;
    
    case 'bold-modern':
      html = renderBoldModern(input);
      break;
    
    default:
      // Default to text-first if unknown template
      html = renderTextFirst(input);
  }
  
  // Generate plain text version
  const plainText = generatePlainText(input.content, input.mergeTags);
  
  // Extract preview text (first 100 chars of preheader or first section)
  const previewText = input.content.preheader || 
                      input.content.subheadline || 
                      input.content.sections[0]?.content?.substring(0, 100) ||
                      '';
  
  // Generate subject line from headline (truncate if too long)
  const subject = input.content.headline.substring(0, 100);
  
  return {
    html,
    plainText,
    previewText,
    subject,
  };
}

/**
 * Generate plain text version of email
 */
export function generatePlainText(content: EmailContent, mergeTags?: MergeTags): string {
  const lines: string[] = [];
  
  // Headline
  lines.push(content.headline);
  lines.push('='.repeat(content.headline.length));
  lines.push('');
  
  // Subheadline
  if (content.subheadline) {
    lines.push(content.subheadline);
    lines.push('');
  }
  
  // Body sections
  content.sections.forEach((section) => {
    switch (section.type) {
      case 'heading':
        lines.push('');
        lines.push(section.content || '');
        lines.push('-'.repeat((section.content || '').length));
        lines.push('');
        break;
      
      case 'text':
        lines.push(section.content || '');
        lines.push('');
        break;
      
      case 'list':
        (section.items || []).forEach(item => {
          lines.push(`• ${item}`);
        });
        lines.push('');
        break;
      
      case 'divider':
        lines.push('---');
        lines.push('');
        break;
      
      case 'spacer':
        lines.push('');
        break;
      
      case 'hero':
        lines.push('');
        lines.push(section.headline || '');
        lines.push('='.repeat((section.headline || '').length));
        if (section.subheadline) {
          lines.push(section.subheadline);
        }
        lines.push('');
        break;
      
      case 'feature-grid':
        lines.push('');
        (section.features || []).forEach(feature => {
          lines.push(`${feature.icon || '▸'} ${feature.title}`);
          lines.push(`  ${feature.description}`);
          lines.push('');
        });
        break;
      
      case 'testimonial':
        if (section.testimonial) {
          lines.push('');
          lines.push(`"${section.testimonial.quote}"`);
          lines.push(`— ${section.testimonial.author}${section.testimonial.role ? `, ${section.testimonial.role}` : ''}`);
          lines.push('');
        }
        break;
      
      case 'stats':
        lines.push('');
        (section.stats || []).forEach(stat => {
          lines.push(`${stat.value} — ${stat.label}`);
        });
        lines.push('');
        break;
      
      case 'comparison':
        if (section.comparison) {
          lines.push('');
          lines.push(`Before: ${section.comparison.before}`);
          lines.push(`After:  ${section.comparison.after}`);
          lines.push('');
        }
        break;
      
      case 'cta-block':
        lines.push('');
        if (section.content) {
          lines.push(section.content);
        }
        lines.push(`→ ${section.ctaText || 'Click Here'}`);
        lines.push(section.ctaUrl || '{{cta_url}}');
        lines.push('');
        break;
    }
  });
  
  // CTA
  lines.push('');
  lines.push(`→ ${content.cta.text}`);
  lines.push(content.cta.url);
  lines.push('');
  
  // Secondary CTA
  if (content.cta.secondary) {
    lines.push(`${content.cta.secondary.text}: ${content.cta.secondary.url}`);
    lines.push('');
  }
  
  // Footer
  lines.push('---');
  lines.push('');
  
  if (content.footer?.companyName) {
    lines.push(content.footer.companyName);
  }
  
  if (content.footer?.companyAddress) {
    lines.push(content.footer.companyAddress);
  }
  
  if (content.footer?.customText) {
    lines.push('');
    lines.push(content.footer.customText);
  }
  
  lines.push('');
  lines.push('Unsubscribe: {{unsubscribe_url}}');
  lines.push('Preferences: {{preferences_url}}');
  
  // Join lines and replace merge tags
  let plainText = lines.join('\n');
  
  if (mergeTags) {
    Object.entries(mergeTags).forEach(([key, value]) => {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      plainText = plainText.replace(pattern, value || '');
    });
  }
  
  return plainText;
}

/**
 * Quick helper to render from AI-generated content
 * Converts AI output format to template input format
 */
export function renderFromAIGeneration(aiEmail: {
  subject: string;
  previewText: string;
  htmlBody: string; // This will be ignored - we generate from structured content
  plainTextBody: string; // This will be ignored
  ctaText: string;
  ctaUrl: string;
}, design: {
  template: string;
  headerGradient?: { from: string; to: string; direction?: 'to-right' | 'to-bottom' | 'to-br' | 'to-tr' };
  ctaColor: string;
  accentColor?: string;
}, brandColors: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontStyle?: 'modern' | 'classic' | 'playful';
}, mergeTags?: Record<string, string>): RenderedEmail {
  
  // Parse the htmlBody to extract structured content
  // For now, create a simple structure
  // In production, you'd parse the AI-generated HTML more intelligently
  
  const content: EmailContent = {
    headline: aiEmail.subject,
    preheader: aiEmail.previewText,
    sections: [
      {
        type: 'text',
        content: aiEmail.htmlBody || aiEmail.plainTextBody,
      }
    ],
    cta: {
      text: aiEmail.ctaText,
      url: aiEmail.ctaUrl,
    },
    footer: {
      companyName: mergeTags?.company_name || '{{company_name}}',
    }
  };
  
  const input: TemplateRenderInput = {
    template: design.template as any,
    design: {
      template: design.template as any,
      headerGradient: design.headerGradient,
      ctaColor: design.ctaColor,
      accentColor: design.accentColor,
    },
    content,
    brandColors,
    mergeTags,
  };
  
  return renderEmail(input);
}

/**
 * Test helper - generate a sample email for preview
 */
export function generateSampleEmail(template: string = 'gradient-hero'): RenderedEmail {
  const input: TemplateRenderInput = {
    template: template as any,
    design: {
      template: template as any,
      headerGradient: {
        from: '#2563eb',
        to: '#3b82f6',
        direction: 'to-br',
      },
      ctaColor: '#2563eb',
      accentColor: '#f59e0b',
    },
    content: {
      headline: 'Welcome to Our Platform!',
      preheader: 'Get started with your free trial today',
      subheadline: 'We\'re excited to have you here. Let\'s get you set up!',
      sections: [
        {
          type: 'text',
          content: 'Thanks for signing up! Your account is ready and we can\'t wait to see what you\'ll build.',
        },
        {
          type: 'text',
          content: 'Here\'s what you can do right now:',
        },
        {
          type: 'list',
          items: [
            'Complete your profile',
            'Invite your team members',
            'Explore our features',
            'Check out the tutorial',
          ],
        },
      ],
      cta: {
        text: 'Get Started',
        url: '{{cta_url}}',
      },
      footer: {
        companyName: '{{company_name}}',
        customText: 'Questions? Just reply to this email!',
      },
    },
    brandColors: {
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      fontStyle: 'modern',
    },
    mergeTags: {
      first_name: 'Alex',
      company_name: 'Acme Inc',
      cta_url: 'https://app.example.com/dashboard',
      unsubscribe_url: 'https://app.example.com/unsubscribe',
      preferences_url: 'https://app.example.com/preferences',
    },
  };
  
  return renderEmail(input);
}
