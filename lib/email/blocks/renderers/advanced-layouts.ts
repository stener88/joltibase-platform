/**
 * Advanced Layout Block Renderers
 * 
 * Renders complex layouts: image-overlay, card-centered, compact-image-text, magazine-feature
 */

import type { RenderContext } from './index';

import {
  escapeHtml,
  processImageUrl,
  getPlaceholderImage,
} from './utils';

import {
  renderLayoutButton,
} from './layout-helpers';

import {
  EMAIL_DIMENSIONS,
  COLUMN_WIDTHS,
  PLACEHOLDER_DIMENSIONS,
} from '../constants';

// ============================================================================
// Image Overlay Layout
// ============================================================================

/**
 * Render image-overlay layout
 * Full-width background image with text overlay
 */
export function renderImageOverlayLayout(content: any, settings: any, context: RenderContext): string {
  const imageUrl = content.image?.url || '';
  const processedUrl = imageUrl 
    ? processImageUrl(imageUrl, 'image') 
    : getPlaceholderImage(EMAIL_DIMENSIONS.MAX_WIDTH, PLACEHOLDER_DIMENSIONS.IMAGE.HEIGHT, 'image');
  const backgroundColor = settings.backgroundColor || '#f9fafb';
  const flip = settings.flip || false;
  
  // Text elements
  const badge = content.badge || '';
  const title = typeof content.title === 'string' ? content.title : content.title?.text || '';
  const paragraph = typeof content.paragraph === 'string' ? content.paragraph : content.paragraph?.text || '';
  
  // Positioning based on flip
  const verticalAlign = flip ? 'bottom' : 'top';
  const verticalPadding = flip ? 'padding-bottom: 40px;' : 'padding-top: 40px;';
  
  // Font settings
  const titleFontSize = content.title?.fontSize || settings.titleFontSize || '32px';
  const titleColor = content.title?.color || settings.titleColor || '#111827';
  const badgeFontSize = '20px';
  const badgeColor = '#ffffff';
  const badgeBackgroundColor = 'rgba(0, 0, 0, 0.7)';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${settings.padding?.top || 0}px ${settings.padding?.right || 0}px ${settings.padding?.bottom || 0}px ${settings.padding?.left || 0}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="position: relative; background-image: url('${escapeHtml(processedUrl)}'); background-size: cover; background-position: center; min-height: 400px;" background="${escapeHtml(processedUrl)}">
                <!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:400px;">
                  <v:fill type="frame" src="${escapeHtml(processedUrl)}" color="${backgroundColor}" />
                  <v:textbox inset="0,0,0,0">
                <![endif]-->
                <div style="${verticalPadding}">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="height: 400px;">
                    <tr>
                      <td valign="${verticalAlign}" style="padding: 40px;">
                        ${badge ? `
                          <div style="display: inline-block; background-color: ${badgeBackgroundColor}; color: ${badgeColor}; font-size: ${badgeFontSize}; font-weight: 700; padding: 16px 20px; margin-bottom: 20px;">
                            ${escapeHtml(badge)}
                          </div>
                        ` : ''}
                        ${title ? `
                          <h1 style="margin: 0; color: ${titleColor}; font-size: ${titleFontSize}; font-weight: 700; line-height: 1.2; max-width: 500px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            ${escapeHtml(title)}
                          </h1>
                        ` : ''}
                        ${paragraph ? `
                          <p style="margin: 16px 0 0 0; color: ${titleColor}; font-size: 16px; line-height: 1.6; max-width: 400px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                            ${escapeHtml(paragraph)}
                          </p>
                        ` : ''}
                        ${content.button && content.button.text ? renderLayoutButton(content.button, settings, context) : ''}
                      </td>
                    </tr>
                  </table>
                </div>
                <!--[if gte mso 9]>
                  </v:textbox>
                </v:rect>
                <![endif]-->
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Card Centered Layout
// ============================================================================

/**
 * Render card-centered layout
 * Centered card with large number, text, divider, and button
 */
export function renderCardCenteredLayout(content: any, settings: any, context: RenderContext): string {
  const title = typeof content.title === 'string' ? content.title : content.title?.text || '';
  const subtitle = typeof content.subtitle === 'string' ? content.subtitle : content.subtitle?.text || '';
  const paragraph = typeof content.paragraph === 'string' ? content.paragraph : content.paragraph?.text || '';
  const showDivider = content.divider !== false;
  
  const backgroundColor = settings.backgroundColor || '#f9fafb';
  const cardPadding = { top: 60, right: 40, bottom: 60, left: 40 };
  const titleFontSize = content.title?.fontSize || settings.titleFontSize || '72px';
  const titleColor = content.title?.color || settings.titleColor || '#111827';
  const subtitleFontSize = content.subtitle?.fontSize || '24px';
  const subtitleColor = content.subtitle?.color || '#374151';
  const paragraphColor = content.paragraph?.color || '#6b7280';
  const dividerColor = settings.dividerColor || '#e5e7eb';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${settings.padding?.top || 40}px ${settings.padding?.right || 20}px ${settings.padding?.bottom || 40}px ${settings.padding?.left || 20}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e7eb;">
            <tr>
              <td style="padding: ${cardPadding.top}px ${cardPadding.right}px ${cardPadding.bottom}px ${cardPadding.left}px; text-align: center;">
                ${title ? `
                  <div style="margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: ${titleFontSize}; font-weight: 700; color: ${titleColor}; line-height: 1;">
                      ${escapeHtml(title)}
                    </h1>
                  </div>
                ` : ''}
                
                ${subtitle ? `
                  <div style="margin-bottom: 24px;">
                    <h2 style="margin: 0; font-size: ${subtitleFontSize}; font-weight: 500; color: ${subtitleColor}; line-height: 1.3;">
                      ${escapeHtml(subtitle)}
                    </h2>
                  </div>
                ` : ''}
                
                ${showDivider ? `
                  <div style="margin: 24px auto; width: 60px; height: 2px; background-color: ${dividerColor};"></div>
                ` : ''}
                
                ${paragraph ? `
                  <div style="margin-bottom: 32px;">
                    <p style="margin: 0; font-size: 16px; color: ${paragraphColor}; line-height: 1.6; max-width: 400px; margin: 0 auto;">
                      ${escapeHtml(paragraph)}
                    </p>
                  </div>
                ` : ''}
                
                ${content.button && content.button.text ? `
                  <div style="margin-top: 32px;">
                    ${renderLayoutButton(content.button, settings, context)}
                  </div>
                ` : ''}
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Compact Image Text Layout
// ============================================================================

/**
 * Render compact-image-text layout - FIXED WIDTH
 * Small image on left, two text elements stacked on right
 */
export function renderCompactImageTextLayout(content: any, settings: any, context: RenderContext): string {
  const imageUrl = content.image?.url || '';
  const processedUrl = imageUrl 
    ? processImageUrl(imageUrl, 'image') 
    : getPlaceholderImage(COLUMN_WIDTHS.COMPACT_IMAGE, COLUMN_WIDTHS.COMPACT_IMAGE, 'image');
  const title = typeof content.title === 'string' ? content.title : content.title?.text || '';
  const subtitle = typeof content.subtitle === 'string' ? content.subtitle : content.subtitle?.text || '';
  
  const backgroundColor = settings.backgroundColor || 'transparent';
  const titleFontSize = content.title?.fontSize || '14px';
  const titleColor = content.title?.color || '#9ca3af';
  const subtitleFontSize = content.subtitle?.fontSize || '16px';
  const subtitleColor = content.subtitle?.color || '#111827';
  const borderRadius = settings.borderRadius || '8px';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${settings.padding?.top || 20}px ${settings.padding?.right || 20}px ${settings.padding?.bottom || 20}px ${settings.padding?.left || 20}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="${COLUMN_WIDTHS.COMPACT_IMAGE}" valign="top" style="width: ${COLUMN_WIDTHS.COMPACT_IMAGE}px;">
                <img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.image?.altText || '')}" 
                  width="${COLUMN_WIDTHS.COMPACT_IMAGE}"
                  style="display: block; width: ${COLUMN_WIDTHS.COMPACT_IMAGE}px; height: auto; border-radius: ${borderRadius}; border: 1px solid #e5e7eb;" />
              </td>
              <td width="20" style="width: 20px;"></td>
              <td valign="top">
                ${title ? `
                  <p style="margin: 0 0 8px 0; font-size: ${titleFontSize}; font-style: italic; color: ${titleColor}; line-height: 1.4;">
                    ${escapeHtml(title)}
                  </p>
                ` : ''}
                ${subtitle ? `
                  <p style="margin: 0; font-size: ${subtitleFontSize}; font-weight: 500; color: ${subtitleColor}; line-height: 1.5;">
                    ${escapeHtml(subtitle)}
                  </p>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Magazine Feature Layout
// ============================================================================

/**
 * Render magazine-feature layout
 * Vertical layout: title on top, centered square image with number overlay, description below
 */
export function renderMagazineFeatureLayout(content: any, settings: any, context: RenderContext): string {
  const imageUrl = content.image?.url || '';
  const processedUrl = imageUrl 
    ? processImageUrl(imageUrl, 'image') 
    : getPlaceholderImage(500, 500, 'image');
  const title = typeof content.title === 'string' ? content.title : content.title?.text || '';
  const badge = content.badge || '';
  const paragraph = typeof content.paragraph === 'string' ? content.paragraph : content.paragraph?.text || '';
  
  const backgroundColor = settings.backgroundColor || '#9CADB7';
  const titleFontSize = content.title?.fontSize || settings.titleFontSize || '48px';
  const titleColor = content.title?.color || settings.titleColor || '#111827';
  const badgeFontSize = '120px';
  const badgeColor = '#000000';
  const paragraphColor = content.paragraph?.color || '#111827';
  const borderRadius = settings.borderRadius || '0px';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${settings.padding?.top || 60}px ${settings.padding?.right || 40}px ${settings.padding?.bottom || 60}px ${settings.padding?.left || 40}px;">
          <!-- Title -->
          ${title ? `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom: 40px;">
                  <h1 style="margin: 0; font-size: ${titleFontSize}; font-weight: 400; color: ${titleColor}; line-height: 1.2; font-family: serif;">
                    ${escapeHtml(title)}
                  </h1>
                </td>
              </tr>
            </table>
          ` : ''}
          
          <!-- Image with Badge Overlay -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding-bottom: 40px; position: relative;">
                <div style="position: relative; max-width: 500px;">
                  <img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.image?.altText || '')}" 
                    width="500"
                    style="display: block; width: 500px; height: auto; border-radius: ${borderRadius};" />
                  ${badge ? `
                    <div style="position: absolute; bottom: -30px; right: 10%; font-size: ${badgeFontSize}; font-weight: 700; color: ${badgeColor}; line-height: 1; font-family: serif; text-shadow: 2px 2px 0px rgba(255,255,255,0.8);">
                      ${escapeHtml(badge)}
                    </div>
                  ` : ''}
                </div>
              </td>
            </tr>
          </table>
          
          <!-- Paragraph -->
          ${paragraph ? `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" style="padding: 0 10%; padding-top: ${badge ? '40px' : '0'};">
                  <p style="margin: 0; font-size: 16px; color: ${paragraphColor}; line-height: 1.6; max-width: 600px;">
                    ${escapeHtml(paragraph)}
                  </p>
                </td>
              </tr>
            </table>
          ` : ''}
          
        </td>
      </tr>
    </table>
  `;
}

