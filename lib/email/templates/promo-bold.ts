/**
 * Promo Bold Template
 * 
 * High-urgency design for sales and promotions
 * Best for: Discounts, limited-time offers, flash sales, urgent promotions
 * 
 * Design Philosophy:
 * - Bold, attention-grabbing design
 * - Urgency-focused elements
 * - CTA-heavy layout
 * - Conversion-optimized
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderPromoBold(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const accentColor = design.accentColor || brandColors.accentColor;
  const backgroundColor = design.backgroundColor || '#ffffff';
  
  // Promo Bold uses premium scale for maximum impact
  const typography = getTypography(design.typographyScale || 'premium');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'generous');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h2}; font-weight: 900; color: #1a1a1a; line-height: 1.1; text-align: center; text-transform: uppercase; letter-spacing: 1px;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: 20px; color: #2a2a2a; line-height: 1.6; text-align: center; font-weight: 600;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `
              <div style="margin-bottom: 16px; padding: 16px; background-color: #f8f8f8; border-left: 4px solid ${ctaColor}; border-radius: 4px;">
                <p style="margin: 0; font-size: 18px; color: #2a2a2a; font-weight: 600;">✓ ${item}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${items}</div>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;"><span style="font-size: 32px; color: ${ctaColor};">⚡</span></div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '24px' : section.size === 'large' ? '64px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${ctaColor}, ${accentColor}); border-radius: 12px; text-align: center;">
              <h2 style="margin: 0 0 16px; font-size: ${typography.h1}; font-weight: 900; color: #ffffff; line-height: 1.05; text-transform: uppercase; letter-spacing: 2px;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 24px; color: #ffffff; line-height: 1.4; font-weight: 700; opacity: 0.95;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: 24px; padding: 28px; background-color: #f8f8f8; border-radius: 12px; text-align: center;">
                ${feature.icon ? `<div style="font-size: 48px; margin-bottom: 16px;">${feature.icon}</div>` : ''}
                <p style="margin: 0 0 12px; font-size: 24px; font-weight: 800; color: #1a1a1a; text-transform: uppercase;">${feature.title}</p>
                <p style="margin: 0; font-size: 18px; color: #4a4a4a; line-height: 1.6; font-weight: 600;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #fffbeb; border: 3px solid ${accentColor}; border-radius: 12px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 16px;">⭐⭐⭐⭐⭐</div>
              <p style="margin: 0 0 20px; font-size: 22px; color: #2a2a2a; line-height: 1.6; font-weight: 600;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: 18px; color: #4a4a4a; font-weight: 700;">
                — ${section.testimonial.author}${section.testimonial.role ? ` · ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 32px ${spacing.elementSpacing} 0; text-align: center; padding: 32px; background: linear-gradient(135deg, ${ctaColor}15, ${accentColor}15); border-radius: 12px; min-width: 160px;">
                <p style="margin: 0 0 12px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 0.9; letter-spacing: -0.04em;">${stat.value}</p>
                <p style="margin: 0; font-size: 18px; color: #2a2a2a; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 32px; background-color: #fff1f2; border-radius: 12px; vertical-align: top; text-align: center; position: relative;">
                  <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); background-color: #ef4444; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 800; text-transform: uppercase;">OLD</div>
                  <p style="margin: 24px 0 0; font-size: 18px; color: #2a2a2a; line-height: 1.6; font-weight: 500; text-decoration: line-through;">${section.comparison.before}</p>
                </td>
                <td style="width: 24px;"></td>
                <td style="width: 50%; padding: 32px; background: linear-gradient(135deg, ${ctaColor}20, ${accentColor}20); border: 3px solid ${ctaColor}; border-radius: 12px; vertical-align: top; text-align: center; position: relative;">
                  <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); background-color: ${ctaColor}; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 800; text-transform: uppercase;">NEW!</div>
                  <p style="margin: 24px 0 0; font-size: 20px; color: #1a1a1a; line-height: 1.6; font-weight: 800;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: 40px; background: linear-gradient(135deg, ${ctaColor}10, ${accentColor}10); border: 3px dashed ${ctaColor}; border-radius: 16px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 20px;">🔥</div>
              ${section.content ? `<p style="margin: 0 0 28px; font-size: 24px; color: #1a1a1a; font-weight: 800; line-height: 1.3; text-transform: uppercase;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, ${ctaColor}, ${accentColor}); box-shadow: 0 8px 24px ${ctaColor}50;">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 24px 64px; font-size: 24px; font-weight: 900; color: #ffffff; text-decoration: none; border-radius: 12px; text-transform: uppercase; letter-spacing: 2px;">
                      ${section.ctaText || 'Claim Offer'} →
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.15); border: 4px solid ${ctaColor};">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Urgency Banner -->
          <tr>
            <td style="padding: 20px; background: linear-gradient(135deg, ${ctaColor}, ${accentColor}); text-align: center;">
              <p style="margin: 0; font-size: 18px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">
                ⚡ LIMITED TIME OFFER ⚡
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              <!-- Headline -->
              <h1 style="margin: 0 0 24px; font-size: ${typography.h1}; font-weight: 900; color: #1a1a1a; line-height: 1.05; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 24px; color: #2a2a2a; line-height: 1.4; text-align: center; font-weight: 700;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- Main CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center;">
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, ${ctaColor}, ${accentColor}); box-shadow: 0 8px 24px ${ctaColor}50;">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 24px 64px; font-size: 24px; font-weight: 900; color: #ffffff; text-decoration: none; border-radius: 12px; text-transform: uppercase; letter-spacing: 2px;">
                        ${content.cta.text} →
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #4a4a4a; text-decoration: underline; font-size: 18px; font-weight: 700;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
              <!-- Urgency Footer -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; padding: 24px; background-color: #fffbeb; border-left: 4px solid ${accentColor}; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 16px; color: #2a2a2a; font-weight: 700;">
                  ⏰ Offer ends soon! Don't miss out!
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px; background-color: #f8f8f8;">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 16px; color: #2a2a2a; text-align: center; font-weight: 700;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #6a6a6a; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #4a4a4a; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 14px; color: #6a6a6a; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #4a4a4a; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #4a4a4a; text-decoration: underline;">Preferences</a>
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

