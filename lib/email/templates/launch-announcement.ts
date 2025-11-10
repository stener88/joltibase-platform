/**
 * Launch Announcement Template
 * 
 * Milestone celebrations with prominent stats display
 * Best for: Product launches, funding announcements, major milestones, achievements
 * 
 * Design Philosophy:
 * - Stats-heavy, impactful design
 * - Premium scale typography (70px headlines, 100px stats)
 * - Celebration-focused aesthetic
 * - Maximum visual impact
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getContrastTextColor, getTypography, getSpacing } from './types';

export function renderLaunchAnnouncement(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#ffffff';
  
  // Launch Announcement ALWAYS uses premium scale for maximum celebration impact
  const typography = getTypography('premium');
  const spacing = getSpacing('generous');
  
  // Gradient for hero
  const gradientFrom = design.headerGradient?.from || brandColors.primaryColor;
  const gradientTo = design.headerGradient?.to || brandColors.secondaryColor;
  const gradientStyle = `background: linear-gradient(135deg, ${gradientFrom}, ${gradientTo});`;
  const headerTextColor = getContrastTextColor(gradientFrom);

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #1a1a1a; line-height: 1.1; text-align: center; letter-spacing: -0.03em;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: 20px; color: #4a4a4a; line-height: 1.7; text-align: center;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 16px; font-size: 18px;">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 ${spacing.paragraphSpacing}; padding-left: 32px; font-size: 18px; color: #4a4a4a; line-height: 1.7;">${items}</ul>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} auto; width: 80px; height: 4px; background: linear-gradient(to right, ${gradientFrom}, ${gradientTo}); border-radius: 2px;"></div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '32px' : section.size === 'large' ? '80px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center;">
              <h2 style="margin: 0 0 24px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a1a1a; line-height: 1.05; letter-spacing: -0.04em;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 24px; color: #5a5a5a; line-height: 1.4; font-weight: 500;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: ${spacing.elementSpacing}; text-align: center;">
                ${feature.icon ? `<div style="font-size: 48px; margin-bottom: 16px;">${feature.icon}</div>` : ''}
                <p style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #1a1a1a;">${feature.title}</p>
                <p style="margin: 0; font-size: 18px; color: #6a6a6a; line-height: 1.6;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: 40px; background: linear-gradient(135deg, ${gradientFrom}08, ${gradientTo}08); border-radius: 12px; text-align: center;">
              <p style="margin: 0 0 24px; font-size: 26px; color: #2a2a2a; font-style: italic; line-height: 1.6; font-weight: 500;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: 18px; color: #6a6a6a; font-weight: 700;">
                ${section.testimonial.author}${section.testimonial.role ? ` · ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 40px ${spacing.elementSpacing} 0; text-align: center;">
                <p style="margin: 0 0 16px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 0.85; letter-spacing: -0.05em;">${stat.value}</p>
                <p style="margin: 0; font-size: 20px; color: #6a6a6a; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${gradientFrom}05, ${gradientTo}05); border-radius: 12px;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 32px; background-color: #f8f8f8; border-radius: 12px; vertical-align: top; text-align: center;">
                  <p style="margin: 0 0 16px; font-size: 14px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 1.5px;">Before</p>
                  <p style="margin: 0; font-size: 18px; color: #4a4a4a; line-height: 1.6;">${section.comparison.before}</p>
                </td>
                <td style="width: 32px;"></td>
                <td style="width: 50%; padding: 32px; background: linear-gradient(135deg, ${gradientFrom}10, ${gradientTo}10); border-radius: 12px; vertical-align: top; text-align: center;">
                  <p style="margin: 0 0 16px; font-size: 14px; font-weight: 800; color: ${ctaColor}; text-transform: uppercase; letter-spacing: 1.5px;">After</p>
                  <p style="margin: 0; font-size: 18px; color: #2a2a2a; line-height: 1.6; font-weight: 600;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; text-align: center; padding: ${spacing.elementSpacing}; background: linear-gradient(135deg, ${gradientFrom}08, ${gradientTo}08); border-radius: 12px;">
              ${section.content ? `<p style="margin: 0 0 28px; font-size: 24px; color: #2a2a2a; font-weight: 600; line-height: 1.4;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${ctaColor}; box-shadow: 0 6px 20px ${ctaColor}40;">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 22px 60px; font-size: 20px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: 0.5px;">
                      ${section.ctaText || 'Learn More'}
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Gradient Hero -->
          <tr>
            <td style="${gradientStyle} padding: ${spacing.outerPadding} 48px; text-align: center;">
              
              <!-- Announcement Badge -->
              <div style="display: inline-block; padding: 10px 24px; background-color: rgba(255,255,255,0.25); border-radius: 24px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; font-weight: 800; color: ${headerTextColor}; text-transform: uppercase; letter-spacing: 2px;">🎉 Announcement</p>
              </div>
              
              <!-- Headline -->
              <h1 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: ${headerTextColor}; line-height: 1.05; letter-spacing: -0.04em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0; font-size: 24px; color: ${headerTextColor}; line-height: 1.4; opacity: 0.95; font-weight: 500;">
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
                    <td align="center" style="border-radius: 10px; background-color: ${ctaColor}; box-shadow: 0 6px 20px ${ctaColor}40;">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 22px 60px; font-size: 20px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: 0.5px;">
                        ${content.cta.text}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #6a6a6a; text-decoration: underline; font-size: 18px; font-weight: 500;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: #fafafa;">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 16px; color: #6a6a6a; text-align: center; font-weight: 600;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #999; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #6a6a6a; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 14px; color: #999; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #6a6a6a; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #6a6a6a; text-decoration: underline;">Preferences</a>
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

