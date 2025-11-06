/**
 * Color Blocks Template
 * 
 * Professional layout with colored sidebar accent
 * Best for: Updates, newsletters, feature announcements
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags } from './types';

export function renderColorBlocks(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const accentColor = design.accentColor || brandColors.accentColor;
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#f3f4f6';

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
          
          <!-- Main Content with Sidebar -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Sidebar Accent -->
                  <td style="width: 8px; background-color: ${accentColor};">
                    <!-- Accent sidebar -->
                  </td>
                  
                  <!-- Content Area -->
                  <td style="padding: 48px 40px;">
                    
                    <!-- Headline -->
                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #111827; line-height: 1.3;">
                      ${content.headline}
                    </h1>
                    
                    <!-- Subheadline -->
                    ${content.subheadline ? `
                    <p style="margin: 0 0 32px; font-size: 18px; color: #6b7280; line-height: 1.5;">
                      ${content.subheadline}
                    </p>
                    ` : ''}
                    
                    <!-- Body Sections -->
                    ${sectionsHtml}
                    
                    <!-- CTA Block -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0 0;">
                      <tr>
                        <td style="background-color: ${accentColor}; border-radius: 6px; padding: 16px; text-align: center;">
                          <a href="${content.cta.url}" style="display: block; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
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
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="height: 1px; background-color: #e5e7eb;"></td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb;">
              
              <!-- Company Info -->
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #9ca3af;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              <!-- Custom Footer Text -->
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <!-- Unsubscribe -->
              <p style="margin: 0; font-size: 13px; color: #9ca3af;">
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
