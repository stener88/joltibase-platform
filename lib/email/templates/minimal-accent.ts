/**
 * Minimal Accent Template
 * 
 * Ultra-clean aesthetic with subtle accent lines
 * Best for: Transactional emails, professional messages, B2B communications
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderMinimalAccent(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const accentColor = design.accentColor || brandColors.accentColor;
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#f9fafb';
  
  // Design system - Minimal Accent uses minimal scale for clean elegance
  const typography = getTypography(design.typographyScale || 'minimal');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'generous');

  // Build sections HTML
  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<p style="margin: 32px 0 16px; font-size: 20px; font-weight: 600; color: #111827;">${section.content || ''}</p>`;
        
        case 'text':
          return `<p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 8px;">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 20px; padding-left: 24px; font-size: 16px; color: #374151; line-height: 1.6;">${items}</ul>`;
        
        case 'divider':
          return `<hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />`;
        
        case 'spacer':
          const height = section.size === 'small' ? '16px' : section.size === 'large' ? '64px' : '40px';
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center;">
              <h2 style="margin: 0 0 16px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #111827; line-height: 1.2;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: ${typography.body}; color: #6b7280; line-height: 1.5;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #111827;">
                  ${feature.icon ? `${feature.icon} ` : ''}${feature.title}
                </p>
                <p style="margin: 0; font-size: 16px; color: #6b7280;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 24px;">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: 32px 0; padding: 24px; background-color: #f9fafb; border-left: 4px solid ${accentColor}; border-radius: 4px;">
              <p style="margin: 0 0 16px; font-size: 18px; color: #374151; font-style: italic; line-height: 1.6;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>${section.testimonial.author}</strong>${section.testimonial.role ? `, ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 32px ${spacing.elementSpacing} 0; text-align: center;">
                <p style="margin: 0 0 8px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1;">${stat.value}</p>
                <p style="margin: 0; font-size: ${typography.small}; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: 24px 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 16px; background-color: #fef2f2; border-radius: 4px; vertical-align: top;">
                  <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #dc2626; text-transform: uppercase;">Before</p>
                  <p style="margin: 0; font-size: 14px; color: #374151;">${section.comparison.before}</p>
                </td>
                <td style="width: 16px;"></td>
                <td style="width: 50%; padding: 16px; background-color: #f0fdf4; border-radius: 4px; vertical-align: top;">
                  <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #16a34a; text-transform: uppercase;">After</p>
                  <p style="margin: 0; font-size: 14px; color: #374151;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: 32px 0; text-align: center;">
              ${section.content ? `<p style="margin: 0 0 16px; font-size: 16px; color: #374151;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: ${ctaColor};">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      ${section.ctaText || 'Click Here'}
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          `;
        
        default:
          return '';
      }
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.headline}</title>
</head>
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Top Accent Line -->
          <tr>
            <td style="height: 2px; background-color: ${accentColor};"></td>
          </tr>
          
          <!-- Preheader (hidden) -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Main Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              <!-- Headline -->
              <h1 style="margin: 0 0 24px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #111827; line-height: 1.3;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: ${typography.body}; color: #6b7280; line-height: 1.5;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0;">
                <a href="${content.cta.url}" style="color: ${ctaColor}; text-decoration: none; font-size: ${typography.body}; font-weight: 600; display: inline-flex; align-items: center;">
                  ${content.cta.text} <span style="margin-left: 8px;">→</span>
                </a>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 20px 0 0;">
                <a href="${content.cta.secondary.url}" style="color: #6b7280; text-decoration: underline; font-size: 14px;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Bottom Accent Line -->
          <tr>
            <td style="height: 2px; background-color: ${accentColor};"></td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px; background-color: #f9fafb;">
              
              <!-- Company Info -->
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; text-align: center;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 16px; font-size: 13px; color: #9ca3af; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              <!-- Custom Footer Text -->
              ${content.footer?.customText ? `
              <p style="margin: 0 0 16px; font-size: 13px; color: #6b7280; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <!-- Unsubscribe -->
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #6b7280; text-decoration: underline;">Preferences</a>
              </p>
              
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return replaceMergeTags(html, mergeTags);
}
