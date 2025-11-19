/**
 * Layout Helper Functions
 * 
 * Helper functions for rendering layout elements and calculating dimensions
 * Now uses design token system for consistent styling
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

import {
  designTokens,
  getSpacingToken,
  getColorToken,
  getTypographyToken,
  pxToNumber,
} from '../../design-tokens';

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
export function renderLayoutImage(image: any, settings: any, width?: number, blockId?: string, contentKey?: string): string {
  const imageWidth = width || EMAIL_DIMENSIONS.MAX_WIDTH;
  const imageHeight = Math.floor(imageWidth * EMAIL_DIMENSIONS.IMAGE_ASPECT_RATIO);
  const imageUrl = image.url || '';
  const processedUrl = imageUrl 
    ? processImageUrl(imageUrl, 'image') 
    : getPlaceholderImage(imageWidth, imageHeight, 'image');
  const borderRadius = settings.borderRadius || DEFAULT_BORDER_RADIUS.MEDIUM;
  
  const dataAttrs = blockId && contentKey
    ? ` data-element-id="${blockId}-${contentKey}" data-element-type="image" data-block-id="${blockId}"`
    : '';
  
  return `
    <img${dataAttrs} src="${escapeHtml(processedUrl)}" alt="${escapeHtml(image.altText || '')}" 
      width="${imageWidth}"
      style="display: block; width: ${imageWidth}px; max-width: ${imageWidth}px; height: auto; border-radius: ${borderRadius};" />
  `;
}

/**
 * Render header text (small eyebrow text above title)
 * Now uses semantic typography tokens
 */
export function renderLayoutHeader(headerContent: any, settings: any, blockId?: string, contentKey?: string): string {
  const text = typeof headerContent === 'string' ? headerContent : headerContent.text || '';
  const labelStyle = getTypographyToken('label.default');
  const fontSize = headerContent.fontSize || labelStyle.size;
  const fontWeight = headerContent.fontWeight || labelStyle.weight;
  const color = headerContent.color || getColorToken('text.secondary');
  const align = settings.align || 'center';
  const marginBottom = getSpacingToken('content.balanced');
  
  if (!text) return '';
  
  const dataAttrs = blockId && contentKey 
    ? ` data-element-id="${blockId}-${contentKey}" data-element-type="header" data-block-id="${blockId}"`
    : '';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding-bottom: ${marginBottom};">
          <p${dataAttrs} style="margin: 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em;">
            ${escapeHtml(text)}
          </p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Render title/headline text
 * Now uses semantic typography tokens
 */
export function renderLayoutTitle(titleContent: any, settings: any, blockId?: string, contentKey?: string): string {
  const text = typeof titleContent === 'string' ? titleContent : titleContent.text || '';
  const headingStyle = getTypographyToken('heading.primary');
  const fontSize = titleContent.fontSize || headingStyle.size;
  const fontWeight = titleContent.fontWeight || headingStyle.weight;
  const color = titleContent.color || getColorToken('text.primary');
  const align = settings.align || 'center';
  const lineHeight = titleContent.lineHeight || headingStyle.lineHeight.toString();
  const marginBottom = getSpacingToken('content.balanced');
  
  if (!text) return '';
  
  const dataAttrs = blockId && contentKey 
    ? ` data-element-id="${blockId}-${contentKey}" data-element-type="title" data-block-id="${blockId}"`
    : '';
  
  return `
    <h1${dataAttrs} style="margin: 0 0 ${marginBottom} 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align}; word-wrap: break-word; overflow-wrap: break-word; width: 100%; max-width: 100%;">
      ${escapeHtml(text)}
    </h1>
  `;
}

/**
 * Render divider line
 * Now uses semantic color tokens
 */
export function renderLayoutDivider(dividerContent: any, settings: any): string {
  const color = dividerContent?.color || getColorToken('border.default');
  const thickness = dividerContent?.thickness || 1;
  const width = dividerContent?.width || '60px';
  const align = settings.align || 'center';
  const marginTop = getSpacingToken('content.relaxed');
  const marginBottom = getSpacingToken('content.relaxed');
  
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
 * Now uses semantic typography tokens
 */
export function renderLayoutParagraph(paragraphContent: any, settings: any, blockId?: string, contentKey?: string): string {
  const text = typeof paragraphContent === 'string' ? paragraphContent : paragraphContent.text || '';
  const bodyStyle = getTypographyToken('body.standard');
  const fontSize = paragraphContent.fontSize || bodyStyle.size;
  const fontWeight = paragraphContent.fontWeight || bodyStyle.weight;
  const color = paragraphContent.color || getColorToken('text.secondary');
  const align = settings.align || 'center';
  const lineHeight = paragraphContent.lineHeight || bodyStyle.lineHeight.toString();
  const marginBottom = getSpacingToken('content.relaxed');
  
  if (!text) return '';
  
  const dataAttrs = blockId && contentKey 
    ? ` data-element-id="${blockId}-${contentKey}" data-element-type="paragraph" data-block-id="${blockId}"`
    : '';
  
  return `
    <p${dataAttrs} style="margin: 0 0 ${marginBottom} 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align}; word-wrap: break-word; overflow-wrap: break-word; width: 100%; max-width: 100%;">
      ${escapeHtml(text)}
    </p>
  `;
}

/**
 * Render button/CTA
 * Now uses semantic button component tokens
 */
export function renderLayoutButton(buttonContent: any, settings: any, context: RenderContext, blockId?: string, contentKey?: string): string {
  const text = buttonContent.text || 'Click Here';
  const url = buttonContent.url || '#';
  const buttonTokens = designTokens.component.button;
  const backgroundColor = buttonContent.backgroundColor || buttonTokens.primary.background;
  const textColor = buttonContent.textColor || buttonTokens.primary.text;
  const fontSize = buttonContent.fontSize || buttonTokens.fontSize;
  const fontWeight = buttonContent.fontWeight || buttonTokens.fontWeight;
  const borderRadius = buttonContent.borderRadius || buttonTokens.borderRadius;
  const paddingVertical = buttonContent.paddingVertical || pxToNumber(buttonTokens.paddingY);
  const paddingHorizontal = buttonContent.paddingHorizontal || pxToNumber(buttonTokens.paddingX);
  const align = settings.align || 'center';
  
  if (!text) return '';
  
  // Replace merge tags in URL
  const processedUrl = context.mergeTags
    ? Object.entries(context.mergeTags).reduce(
        (url, [key, value]) => url.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value),
        url
      )
    : url;
  
  const dataAttrs = blockId && contentKey 
    ? ` data-element-id="${blockId}-${contentKey}" data-element-type="button" data-block-id="${blockId}"`
    : '';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding-top: ${getSpacingToken('content.tight')};">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-radius: ${borderRadius}; background-color: ${backgroundColor};">
                <a${dataAttrs} href="${processedUrl}" style="display: inline-block; padding: ${paddingVertical}px ${paddingHorizontal}px; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${textColor}; text-decoration: none; border-radius: ${borderRadius};">
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

