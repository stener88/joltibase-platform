/**
 * Premium Hero Template
 * 
 * Maximum visual impact with large typography and generous spacing
 * Best for: Major product launches, important announcements, milestone celebrations
 * 
 * Design Philosophy:
 * - Flodesk-quality typography (70px headlines, 100px stats)
 * - Generous whitespace (80px padding)
 * - Bold font weights (900) for commanding presence
 * - Centered, focused layout that guides the eye
 * - Premium aesthetic that creates "wow" moments
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getContrastTextColor, getTypography, getSpacing } from './types';

export function renderPremiumHero(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#ffffff';
  
  // Premium Hero ALWAYS uses premium scale for maximum impact
  const typography = getTypography('premium');
  const spacing = getSpacing('generous');
  
  // Gradient configuration for hero section
  const gradientFrom = design.headerGradient?.from || brandColors.primaryColor;
  const gradientTo = design.headerGradient?.to || brandColors.secondaryColor;
  const gradientDirection = design.headerGradient?.direction || 'to-br';
  
  // Convert gradient direction to CSS
  const cssDirection = gradientDirection === 'to-right' ? 'to right' :
                       gradientDirection === 'to-bottom' ? 'to bottom' :
                       gradientDirection === 'to-tr' ? 'to top right' :
                       '135deg'; // default diagonal
  
  const gradientStyle = `background: linear-gradient(${cssDirection}, ${gradientFrom}, ${gradientTo});`;
  
  // Determine text color for gradient (white or black based on background)
  const headerTextColor = getContrastTextColor(gradientFrom);

  // Build sections HTML with premium styling
  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<p style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #111827; line-height: 1.1; letter-spacing: -0.02em;">${section.content || ''}</p>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: ${typography.body}; color: #374151; line-height: 1.6;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 12px; font-size: ${typography.body};">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 ${spacing.paragraphSpacing}; padding-left: 24px; font-size: ${typography.body}; color: #374151; line-height: 1.6;">${items}</ul>`;
        
        case 'divider':
          return `<hr style="margin: ${spacing.sectionSpacing} 0; border: none; border-top: 2px solid #e5e7eb;" />`;
        
        case 'spacer':
          const height = section.size === 'small' ? '24px' : section.size === 'large' ? '64px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center;">
              <h2 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #111827; line-height: 1.05; letter-spacing: -0.04em;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 24px; color: #6b7280; line-height: 1.4; font-weight: 500;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: ${spacing.elementSpacing};">
                <p style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #111827;">
                  ${feature.icon ? `<span style="font-size: 32px; margin-right: 12px;">${feature.icon}</span>` : ''}${feature.title}
                </p>
                <p style="margin: 0; font-size: ${typography.body}; color: #6b7280; line-height: 1.6;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #f9fafb; border-left: 6px solid ${ctaColor}; border-radius: 8px;">
              <p style="margin: 0 0 20px; font-size: 22px; color: #374151; font-style: italic; line-height: 1.6; font-weight: 500;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: ${typography.body}; color: #6b7280; font-weight: 600;">
                ${section.testimonial.author}${section.testimonial.role ? `, ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 40px ${spacing.elementSpacing} 0; text-align: center;">
                <p style="margin: 0 0 12px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 0.9; letter-spacing: -0.04em;">${stat.value}</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 24px; background-color: #fef2f2; border-radius: 8px; vertical-align: top;">
                  <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">Before</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #374151; line-height: 1.5;">${section.comparison.before}</p>
                </td>
                <td style="width: 24px;"></td>
                <td style="width: 50%; padding: 24px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
                  <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px;">After</p>
                  <p style="margin: 0; font-size: ${typography.body}; color: #374151; line-height: 1.5;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">
              ${section.content ? `<p style="margin: 0 0 24px; font-size: 20px; color: #374151; font-weight: 500; line-height: 1.4;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${ctaColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 20px 56px; font-size: 20px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: -0.01em;">
                      ${section.ctaText || 'Get Started'}
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
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <!-- Preheader (hidden) -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Premium Gradient Hero -->
          <tr>
            <td style="${gradientStyle} padding: ${spacing.outerPadding} 48px; text-align: center;">
              
              <!-- Extra Large Headline on Gradient -->
              <h1 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: ${headerTextColor}; line-height: 1.05; letter-spacing: -0.04em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline on Gradient -->
              ${content.subheadline ? `
              <p style="margin: 0; font-size: 22px; color: ${headerTextColor}; line-height: 1.4; opacity: 0.95; font-weight: 500;">
                ${content.subheadline}
              </p>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Premium Body Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- Main CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: ${spacing.sectionSpacing} auto 0;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${ctaColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <a href="${content.cta.url}" style="display: inline-block; padding: 20px 56px; font-size: 20px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: -0.01em;">
                      ${content.cta.text}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #6b7280; text-decoration: underline; font-size: ${typography.body}; font-weight: 500;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              
              <!-- Company Info -->
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: ${typography.small}; color: #6b7280; text-align: center; font-weight: 500;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #9ca3af; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              <!-- Custom Footer Text -->
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <!-- Unsubscribe -->
              <p style="margin: 0; font-size: 14px; color: #9ca3af; text-align: center;">
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

