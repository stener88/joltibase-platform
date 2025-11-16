/**
 * Simple Block Renderers
 * 
 * Renders basic content blocks: logo, spacer, text, image, button, divider
 */

import type {
  LogoBlock,
  SpacerBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
} from '../types';

import type { RenderContext } from './index';

import {
  escapeHtml,
  processImageUrl,
  getPlaceholderImage,
} from './utils';

import {
  EMAIL_DIMENSIONS,
  COLUMN_WIDTHS,
  PLACEHOLDER_DIMENSIONS,
} from '../constants';

// ============================================================================
// Logo Block
// ============================================================================

/**
 * Render Logo Block
 */
export function renderLogoBlock(block: LogoBlock, context: RenderContext): string {
  const { settings, content } = block;
  const { align, width, height, backgroundColor, padding } = settings;
  
  // Use placeholder if no image URL is provided
  const imageUrl = content.imageUrl || '';
  const processedUrl = imageUrl 
    ? processImageUrl(imageUrl, 'logo') 
    : getPlaceholderImage(
        parseInt(width) || PLACEHOLDER_DIMENSIONS.LOGO.WIDTH, 
        parseInt(height || String(PLACEHOLDER_DIMENSIONS.LOGO.HEIGHT)), 
        'logo'
      );
  
  const isPlaceholder = /^\{\{.+\}\}$/.test(imageUrl);
  const minHeight = isPlaceholder ? ' min-height: 80px;' : '';
  const imgHtml = `<img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.altText || '')}" width="${width}" ${height ? `height="${height}"` : ''} style="display: block; width: ${width}; height: ${height || 'auto'}; border: none;${minHeight}" />`;
  
  const imageContent = content.linkUrl
    ? `<a href="${escapeHtml(content.linkUrl)}" style="text-decoration: none;">${imgHtml}</a>`
    : imgHtml;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0;">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">
          ${imageContent}
        </td>
      </tr>
    </table>`;
}

// ============================================================================
// Spacer Block
// ============================================================================

/**
 * Render Spacer Block
 */
export function renderSpacerBlock(block: SpacerBlock): string {
  const { settings } = block;
  const { height, backgroundColor } = settings;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="height: ${height}px; line-height: ${height}px; font-size: ${height}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">&nbsp;</td>
      </tr>
    </table>`;
}

// ============================================================================
// Text Block
// ============================================================================

/**
 * Render Text Block
 */
