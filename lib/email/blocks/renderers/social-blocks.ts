/**
 * Social and Footer Block Renderers
 * 
 * Renders social media links and footer blocks
 */

import type {
  SocialLinksBlock,
  FooterBlock,
} from '../types';

import type { RenderContext } from './index';

import {
  escapeHtml,
  getSocialIconUrl,
} from './utils';

// ============================================================================
// Social Links Block
// ============================================================================

/**
 * Render Social Links Block
 */
export function renderSocialLinksBlock(block: SocialLinksBlock, blockId?: string): string {
  const { settings, content } = block;
  const { align, iconSize, spacing, iconStyle, iconColor, padding, backgroundColor } = settings;
  
  // Ensure spacing has a proper default
  const iconSpacing = spacing || 24;
  const halfSpacing = Math.floor(iconSpacing / 2);
  
  const id = blockId || block.id;
  
  // Filter out any links with missing platforms or URLs (defensive rendering)
  const validLinks = (content.links || []).filter(link => link.platform && link.url);
  
  const socialIcons = validLinks.map((link, index) => {
    const iconUrl = getSocialIconUrl(link.platform, iconStyle, iconColor);
    const altText = link.platform || 'social';
    const dataAttrs = ` data-element-id="${id}-social-${index}" data-element-type="social-link" data-block-id="${id}"`;
    
    return `
      <td style="padding: 0 ${halfSpacing}px; vertical-align: middle;">
        <a${dataAttrs} href="${escapeHtml(link.url)}" style="text-decoration: none; display: inline-block;">
          <img src="${iconUrl}" alt="${altText}" width="${iconSize}" height="${iconSize}" style="display: block; border: none;" />
        </a>
      </td>`;
  }).join('');
  
  // Determine table alignment style
  const tableAlign = align === 'left' ? '' : align === 'right' ? 'margin-left: auto;' : 'margin: 0 auto;';
  const bgColor = backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : '';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${bgColor ? ` background-color: ${bgColor};` : ''}">
          <table role="presentation" cellpadding="0" cellspacing="0" style="${tableAlign}">
            <tr>
              ${socialIcons}
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

// ============================================================================
// Footer Block
// ============================================================================

/**
 * Render Footer Block
 */
export function renderFooterBlock(block: FooterBlock, context: RenderContext, blockId?: string): string {
  const { settings, content } = block;
  const { backgroundColor, textColor, fontSize, align, padding, lineHeight, linkColor } = settings;
  
  let unsubscribeUrl = content.unsubscribeUrl || '';
  let preferencesUrl = content.preferencesUrl || '';
  
  if (context.mergeTags) {
    Object.entries(context.mergeTags).forEach(([key, value]) => {
      unsubscribeUrl = unsubscribeUrl.replace(new RegExp(`{{${key}}}`, 'g'), value);
      preferencesUrl = preferencesUrl.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
  }
  
  const id = blockId || block.id;
  const companyNameDataAttrs = ` data-element-id="${id}-companyName" data-element-type="footer-text" data-block-id="${id}"`;
  const addressDataAttrs = ` data-element-id="${id}-companyAddress" data-element-type="footer-text" data-block-id="${id}"`;
  const customTextDataAttrs = ` data-element-id="${id}-customText" data-element-type="footer-text" data-block-id="${id}"`;
  const unsubLinkDataAttrs = ` data-element-id="${id}-unsubscribe" data-element-type="footer-link" data-block-id="${id}"`;
  const prefLinkDataAttrs = ` data-element-id="${id}-preferences" data-element-type="footer-link" data-block-id="${id}"`;
  
  const linkStyle = `color: ${linkColor || textColor}; text-decoration: underline;`;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">
          <p${companyNameDataAttrs} style="margin: 0 0 8px; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            <strong>${escapeHtml(content.companyName || '')}</strong>
          </p>
          ${content.companyAddress ? `
          <p${addressDataAttrs} style="margin: 0 0 8px; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            ${escapeHtml(content.companyAddress)}
          </p>` : ''}
          ${content.customText ? `
          <p${customTextDataAttrs} style="margin: 0 0 12px; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            ${escapeHtml(content.customText)}
          </p>` : ''}
          <p style="margin: 0; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            <a${unsubLinkDataAttrs} href="${escapeHtml(unsubscribeUrl)}" style="${linkStyle}">Unsubscribe</a>
            ${preferencesUrl ? ` | <a${prefLinkDataAttrs} href="${escapeHtml(preferencesUrl)}" style="${linkStyle}">Preferences</a>` : ''}
          </p>
        </td>
      </tr>
    </table>`;
}

