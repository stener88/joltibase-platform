/**
 * Bold Modern Template
 * 
 * High-contrast design with extra large typography
 * Best for: Promotions, urgent messages, sales campaigns
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags } from './types';

export function renderBoldModern(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;

  // Build sections HTML
  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<p style="margin: 40px 0 20px; font-size: 28px; font-weight: 700; color: #000000; line-height: 1.2;">${section.content || ''}</p>`;
        
        case 'text':
          return `<p style="margin: 0 0 24px; font-size: 18px; color: #000000; line-height: 1.5;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 12px; font-size: 18px;">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 24px; padding-left: 28px; font-size: 18px; color: #000000; line-height: 1.5;">${items}</ul>`;
        
        case 'divider':
          return `<hr style="margin: 48px 0; border: none; border-top: 2px solid #000000;" />`;
        
        case 'spacer':
          const height = section.size === 'small' ? '24px' : section.size === 'large' ? '64px' : '40px';
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
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: #ffffff; line-height: 1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Preheader (hidden) -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              
              <!-- Extra Large Headline -->
              <h1 style="margin: 0 0 20px; font-size: 40px; font-weight: 800; color: #000000; line-height: 1.1; letter-spacing: -0.02em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 40px; font-size: 20px; color: #000000; line-height: 1.4; font-weight: 500;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- Bold Underlined CTA -->
              <div style="margin: 48px 0 0;">
                <a href="${content.cta.url}" style="color: ${ctaColor}; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; font-size: 20px; font-weight: 700;">
                  ${content.cta.text} →
                </a>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0;">
                <a href="${content.cta.secondary.url}" style="color: #000000; text-decoration: underline; font-size: 16px; font-weight: 500;">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 2px solid #000000;">
              
              <!-- Company Info -->
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: 14px; color: #000000; font-weight: 600;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #666666;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              <!-- Custom Footer Text -->
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 13px; color: #666666;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <!-- Unsubscribe -->
              <p style="margin: 0; font-size: 13px; color: #666666;">
                <a href="{{unsubscribe_url}}" style="color: #000000; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #000000; text-decoration: underline;">Preferences</a>
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
