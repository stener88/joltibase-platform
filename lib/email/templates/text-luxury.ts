/**
 * Text Luxury Template
 * 
 * Typography-first design with minimal imagery
 * Best for: Editorial content, thought leadership, premium brands, long-form content
 * 
 * Design Philosophy:
 * - Typography as the hero
 * - Minimal visual elements
 * - Refined, sophisticated aesthetic
 * - Focus on the written word
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderTextLuxury(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#fcfcfc';
  
  // Text Luxury uses minimal scale with generous spacing for refined elegance
  const typography = getTypography(design.typographyScale || 'minimal');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'generous');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 24px; font-size: ${typography.h3}; font-weight: 600; color: #1a1a1a; line-height: 1.4; font-style: italic;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: ${typography.body}; color: #2a2a2a; line-height: 2; font-weight: 400;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 20px; line-height: 2;">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 ${spacing.paragraphSpacing}; padding-left: 0; list-style: none; font-size: ${typography.body}; color: #2a2a2a; line-height: 2;">${items}</ul>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} auto; width: 40px; height: 1px; background-color: #d0d0d0;"></div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '32px' : section.size === 'large' ? '80px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center; padding-bottom: ${spacing.elementSpacing}; border-bottom: 1px solid #e8e8e8;">
              <h2 style="margin: 0 0 20px; font-size: ${typography.h2}; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.01em;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 18px; color: #5a5a5a; line-height: 1.8; font-style: italic;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: ${spacing.elementSpacing}; padding: 24px 0; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0 0 12px; font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.01em;">
                  ${feature.title}
                </p>
                <p style="margin: 0; font-size: ${typography.body}; color: #4a4a4a; line-height: 2;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing} 0; border-left: 2px solid ${ctaColor}; padding-left: ${spacing.elementSpacing};">
              <p style="margin: 0 0 20px; font-size: 20px; color: #2a2a2a; line-height: 1.8; font-style: italic; font-weight: 400;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: 14px; color: #7a7a7a; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ${section.testimonial.author}${section.testimonial.role ? ` · ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 40px ${spacing.elementSpacing} 0; text-align: center;">
                <p style="margin: 0 0 12px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1; letter-spacing: -0.02em;">${stat.value}</p>
                <p style="margin: 0; font-size: 13px; color: #7a7a7a; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center; padding: ${spacing.elementSpacing} 0; border-top: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 28px 32px 28px 0; border-right: 1px solid #e8e8e8; vertical-align: top;">
                  <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; color: #9a9a9a; text-transform: uppercase; letter-spacing: 1.5px;">Before</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #4a4a4a; line-height: 1.9;">${section.comparison.before}</p>
                </td>
                <td style="width: 50%; padding: 28px 0 28px 32px; vertical-align: top;">
                  <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; color: ${ctaColor}; text-transform: uppercase; letter-spacing: 1.5px;">After</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #2a2a2a; line-height: 1.9; font-weight: 500;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; text-align: center; padding: ${spacing.elementSpacing} 0; border-top: 1px solid #e8e8e8;">
              ${section.content ? `<p style="margin: 0 0 24px; font-size: ${typography.body}; color: #4a4a4a; line-height: 2;">${section.content}</p>` : ''}
              <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 14px 36px; font-size: ${typography.body}; font-weight: 600; color: ${ctaColor}; text-decoration: none; border: 2px solid ${ctaColor}; border-radius: 2px; letter-spacing: 0.5px; text-transform: uppercase;">
                ${section.ctaText || 'Continue Reading'}
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
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; padding: ${spacing.outerPadding} 56px;">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Header Mark -->
          <tr>
            <td style="padding-bottom: ${spacing.sectionSpacing}; text-align: center;">
              <div style="width: 60px; height: 2px; background-color: ${ctaColor}; margin: 0 auto;"></div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td>
              
              <!-- Headline -->
              <h1 style="margin: 0 0 28px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.01em; text-align: center;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 20px; color: #5a5a5a; line-height: 1.9; text-align: center; font-style: italic;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Decorative Line -->
              <div style="width: 40px; height: 1px; background-color: #d0d0d0; margin: 0 auto ${spacing.sectionSpacing};"></div>
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center; padding-top: ${spacing.elementSpacing}; border-top: 1px solid #e8e8e8;">
                <a href="${content.cta.url}" style="display: inline-block; padding: 14px 36px; font-size: ${typography.body}; font-weight: 600; color: ${ctaColor}; text-decoration: none; border: 2px solid ${ctaColor}; border-radius: 2px; letter-spacing: 0.5px; text-transform: uppercase;">
                  ${content.cta.text}
                </a>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #7a7a7a; text-decoration: underline; font-size: 14px; letter-spacing: 0.5px;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer Mark -->
          <tr>
            <td style="padding-top: ${spacing.sectionSpacing}; text-align: center;">
              <div style="width: 60px; height: 2px; background-color: ${ctaColor}; margin: 0 auto 32px;"></div>
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 13px; color: #7a7a7a; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 16px; font-size: 13px; color: #aaaaaa; letter-spacing: 0.5px;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 16px; font-size: 13px; color: #7a7a7a; line-height: 1.8;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 12px; color: #aaaaaa; letter-spacing: 0.5px;">
                <a href="{{unsubscribe_url}}" style="color: #7a7a7a; text-decoration: underline;">Unsubscribe</a>
                <span style="color: #d0d0d0; margin: 0 8px;">·</span>
                <a href="{{preferences_url}}" style="color: #7a7a7a; text-decoration: underline;">Preferences</a>
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

