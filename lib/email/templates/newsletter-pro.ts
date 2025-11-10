/**
 * Newsletter Pro Template
 * 
 * Multi-section layout optimized for scannable content
 * Best for: Weekly/monthly updates, news digests, content roundups
 * 
 * Design Philosophy:
 * - Organized, scannable sections
 * - Clear visual hierarchy
 * - Content-dense but readable
 * - Professional newsletter aesthetic
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderNewsletterPro(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const accentColor = design.accentColor || brandColors.accentColor;
  const backgroundColor = design.backgroundColor || '#f5f6f8';
  
  // Newsletter Pro uses standard scale with standard spacing for content density
  const typography = getTypography(design.typographyScale || 'standard');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'standard');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0 20px; padding-bottom: 12px; border-bottom: 3px solid ${ctaColor};">
              <h2 style="margin: 0; font-size: ${typography.h3}; font-weight: 700; color: #2d3748; line-height: 1.3;">${section.content || ''}</h2>
            </div>
          `;
        
        case 'text':
          return `<p style="margin: 0 0 20px; font-size: ${typography.body}; color: #4a5568; line-height: 1.7;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `
              <li style="margin-bottom: 12px; padding-left: 8px;">
                <span style="color: ${ctaColor}; font-weight: 700; margin-right: 8px;">▸</span>${item}
              </li>
            `)
            .join('');
          return `<ul style="margin: 0 0 24px; padding-left: 0; list-style: none; font-size: ${typography.body}; color: #4a5568; line-height: 1.7;">${items}</ul>`;
        
        case 'divider':
          return `<hr style="margin: ${spacing.elementSpacing} 0; border: none; border-top: 1px solid #e2e8f0;" />`;
        
        case 'spacer':
          const height = section.size === 'small' ? '16px' : section.size === 'large' ? '48px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; padding: ${spacing.elementSpacing}; background-color: ${ctaColor}10; border-left: 4px solid ${ctaColor}; border-radius: 4px;">
              <h2 style="margin: 0 0 12px; font-size: ${typography.h2}; font-weight: 800; color: #1a202c; line-height: 1.2;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 18px; color: #4a5568; line-height: 1.5;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: 24px; padding: 20px; background-color: #ffffff; border-left: 3px solid ${accentColor}; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #2d3748;">
                  ${feature.icon ? `${feature.icon} ` : ''}${feature.title}
                </p>
                <p style="margin: 0; font-size: ${typography.body}; color: #718096; line-height: 1.6;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: 24px; background-color: #ffffff; border-left: 4px solid ${ctaColor}; border-radius: 6px;">
              <p style="margin: 0 0 16px; font-size: 18px; color: #2d3748; line-height: 1.6; font-style: italic;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: 14px; color: #718096; font-weight: 600;">
                — ${section.testimonial.author}${section.testimonial.role ? `, ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 24px 20px 0; text-align: center; padding: 20px; background-color: #ffffff; border-radius: 8px; min-width: 120px;">
                <p style="margin: 0 0 8px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1;">${stat.value}</p>
                <p style="margin: 0; font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: 24px 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 20px; background-color: #ffffff; border-radius: 6px; vertical-align: top;">
                  <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: #e53e3e; text-transform: uppercase;">Before</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #4a5568; line-height: 1.6;">${section.comparison.before}</p>
                </td>
                <td style="width: 16px;"></td>
                <td style="width: 50%; padding: 20px; background-color: #ffffff; border: 2px solid ${ctaColor}; border-radius: 6px; vertical-align: top;">
                  <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: ${ctaColor}; text-transform: uppercase;">After</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #4a5568; line-height: 1.6;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: 24px; background-color: #ffffff; border-radius: 8px; text-align: center;">
              ${section.content ? `<p style="margin: 0 0 20px; font-size: ${typography.body}; color: #4a5568; line-height: 1.6;">${section.content}</p>` : ''}
              <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 14px 36px; font-size: ${typography.body}; font-weight: 700; color: #ffffff; background-color: ${ctaColor}; text-decoration: none; border-radius: 6px;">
                ${section.ctaText || 'Read More'}
              </a>
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
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 1.7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Header Badge -->
          <tr>
            <td style="padding: 0 0 24px; text-align: center;">
              <div style="display: inline-block; padding: 8px 20px; background-color: ${ctaColor}; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 20px;">
                Newsletter
              </div>
            </td>
          </tr>
          
          <!-- Main Content Card -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: ${spacing.outerPadding} 40px;">
                    
                    <!-- Headline -->
                    <h1 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2; letter-spacing: -0.02em;">
                      ${content.headline}
                    </h1>
                    
                    <!-- Subheadline -->
                    ${content.subheadline ? `
                    <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 18px; color: #718096; line-height: 1.6;">
                      ${content.subheadline}
                    </p>
                    ` : ''}
                    
                    <!-- Body Sections -->
                    ${sectionsHtml}
                    
                    <!-- Main CTA -->
                    <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center;">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 16px 40px; font-size: ${typography.body}; font-weight: 700; color: #ffffff; background-color: ${ctaColor}; text-decoration: none; border-radius: 6px;">
                        ${content.cta.text}
                      </a>
                    </div>
                    
                    <!-- Secondary CTA -->
                    ${content.cta.secondary ? `
                    <div style="margin: 20px 0 0; text-align: center;">
                      <a href="${content.cta.secondary.url}" style="color: #718096; text-decoration: underline; font-size: 14px;">
                        ${content.cta.secondary.text}
                      </a>
                    </div>
                    ` : ''}
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 20px 0; text-align: center;">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 14px; color: #718096; font-weight: 500;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #a0aec0;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #718096;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 13px; color: #a0aec0;">
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

