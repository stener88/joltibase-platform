/**
 * Milestone Celebration Template
 * 
 * Achievement-focused design with celebratory vibes
 * Best for: User anniversaries, achievement unlocks, team milestones, birthday emails
 * 
 * Design Philosophy:
 * - Celebratory, joyful aesthetic
 * - Emoji and confetti elements
 * - Personal achievement focus
 * - Encouraging and positive
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderMilestoneCelebration(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const accentColor = design.accentColor || brandColors.accentColor;
  const backgroundColor = design.backgroundColor || '#fffbf0';
  
  // Milestone Celebration uses premium scale for maximum celebration
  const typography = getTypography(design.typographyScale || 'premium');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'generous');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h3}; font-weight: 800; color: #2d3748; line-height: 1.3; text-align: center;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: 20px; color: #4a5568; line-height: 1.7; text-align: center; font-weight: 500;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map((item, i) => {
              const emojis = ['🎯', '🚀', '⭐', '💪', '🎨', '📈'];
              return `
                <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, ${ctaColor}08, ${accentColor}08); border-radius: 12px; text-align: center;">
                  <div style="font-size: 32px; margin-bottom: 12px;">${emojis[i % emojis.length]}</div>
                  <p style="margin: 0; font-size: 18px; color: #2d3748; font-weight: 600;">${item}</p>
                </div>
              `;
            })
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${items}</div>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;"><span style="font-size: 40px;">✨🎉✨</span></div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '24px' : section.size === 'large' ? '64px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${ctaColor}15, ${accentColor}15); border-radius: 20px; text-align: center; position: relative; overflow: hidden;">
              <div style="font-size: 80px; margin-bottom: 20px; line-height: 1;">🎉</div>
              <h2 style="margin: 0 0 16px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.1; letter-spacing: -0.03em;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 24px; color: #4a5568; line-height: 1.5; font-weight: 600;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: 24px; padding: 28px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: center;">
                ${feature.icon ? `<div style="font-size: 56px; margin-bottom: 16px;">${feature.icon}</div>` : ''}
                <p style="margin: 0 0 12px; font-size: 24px; font-weight: 800; color: #2d3748;">${feature.title}</p>
                <p style="margin: 0; font-size: 18px; color: #718096; line-height: 1.7;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 20px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); text-align: center;">
              <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
              <p style="margin: 0 0 24px; font-size: 24px; color: #2d3748; line-height: 1.7; font-style: italic; font-weight: 500;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: 20px; color: #718096; font-weight: 700;">
                — ${section.testimonial.author}${section.testimonial.role ? `, ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 32px ${spacing.elementSpacing} 0; text-align: center; padding: 32px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); min-width: 160px;">
                <p style="margin: 0 0 16px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 0.9; letter-spacing: -0.04em;">${stat.value}</p>
                <p style="margin: 0; font-size: 20px; color: #718096; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${stat.label}</p>
                <div style="font-size: 32px; margin-top: 16px;">🎊</div>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 16px; text-align: center;">
              <div style="margin-bottom: 28px;">
                <p style="margin: 0 0 12px; font-size: 16px; font-weight: 700; color: #a0aec0; text-transform: uppercase;">Where You Started</p>
                <div style="font-size: 40px; margin-bottom: 12px;">🌱</div>
                <p style="margin: 0; font-size: 18px; color: #4a5568; line-height: 1.7;">${section.comparison.before}</p>
              </div>
              <div style="font-size: 48px; margin: 32px 0;">↓</div>
              <div style="padding: 32px; background: linear-gradient(135deg, ${ctaColor}15, ${accentColor}15); border-radius: 16px;">
                <p style="margin: 0 0 12px; font-size: 16px; font-weight: 700; color: ${ctaColor}; text-transform: uppercase;">Where You Are Now</p>
                <div style="font-size: 40px; margin-bottom: 12px;">🏆</div>
                <p style="margin: 0; font-size: 20px; color: #2d3748; line-height: 1.7; font-weight: 700;">${section.comparison.after}</p>
              </div>
            </div>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: 40px; background: linear-gradient(135deg, ${ctaColor}, ${accentColor}); border-radius: 20px; text-align: center; box-shadow: 0 8px 24px ${ctaColor}40;">
              <div style="font-size: 64px; margin-bottom: 24px; line-height: 1;">🎁</div>
              ${section.content ? `<p style="margin: 0 0 28px; font-size: 26px; color: #ffffff; line-height: 1.4; font-weight: 700;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 22px 56px; font-size: 22px; font-weight: 800; color: ${ctaColor}; text-decoration: none; border-radius: 12px;">
                      ${section.ctaText || 'Claim Your Reward'} 🎉
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.12); border: 4px solid ${ctaColor};">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Celebration Banner -->
          <tr>
            <td style="padding: 32px; background: linear-gradient(135deg, ${ctaColor}, ${accentColor}); text-align: center;">
              <div style="font-size: 72px; margin-bottom: 16px; line-height: 1;">🎉🎊🎉</div>
              <p style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 3px;">
                CELEBRATION TIME!
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              <!-- Headline -->
              <h1 style="margin: 0 0 24px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.1; text-align: center; letter-spacing: -0.03em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 24px; color: #4a5568; line-height: 1.6; text-align: center; font-weight: 600;">
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
                      <a href="${content.cta.url}" style="display: inline-block; padding: 22px 56px; font-size: 22px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 12px;">
                        ${content.cta.text} 🎊
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #718096; text-decoration: underline; font-size: 18px; font-weight: 600;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
              <!-- Celebration Footer -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; padding: 28px; background: linear-gradient(135deg, ${ctaColor}08, ${accentColor}08); border-radius: 16px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">🥳</div>
                <p style="margin: 0; font-size: 18px; color: #2d3748; font-weight: 700; line-height: 1.6;">
                  Keep up the amazing work!<br>We're excited to celebrate many more milestones with you.
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: ${backgroundColor};">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 18px; color: #4a5568; text-align: center; font-weight: 700;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #718096; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #4a5568; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 14px; color: #718096; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #4a5568; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #4a5568; text-decoration: underline;">Preferences</a>
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

