/**
 * Gradient Hero Template
 * 
 * Modern layout with gradient header background
 * Best for: Welcome emails, product launches, major announcements
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getContrastTextColor } from './types';

export function renderGradientHero(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#f3f4f6';
  
  // Gradient configuration
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
          const height = section.size === 'small' ? '16px' : section.size === 'large' ? '48px' : '32px';
          return `<div style="height: ${height};"></div>`;
        
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Preheader (hidden) -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Gradient Header Hero -->
          <tr>
            <td style="${gradientStyle} padding: 48px 40px; text-align: center;">
              
              <!-- Headline on Gradient -->
              <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 700; color: ${headerTextColor}; line-height: 1.2;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline on Gradient -->
              ${content.subheadline ? `
              <p style="margin: 0; font-size: 18px; color: ${headerTextColor}; line-height: 1.5; opacity: 0.95;">
                ${content.subheadline}
              </p>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 48px 40px;">
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 32px auto 0;">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: ${ctaColor};">
                    <a href="${content.cta.url}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      ${content.cta.text}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 20px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #6b7280; text-decoration: underline; font-size: 14px;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              
              <!-- Company Info -->
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; text-align: center;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #9ca3af; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              <!-- Custom Footer Text -->
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280; text-align: center;">
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
