/**
 * Layout Helper Functions
 * 
 * Helper functions for rendering layout elements and calculating dimensions
 */

import type { RenderContext } from './index';

import {
  escapeHtml,
  processImageUrl,
  getPlaceholderImage,
} from './utils';

import {
  EMAIL_DIMENSIONS,
  COLUMN_WIDTHS,
  DEFAULT_COLORS,
  DEFAULT_FONT_SIZES,
  DEFAULT_FONT_WEIGHTS,
  DEFAULT_BORDER_RADIUS,
} from '../constants';

// ============================================================================
// Column Width Calculations
// ============================================================================

/**
 * Interface for column width calculations
 */
export interface ColumnWidths {
  left: string;
  right: string;
  leftPx: number;
  rightPx: number;
}

/**
 * Calculate fixed pixel widths for two-column layouts
 */
export function calculateColumnWidths(variation: string): ColumnWidths {
  let leftPx: number;
  let rightPx: number;
  
  switch (variation) {
    case 'two-column-60-40':
      leftPx = COLUMN_WIDTHS.TWO_COL_60;
      rightPx = COLUMN_WIDTHS.TWO_COL_40;
      break;
    case 'two-column-40-60':
      leftPx = COLUMN_WIDTHS.TWO_COL_40;
      rightPx = COLUMN_WIDTHS.TWO_COL_60;
      break;
    case 'two-column-70-30':
      leftPx = COLUMN_WIDTHS.TWO_COL_70;
      rightPx = COLUMN_WIDTHS.TWO_COL_30;
      break;
    case 'two-column-30-70':
      leftPx = COLUMN_WIDTHS.TWO_COL_30;
      rightPx = COLUMN_WIDTHS.TWO_COL_70;
      break;
    case 'two-column-50-50':
    default:
      leftPx = COLUMN_WIDTHS.TWO_COL_50;
      rightPx = COLUMN_WIDTHS.TWO_COL_50;
      break;
  }
  
  return {
    left: `${leftPx}px`,
    right: `${rightPx}px`,
    leftPx,
    rightPx,
  };
}

/**
 * Calculate fixed pixel widths for multi-column layouts
 */
export function calculateMultiColumnWidth(columns: number): { width: string; widthPx: number } {
  const totalGaps = (columns - 1) * EMAIL_DIMENSIONS.COLUMN_GAP;
  const widthPx = Math.floor((EMAIL_DIMENSIONS.MAX_WIDTH - totalGaps) / columns);
  
  return {
    width: `${widthPx}px`,
    widthPx,
  };
}

// ============================================================================
// Layout Element Renderers
// ============================================================================

/**
 * Render layout image - FIXED WIDTH
 * Accepts optional width parameter for nested images in columns
 */
export function renderLayoutImage(image: any, settings: any, width?: number): string {
  const imageWidth = width || EMAIL_DIMENSIONS.MAX_WIDTH;
  const imageHeight = Math.floor(imageWidth * EMAIL_DIMENSIONS.IMAGE_ASPECT_RATIO);
  const imageUrl = image.url || '';
  const processedUrl = imageUrl 
    ? processImageUrl(imageUrl, 'image') 
    : getPlaceholderImage(imageWidth, imageHeight, 'image');
  const borderRadius = settings.borderRadius || DEFAULT_BORDER_RADIUS.MEDIUM;
  
  return `
    <img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(image.altText || '')}" 
      width="${imageWidth}"
      style="display: block; width: ${imageWidth}px; max-width: ${imageWidth}px; height: auto; border-radius: ${borderRadius};" />
  `;
}

/**
 * Render header text (small eyebrow text above title)
 */
