/**
 * Social Proof Template
 * 
 * Testimonial-focused design for trust-building
 * Best for: Case studies, customer stories, review showcases, trust-building
 * 
 * Design Philosophy:
 * - Testimonials as the hero
 * - Trust signals throughout
 * - Social validation emphasis
 * - Credibility-focused
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderSocialProof(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#f9fafb';
  
  // Social Proof uses standard scale for professional trust-building
  const typography = getTypography(design.typographyScale || 'standard');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'standard');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h3}; font-weight: 700; color: #2d3748; line-height: 1.3; text-align: center;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: ${typography.body}; color: #4a5568; line-height: 1.7; text-align: center;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `
              <div style="margin-bottom: 16px; padding: 16px 16px 16px 52px; background-color: #ffffff; border-radius: 8px; position: relative;">
                <div style="position: absolute; left: 16px; top: 16px; font-size: 20px;">✓</div>
                <p style="margin: 0; font-size: ${typography.body}; color: #2d3748; font-weight: 500;">${item}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${items}</div>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">
            <div style="display: inline-block; width: 40px; height: 40px; background-color: ${ctaColor}15; border-radius: 50%; text-align: center; line-height: 40px; font-size: 20px;">⭐</div>
          </div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '20px' : section.size === 'large' ? '60px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center;">
              <div style="display: inline-block; margin-bottom: 20px;">
                <span style="font-size: 32px;">⭐⭐⭐⭐⭐</span>
              </div>
              <h2 style="margin: 0 0 16px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 20px; color: #718096; line-height: 1.5;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: 24px; padding: 24px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                ${feature.icon ? `<div style="font-size: 36px; margin-bottom: 12px; text-align: center;">${feature.icon}</div>` : ''}
                <p style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #2d3748; text-align: center;">${feature.title}</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #718096; line-height: 1.6; text-align: center;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); text-align: center;">
              <div style="margin-bottom: 20px;">
                <span style="font-size: 28px;">⭐⭐⭐⭐⭐</span>
              </div>
              <p style="margin: 0 0 24px; font-size: 22px; color: #2d3748; line-height: 1.7; font-style: italic; font-weight: 500;">
                "${section.testimonial.quote}"
              </p>
              <div style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #e2e8f0;">
                <p style="margin: 0 0 4px; font-size: 18px; color: #2d3748; font-weight: 700;">
                  ${section.testimonial.author}
                </p>
                ${section.testimonial.role ? `<p style="margin: 0; font-size: ${typography.small}; color: #718096; font-weight: 600;">${section.testimonial.role}</p>` : ''}
              </div>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 28px ${spacing.elementSpacing} 0; text-align: center; padding: 24px; background-color: #ffffff; border-radius: 12px; min-width: 140px;">
                <div style="font-size: 24px; margin-bottom: 8px;">⭐</div>
                <p style="margin: 0 0 8px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1;">${stat.value}</p>
                <p style="margin: 0; font-size: ${typography.small}; color: #718096; font-weight: 600; text-transform: uppercase;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 12px; text-align: center;">
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: 1px;">The Challenge</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #4a5568; line-height: 1.6; font-style: italic;">"${section.comparison.before}"</p>
              </div>
              <div style="font-size: 32px; margin: 24px 0;">↓</div>
              <div style="padding: 24px; background: linear-gradient(135deg, ${ctaColor}10, ${brandColors.secondaryColor}10); border-radius: 12px;">
                <p style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: ${ctaColor}; text-transform: uppercase; letter-spacing: 1px;">The Solution</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #2d3748; line-height: 1.6; font-weight: 600;">"${section.comparison.after}"</p>
              </div>
            </div>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 12px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
              <div style="font-size: 40px; margin-bottom: 20px;">💪</div>
              ${section.content ? `<p style="margin: 0 0 24px; font-size: 20px; color: #2d3748; line-height: 1.6; font-weight: 600;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: ${ctaColor}; box-shadow: 0 4px 12px ${ctaColor}40;">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 18px 48px; font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      ${section.ctaText || 'Join Them'} →
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
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 1.7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Trust Badge -->
          <tr>
            <td style="padding: 24px; background: linear-gradient(135deg, ${ctaColor}08, ${brandColors.secondaryColor}08); text-align: center;">
              <div style="display: inline-block; padding: 12px 28px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #2d3748;">
                  ⭐ TRUSTED BY 10,000+ CUSTOMERS
                </p>
              </div>
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
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 20px; color: #718096; line-height: 1.6; text-align: center;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- Main CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center;">
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: ${ctaColor}; box-shadow: 0 4px 12px ${ctaColor}40;">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 18px 48px; font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                        ${content.cta.text} →
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #718096; text-decoration: underline; font-size: ${typography.body};">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
              <!-- Trust Footer -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; padding: 24px; background-color: ${backgroundColor}; border-radius: 12px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #718096; font-weight: 600;">
                  ✓ Trusted by industry leaders · ✓ 5-star rated · ✓ Money-back guarantee
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: ${backgroundColor}; border-top: 1px solid #e2e8f0;">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: ${typography.small}; color: #718096; text-align: center; font-weight: 600;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #a0aec0; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #718096; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 14px; color: #a0aec0; text-align: center;">
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