export function renderTextBlock(block: TextBlock): string {
  const { settings, content } = block;
  const { fontSize, fontWeight, color, align, backgroundColor, padding, lineHeight, fontFamily } = settings;
  
  const fontFamilyStyle = fontFamily ? ` font-family: ${fontFamily};` : '';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">
          <p style="margin: 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align};${fontFamilyStyle} word-wrap: break-word; overflow-wrap: break-word;">
            ${content.text || ''}
          </p>
        </td>
      </tr>
    </table>`;
}

// ============================================================================
// Image Block
// ============================================================================

/**
 * Render Image Block (supports single images and grids)
 */
export function renderImageBlock(block: ImageBlock): string {
  const { settings, content } = block;
  const { align, width, borderRadius, padding, columns, aspectRatio, gap, backgroundColor } = settings;
  
  // Legacy single image support
  if (content.imageUrl && !content.images?.length) {
    const imageUrl = content.imageUrl || '';
    const processedUrl = imageUrl 
      ? processImageUrl(imageUrl, 'image') 
      : getPlaceholderImage(EMAIL_DIMENSIONS.MAX_WIDTH, PLACEHOLDER_DIMENSIONS.IMAGE.HEIGHT, 'image');
    const isPlaceholder = /^\{\{.+\}\}$/.test(imageUrl);
    const minHeight = isPlaceholder ? ' min-height: 200px;' : '';
    const imgStyle = `display: block; width: ${width}; height: auto; border: none;${minHeight}${borderRadius ? ` border-radius: ${borderRadius};` : ''}`;
    const imgHtml = `<img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.altText || '')}" width="${width}" style="${imgStyle}" />`;
    
    const imageContent = content.linkUrl
      ? `<a href="${escapeHtml(content.linkUrl)}" style="text-decoration: none; display: inline-block;">${imgHtml}</a>`
      : imgHtml;
    
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor && backgroundColor !== 'transparent' ? ` background-color: ${backgroundColor};` : ''}">
            ${imageContent}
            ${content.caption ? `
            <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280; text-align: ${align};">
              ${escapeHtml(content.caption)}
            </p>` : ''}
          </td>
        </tr>
      </table>`;
  }
  
  // New multi-image grid support
  const images = content.images || [];
  if (images.length === 0) {
    const placeholderUrl = getPlaceholderImage(EMAIL_DIMENSIONS.MAX_WIDTH, PLACEHOLDER_DIMENSIONS.IMAGE.HEIGHT, 'image');
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor && backgroundColor !== 'transparent' ? ` background-color: ${backgroundColor};` : ''}">
            <img src="${placeholderUrl}" alt="Placeholder" width="${EMAIL_DIMENSIONS.MAX_WIDTH}" style="display: block; width: ${EMAIL_DIMENSIONS.MAX_WIDTH}px; height: auto; border: none;${borderRadius ? ` border-radius: ${borderRadius};` : ''}" />
          </td>
        </tr>
      </table>`;
  }
  
  const cols = columns || 1;
  const gapPx = gap || 8;
  
  // Build rows of images - FIXED WIDTH per column
  let rowsHtml = '';
  for (let i = 0; i < images.length; i += cols) {
    const rowImages = images.slice(i, i + cols);
    const cellsHtml = rowImages.map((img, idx) => {
      const imageUrl = img.url || '';
      const processedUrl = imageUrl 
        ? processImageUrl(imageUrl, 'image') 
        : getPlaceholderImage(EMAIL_DIMENSIONS.MAX_WIDTH, PLACEHOLDER_DIMENSIONS.IMAGE.HEIGHT, 'image');
      
      // Use fixed pixel widths for cells and images
      const cellWidthPx = cols === 1 ? COLUMN_WIDTHS.FULL : cols === 2 ? COLUMN_WIDTHS.IMAGE_GRID_2COL : COLUMN_WIDTHS.IMAGE_GRID_3COL;
      const cellWidth = `${cellWidthPx}px`;
      const imageWidth = cellWidth;
      
      const paddingRight = idx < rowImages.length - 1 ? `${gapPx}px` : '0';
      const paddingBottom = i + cols < images.length ? `${gapPx}px` : '0';
      
      // Aspect ratio container padding if needed
      let aspectPaddingBottom = '0';
      if (aspectRatio && aspectRatio !== 'auto') {
        const ratios: Record<string, string> = {
          '1:1': '100%',
          '16:9': '56.25%',
          '4:3': '75%',
          '3:4': '133.33%',
          '2:3': '150%',
        };
        aspectPaddingBottom = ratios[aspectRatio] || '0';
      }
      
      const imgHtml = aspectRatio && aspectRatio !== 'auto'
        ? `
          <div style="position: relative; width: ${imageWidth}; padding-bottom: ${aspectPaddingBottom}; overflow: hidden;${borderRadius ? ` border-radius: ${borderRadius};` : ''}">
            <img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(img.altText || '')}" style="position: absolute; top: 0; left: 0; width: ${imageWidth}; max-width: ${imageWidth}; height: 100%; object-fit: cover; border: none;" />
          </div>`
        : `<img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(img.altText || '')}" style="display: block; width: ${imageWidth}; max-width: ${imageWidth}; height: auto; border: none;${borderRadius ? ` border-radius: ${borderRadius};` : ''}" />`;
      
      const imageContent = img.linkUrl
        ? `<a href="${escapeHtml(img.linkUrl)}" style="text-decoration: none; display: block;">${imgHtml}</a>`
        : imgHtml;
      
      return `<td width="${cellWidth}" valign="top" style="width: ${cellWidth}; max-width: ${cellWidth}; min-width: ${cellWidth}; padding-right: ${paddingRight}; padding-bottom: ${paddingBottom};">${imageContent}</td>`;
    }).join('');
    
    rowsHtml += `<tr>${cellsHtml}</tr>`;
  }
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor && backgroundColor !== 'transparent' ? ` background-color: ${backgroundColor};` : ''}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
            ${rowsHtml}
          </table>
        </td>
      </tr>
    </table>`;
}

// ============================================================================
// Button Block
// ============================================================================

/**
 * Render Button Block (Bulletproof)
 */
export function renderButtonBlock(block: ButtonBlock, context: RenderContext): string {
  const { settings, content } = block;
  const { style, color, textColor, align, borderRadius, size, fontWeight, padding, backgroundColor } = settings;
  const containerPadding = settings.containerPadding || { top: 32, right: 40, bottom: 32, left: 40 };
  
  // Size presets
  const sizePresets = {
    small: { fontSize: '14px', padding: { top: 10, right: 20, bottom: 10, left: 20 } },
    medium: { fontSize: '16px', padding: { top: 12, right: 24, bottom: 12, left: 24 } },
    large: { fontSize: '18px', padding: { top: 14, right: 32, bottom: 14, left: 32 } },
  };
  
  const sizePreset = sizePresets[size as keyof typeof sizePresets] || sizePresets.medium;
  const buttonPadding = padding || sizePreset.padding;
  const fontSize = sizePreset.fontSize;
  
  let url = content.url;
  if (context.mergeTags) {
    Object.entries(context.mergeTags).forEach(([key, value]) => {
      url = url.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
  }
  
  const buttonPaddingStr = `${buttonPadding.top}px ${buttonPadding.right}px ${buttonPadding.bottom}px ${buttonPadding.left}px`;
  const bgColor = backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : '';
  
  // Solid button (most common)
  if (style === 'solid') {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${containerPadding.top}px ${containerPadding.right}px ${containerPadding.bottom}px ${containerPadding.left}px;${bgColor ? ` background-color: ${bgColor};` : ''}">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" style="border-radius: ${borderRadius}; background-color: ${color};">
                <a href="${escapeHtml(url)}" style="display: inline-block; padding: ${buttonPaddingStr}; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${textColor}; text-decoration: none; border-radius: ${borderRadius};">
                  ${escapeHtml(content.text)}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }
  
  // Outline button
  if (style === 'outline') {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${containerPadding.top}px ${containerPadding.right}px ${containerPadding.bottom}px ${containerPadding.left}px;${bgColor ? ` background-color: ${bgColor};` : ''}">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" style="border-radius: ${borderRadius}; border: 2px solid ${color}; background-color: transparent;">
                <a href="${escapeHtml(url)}" style="display: inline-block; padding: ${buttonPaddingStr}; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; text-decoration: none; border-radius: ${borderRadius};">
                  ${escapeHtml(content.text)}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }
  
  // Ghost button (text link style)
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${containerPadding.top}px ${containerPadding.right}px ${containerPadding.bottom}px ${containerPadding.left}px;${bgColor ? ` background-color: ${bgColor};` : ''}">
          <a href="${escapeHtml(url)}" style="display: inline-block; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; text-decoration: underline;">
            ${escapeHtml(content.text)}
          </a>
        </td>
      </tr>
    </table>`;
}

// ============================================================================
// Divider Block
// ============================================================================

/**
 * Render Divider Block
 */
export function renderDividerBlock(block: DividerBlock): string {
  const { settings, content } = block;
  const { style, color, thickness, width, padding, align } = settings;
  
  // Decorative divider (emoji or symbol)
  if (style === 'decorative' && content.decorativeElement) {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align || 'center'}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px; font-size: 32px; line-height: 1;">
          ${escapeHtml(content.decorativeElement || '')}
        </td>
      </tr>
    </table>`;
  }
  
  // Line divider
  const borderStyle = style === 'solid' ? 'solid' : style === 'dashed' ? 'dashed' : 'dotted';
  const dividerWidth = width || '100%';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align || 'center'}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          <div style="width: ${dividerWidth}; height: 0; border-top: ${thickness || 1}px ${borderStyle} ${color || '#e5e7eb'}; margin: 0 auto;"></div>
        </td>
      </tr>
    </table>`;
}