export function renderLayoutHeader(headerContent: any, settings: any): string {
  const text = typeof headerContent === 'string' ? headerContent : headerContent.text || '';
  const fontSize = headerContent.fontSize || settings.headerFontSize || DEFAULT_FONT_SIZES.SMALL;
  const fontWeight = headerContent.fontWeight || settings.headerFontWeight || DEFAULT_FONT_WEIGHTS.SEMIBOLD;
  const color = headerContent.color || settings.headerColor || DEFAULT_COLORS.HEADER;
  const align = settings.align || 'center';
  const marginBottom = '12px';
  
  if (!text) return '';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding-bottom: ${marginBottom};">
          <p style="margin: 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em;">
            ${escapeHtml(text)}
          </p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Render title/headline text
 */
export function renderLayoutTitle(titleContent: any, settings: any): string {
  const text = typeof titleContent === 'string' ? titleContent : titleContent.text || '';
  const fontSize = titleContent.fontSize || settings.titleFontSize || '48px';
  const fontWeight = titleContent.fontWeight || settings.titleFontWeight || DEFAULT_FONT_WEIGHTS.BOLD;
  const color = titleContent.color || settings.titleColor || DEFAULT_COLORS.HEADING;
  const align = settings.align || 'center';
  const lineHeight = titleContent.lineHeight || '1.2';
  const marginBottom = '16px';
  
  if (!text) return '';
  
  return `
    <h1 style="margin: 0 0 ${marginBottom} 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align}; word-wrap: break-word; overflow-wrap: break-word; width: 100%; max-width: 100%;">
      ${escapeHtml(text)}
    </h1>
  `;
}

/**
 * Render divider line
 */
export function renderLayoutDivider(dividerContent: any, settings: any): string {
  const color = dividerContent?.color || settings.dividerColor || DEFAULT_COLORS.BORDER;
  const thickness = dividerContent?.thickness || settings.dividerThickness || 1;
  const width = dividerContent?.width || settings.dividerWidth || '60px';
  const align = settings.align || 'center';
  const marginTop = '20px';
  const marginBottom = '20px';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding-top: ${marginTop}; padding-bottom: ${marginBottom};">
          <div style="width: ${width}; height: 0; border-top: ${thickness}px solid ${color}; margin: 0 auto;"></div>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Render paragraph/body text
 */
export function renderLayoutParagraph(paragraphContent: any, settings: any): string {
  const text = typeof paragraphContent === 'string' ? paragraphContent : paragraphContent.text || '';
  const fontSize = paragraphContent.fontSize || settings.paragraphFontSize || DEFAULT_FONT_SIZES.BODY;
  const fontWeight = paragraphContent.fontWeight || settings.paragraphFontWeight || DEFAULT_FONT_WEIGHTS.NORMAL;
  const color = paragraphContent.color || settings.paragraphColor || DEFAULT_COLORS.TEXT;
  const align = settings.align || 'center';
  const lineHeight = paragraphContent.lineHeight || '1.6';
  const marginBottom = '24px';
  
  if (!text) return '';
  
  return `
    <p style="margin: 0 0 ${marginBottom} 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align}; word-wrap: break-word; overflow-wrap: break-word; width: 100%; max-width: 100%;">
      ${escapeHtml(text)}
    </p>
  `;
}

/**
 * Render button/CTA
 */
export function renderLayoutButton(buttonContent: any, settings: any, context: RenderContext): string {
  const text = buttonContent.text || 'Click Here';
  const url = buttonContent.url || '#';
  const backgroundColor = buttonContent.backgroundColor || settings.buttonBackgroundColor || '#7c3aed';
  const textColor = buttonContent.textColor || settings.buttonTextColor || DEFAULT_COLORS.BUTTON_TEXT;
  const fontSize = buttonContent.fontSize || settings.buttonFontSize || DEFAULT_FONT_SIZES.BODY;
  const fontWeight = buttonContent.fontWeight || settings.buttonFontWeight || DEFAULT_FONT_WEIGHTS.SEMIBOLD;
  const borderRadius = buttonContent.borderRadius || settings.buttonBorderRadius || DEFAULT_BORDER_RADIUS.MEDIUM;
  const paddingVertical = buttonContent.paddingVertical || 14;
  const paddingHorizontal = buttonContent.paddingHorizontal || 32;
  const align = settings.align || 'center';
  
  if (!text) return '';
  
  // Replace merge tags in URL
  const processedUrl = context.mergeTags
    ? Object.entries(context.mergeTags).reduce(
        (url, [key, value]) => url.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value),
        url
      )
    : url;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding-top: 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-radius: ${borderRadius}; background-color: ${backgroundColor};">
                <a href="${processedUrl}" style="display: inline-block; padding: ${paddingVertical}px ${paddingHorizontal}px; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${textColor}; text-decoration: none; border-radius: ${borderRadius};">
                  ${escapeHtml(text)}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Layout Container Wrappers
// ============================================================================

/**
 * Wrap layout child elements in container with background and padding
 */
export function wrapLayoutContainer(childHtml: string, backgroundColor: string, padding: any): string {
  const bgColor = backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : '';
  const pt = padding?.top || 40;
  const pr = padding?.right || 20;
  const pb = padding?.bottom || 40;
  const pl = padding?.left || 20;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"${bgColor ? ` style="background-color: ${bgColor};"` : ''}>
      <tr>
        <td style="padding: ${pt}px ${pr}px ${pb}px ${pl}px;">
          ${childHtml}
        </td>
      </tr>
    </table>
  `;
}

