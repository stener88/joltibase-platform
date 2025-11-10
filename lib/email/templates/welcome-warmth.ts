/**
 * Welcome Warmth Template
 * 
 * Friendly onboarding with approachable design
 * Best for: Welcome emails, onboarding series, new user introductions
 * 
 * Design Philosophy:
 * - Warm, friendly aesthetic
 * - Approachable typography
 * - Encouragement-focused
 * - Personal, human touch
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderWelcomeWarmth(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#fef9f5';
  
  // Welcome Warmth uses standard scale with generous spacing for warmth
  const typography = getTypography(design.typographyScale || 'standard');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'generous');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h3}; font-weight: 700; color: #2d3748; line-height: 1.3; text-align: center;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: ${typography.body}; color: #4a5568; line-height: 1.8;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map((item, i) => `
              <div style="margin-bottom: 20px; padding-left: 48px; position: relative;">
                <div style="position: absolute; left: 0; top: 0; width: 36px; height: 36px; background: linear-gradient(135deg, ${ctaColor}, ${brandColors.secondaryColor}); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
                  ${i + 1}
                </div>
                <p style="margin: 0; padding-top: 6px; font-size: ${typography.body}; color: #4a5568; line-height: 1.7;">${item}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${items}</div>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} auto; text-align: center;"><span style="font-size: 32px;">✨</span></div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '24px' : section.size === 'large' ? '64px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${ctaColor}08, ${brandColors.secondaryColor}08); border-radius: 16px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 20px;">👋</div>
              <h2 style="margin: 0 0 16px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #2d3748; line-height: 1.2;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 20px; color: #718096; line-height: 1.5;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: ${spacing.elementSpacing}; padding: 24px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                ${feature.icon ? `<div style="font-size: 40px; margin-bottom: 16px;">${feature.icon}</div>` : ''}
                <p style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #2d3748;">${feature.title}</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #718096; line-height: 1.7;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
              <div style="font-size: 48px; margin-bottom: 20px;">💙</div>
              <p style="margin: 0 0 20px; font-size: 22px; color: #2d3748; line-height: 1.7; font-style: italic;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: ${typography.body}; color: #718096; font-weight: 600;">
                — ${section.testimonial.author}${section.testimonial.role ? `, ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 32px ${spacing.elementSpacing} 0; text-align: center; padding: 24px; background-color: #ffffff; border-radius: 12px; min-width: 140px;">
                <p style="margin: 0 0 12px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1;">${stat.value}</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #718096; font-weight: 600;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 28px; background-color: #fef5f5; border-radius: 12px; vertical-align: top; text-align: center;">
                  <div style="font-size: 32px; margin-bottom: 12px;">😓</div>
                  <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #a0616a; text-transform: uppercase;">Before</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #4a5568; line-height: 1.6;">${section.comparison.before}</p>
                </td>
                <td style="width: 20px;"></td>
                <td style="width: 50%; padding: 28px; background-color: #f0fdf9; border-radius: 12px; vertical-align: top; text-align: center;">
                  <div style="font-size: 32px; margin-bottom: 12px;">🎉</div>
                  <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: ${ctaColor}; text-transform: uppercase;">After</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #4a5568; line-height: 1.6; font-weight: 600;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
              ${section.content ? `<p style="margin: 0 0 24px; font-size: 20px; color: #4a5568; line-height: 1.6;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, ${ctaColor}, ${brandColors.secondaryColor}); box-shadow: 0 4px 12px ${ctaColor}40;">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 18px 48px; font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                      ${section.ctaText || 'Get Started'} →
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
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 1.8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Welcome Header -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px ${spacing.sectionSpacing}; background: linear-gradient(135deg, ${ctaColor}10, ${brandColors.secondaryColor}10); text-align: center;">
              
              <!-- Welcome Emoji -->
              <div style="font-size: 80px; margin-bottom: 20px; line-height: 1;">🎉</div>
              
              <!-- Headline -->
              <h1 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2; letter-spacing: -0.02em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0; font-size: 22px; color: #4a5568; line-height: 1.6; font-weight: 500;">
                ${content.subheadline}
              </p>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              ${sectionsHtml}
              
              <!-- Main CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center;">
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, ${ctaColor}, ${brandColors.secondaryColor}); box-shadow: 0 4px 12px ${ctaColor}40;">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 18px 48px; font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                        ${content.cta.text} →
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #718096; text-decoration: underline; font-size: ${typography.body};">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: ${backgroundColor};">
              
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

