/**
 * Feature Showcase Template
 * 
 * Grid layouts optimized for product features
 * Best for: Product updates, feature announcements, capability highlights
 * 
 * Design Philosophy:
 * - Grid-based feature presentation
 * - Icon/emoji-friendly design
 * - Scannable, organized layout
 * - Product-focused aesthetic
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderFeatureShowcase(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const accentColor = design.accentColor || brandColors.accentColor;
  const backgroundColor = design.backgroundColor || '#f7f8fa';
  
  // Feature Showcase uses standard scale for professional balance
  const typography = getTypography(design.typographyScale || 'standard');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'standard');

  // Build sections HTML with grid-focused styling
  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h3}; font-weight: 700; color: #1a202c; line-height: 1.3; text-align: center;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: ${typography.body}; color: #4a5568; line-height: 1.6; text-align: center;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 12px;">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 ${spacing.paragraphSpacing}; padding-left: 24px; font-size: ${typography.body}; color: #4a5568; line-height: 1.6;">${items}</ul>`;
        
        case 'divider':
          return `<hr style="margin: ${spacing.sectionSpacing} 0; border: none; border-top: 2px solid #e2e8f0;" />`;
        
        case 'spacer':
          const height = section.size === 'small' ? '20px' : section.size === 'large' ? '60px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${ctaColor}15, ${accentColor}15); border-radius: 8px;">
              <h2 style="margin: 0 0 16px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 20px; color: #4a5568; line-height: 1.5;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map((feature, index) => `
              <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px;">
                <tr>
                  <td style="width: 60px; vertical-align: top; padding-right: 20px;">
                    <div style="width: 56px; height: 56px; background-color: ${ctaColor}15; border-radius: 12px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 12px;">
                      <span style="font-size: 28px; line-height: 1;">${feature.icon || '✨'}</span>
                    </div>
                  </td>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #1a202c; line-height: 1.3;">
                      ${feature.title}
                    </p>
                    <p style="margin: 0; font-size: ${typography.body}; color: #4a5568; line-height: 1.6;">${feature.description}</p>
                  </td>
                </tr>
              </table>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <p style="margin: 0 0 20px; font-size: 20px; color: #2d3748; line-height: 1.6; font-weight: 500;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: ${typography.small}; color: #718096; font-weight: 600;">
                ${section.testimonial.author}${section.testimonial.role ? ` · ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 28px ${spacing.elementSpacing} 0; text-align: center; padding: 20px; background-color: #ffffff; border-radius: 12px; min-width: 140px;">
                <p style="margin: 0 0 8px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1;">${stat.value}</p>
                <p style="margin: 0; font-size: ${typography.small}; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 24px; background-color: #fff5f5; border-radius: 8px; vertical-align: top;">
                  <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #c53030; text-transform: uppercase; letter-spacing: 1px;">Before</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #2d3748; line-height: 1.6;">${section.comparison.before}</p>
                </td>
                <td style="width: 20px;"></td>
                <td style="width: 50%; padding: 24px; background-color: #f0fff4; border-radius: 8px; vertical-align: top;">
                  <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #22543d; text-transform: uppercase; letter-spacing: 1px;">After</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #2d3748; line-height: 1.6;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${ctaColor}10, ${accentColor}10); border-radius: 12px; text-align: center;">
              ${section.content ? `<p style="margin: 0 0 20px; font-size: 20px; color: #2d3748; font-weight: 600; line-height: 1.4;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: ${ctaColor};">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 18px 48px; font-size: ${typography.body}; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      ${section.ctaText || 'Explore Features'}
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
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 0;">
              <div style="height: 6px; background: linear-gradient(to right, ${ctaColor}, ${accentColor});"></div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              <!-- Headline -->
              <h1 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2; text-align: center; letter-spacing: -0.02em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 20px; color: #4a5568; line-height: 1.5; text-align: center;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- Main CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center;">
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: ${ctaColor};">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 18px 48px; font-size: ${typography.body}; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                        ${content.cta.text}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 20px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #718096; text-decoration: underline; font-size: ${typography.small};">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: ${backgroundColor}; border-top: 1px solid #e2e8f0;">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: ${typography.small}; color: #718096; text-align: center; font-weight: 500;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #a0aec0; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #718096; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 13px; color: #a0aec0; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #718096; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #718096; text-decoration: underline;">Preferences</a>
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

