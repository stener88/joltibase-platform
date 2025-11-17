/**
 * Core Layout Block Renderers
 * 
 * Renders main layout blocks: hero, two-column, stats, two-column-text
 */

import type { EmailBlock } from '../types';
import type { RenderContext } from './index';

import {
  escapeHtml,
  processImageUrl,
  getPlaceholderImage,
} from './utils';

import {
  calculateColumnWidths,
  calculateMultiColumnWidth,
  renderLayoutHeader,
  renderLayoutTitle,
  renderLayoutDivider,
  renderLayoutParagraph,
  renderLayoutButton,
  renderLayoutImage,
  wrapLayoutContainer,
} from './layout-helpers';

import {
  EMAIL_DIMENSIONS,
  COLUMN_WIDTHS,
} from '../constants';

// ============================================================================
// Main Layout Block Router
// ============================================================================

/**
 * Render Layout Block with flexible child elements
 * Routes to variation-specific renderer
 */
export function renderLayoutBlock(block: EmailBlock, context: RenderContext): string {
  const variation = (block as any).layoutVariation || 'unknown';
  const settings = block.settings || {};
  const content = block.content || {};
  
  // Try factory-generated renderer first
  const { getFactoryRenderer } = require('./layout-factory');
  const factoryRenderer = getFactoryRenderer(variation);
  if (factoryRenderer) {
    return factoryRenderer(content, settings, context);
  }
  
  // Route to variation-specific renderer (legacy hand-written)
  switch (variation) {
    case 'hero-center':
    case 'hero-image-overlay':
      return renderHeroCenterLayout(content, settings, context);
    case 'two-column-50-50':
    case 'two-column-60-40':
    case 'two-column-40-60':
    case 'two-column-70-30':
    case 'two-column-30-70':
      return renderTwoColumnLayout(variation, content, settings, context);
    case 'stats-2-col':
    case 'stats-3-col':
    case 'stats-4-col':
      return renderStatsLayout(variation, content, settings, context);
    case 'two-column-text':
      return renderTwoColumnTextLayout(content, settings, context);
    // Advanced layouts
    case 'image-overlay':
      return require('./advanced-layouts').renderImageOverlayLayout(content, settings, context);
    case 'card-centered':
      return require('./advanced-layouts').renderCardCenteredLayout(content, settings, context);
    case 'compact-image-text':
      return require('./advanced-layouts').renderCompactImageTextLayout(content, settings, context);
    case 'magazine-feature':
      return require('./advanced-layouts').renderMagazineFeatureLayout(content, settings, context);
    default:
      return renderGenericLayout(content, settings, context);
  }
}

// ============================================================================
// Hero Center Layout
// ============================================================================

/**
 * Render Hero Center Layout
 * Vertically stacked: header, title, divider, paragraph, button
 */
export function renderHeroCenterLayout(content: any, settings: any, context: RenderContext): string {
  const elements: string[] = [];
  
  if (settings.showHeader !== false && content.header) {
    elements.push(renderLayoutHeader(content.header, settings));
  }
  
  if (settings.showTitle !== false && content.title) {
    elements.push(renderLayoutTitle(content.title, settings));
  }
  
  if (settings.showDivider && (content.divider || settings.dividerColor)) {
    elements.push(renderLayoutDivider(content.divider, settings));
  }
  
  if (settings.showParagraph !== false && content.paragraph) {
    elements.push(renderLayoutParagraph(content.paragraph, settings));
  }
  
  if (settings.showButton !== false && content.button) {
    elements.push(renderLayoutButton(content.button, settings, context));
  }
  
  // If no child elements, show a placeholder
  if (elements.length === 0) {
    elements.push(`
      <p style="margin: 0; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
        Hero Layout<br/>
        <span style="font-size: 12px; color: #d1d5db;">Add content in settings</span>
      </p>
    `);
  }
  
  return wrapLayoutContainer(elements.join('\n'), settings.backgroundColor, settings.padding);
}

// ============================================================================
// Two Column Layout
// ============================================================================

/**
 * Render Two Column Layout - FIXED WIDTH
 * Image on one side, content (title, paragraph, button) on other
 */
export function renderTwoColumnLayout(variation: string, content: any, settings: any, context: RenderContext): string {
  // Calculate fixed pixel widths for columns
  const widths = calculateColumnWidths(variation);
  
  // Column gap size (padding between columns)
  const columnGap = 20;
  
  // Determine which column gets the image and text
  const imageColumnWidth = settings.flip ? widths.rightPx : widths.leftPx;
  const textColumnWidth = settings.flip ? widths.leftPx : widths.rightPx;
  
  // Calculate content widths (subtract gap to create spacing)
  const imageContentWidth = imageColumnWidth - columnGap;
  const textContentWidth = textColumnWidth - columnGap;
  
  // Build text column - wrap in a constrained div
  const textElements: string[] = [];
  if (settings.showTitle !== false && content.title) {
    textElements.push(renderLayoutTitle(content.title, { ...settings, align: 'left' }));
  }
  if (settings.showParagraph !== false && content.paragraph) {
    textElements.push(renderLayoutParagraph(content.paragraph, { ...settings, align: 'left' }));
  }
  if (settings.showButton !== false && content.button) {
    textElements.push(renderLayoutButton(content.button, { ...settings, align: 'left' }, context));
  }
  
  // Build image column with fixed width (reduced by gap)
  const imageHtml = content.image?.url 
    ? renderLayoutImage(content.image, settings, imageContentWidth)
    : `<img src="${getPlaceholderImage(imageContentWidth, Math.floor(imageContentWidth * EMAIL_DIMENSIONS.IMAGE_ASPECT_RATIO), 'image')}" alt="Placeholder" width="${imageContentWidth}" style="display: block; width: ${imageContentWidth}px; max-width: ${imageContentWidth}px; height: auto; border-radius: 8px;" />`;
  
  // Wrap text content in a fixed-width container (reduced by gap)
  const textColumnHtml = textElements.length > 0 
    ? `<div style="width: ${textContentWidth}px; max-width: ${textContentWidth}px; word-wrap: break-word; overflow-wrap: break-word;">${textElements.join('\n')}</div>`
    : `<div style="width: ${textContentWidth}px; max-width: ${textContentWidth}px;"><p style="color: #9ca3af; font-size: 14px;">Add content in settings</p></div>`;
  
  // Apply flip if enabled
  const leftContent = settings.flip ? textColumnHtml : imageHtml;
  const rightContent = settings.flip ? imageHtml : textColumnHtml;
  
  const bgColor = settings.backgroundColor || 'transparent';
  const pad = settings.padding || { top: 40, right: 20, bottom: 40, left: 20 };
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${bgColor};">
      <tr>
        <td style="padding: ${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
            <tr>
              <td width="${widths.left}" valign="top" style="width: ${widths.left}; max-width: ${widths.left}; min-width: ${widths.left}; padding-right: ${settings.flip ? 0 : 20}px; word-wrap: break-word; overflow-wrap: break-word; overflow: hidden;">
                ${leftContent}
              </td>
              <td width="${widths.right}" valign="top" style="width: ${widths.right}; max-width: ${widths.right}; min-width: ${widths.right}; padding-left: ${settings.flip ? 20 : 0}px; word-wrap: break-word; overflow-wrap: break-word; overflow: hidden;">
                ${rightContent}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Stats Layout
// ============================================================================

/**
 * Render Stats Layout - FIXED WIDTH
 * Multi-column layout with value, title, description items
 */
export function renderStatsLayout(variation: string, content: any, settings: any, context: RenderContext): string {
  const items = content.items || [];
  const columns = variation === 'stats-2-col' ? 2 :
                  variation === 'stats-3-col' ? 3 : 4;
  
  if (items.length === 0) {
    return wrapLayoutContainer(
      `<p style="margin: 0; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
        Add stats items in settings
      </p>`,
      settings.backgroundColor,
      settings.padding
    );
  }
  
  const titleColor = settings.titleColor || '#111827';
  const paragraphColor = settings.paragraphColor || '#374151';
  
  // Calculate fixed pixel widths for each column
  const columnInfo = calculateMultiColumnWidth(columns);
  const columnWidth = columnInfo.width;
  
  // Build table cells - fixed width, text wraps vertically
  const itemsHtml = items.map((item: any) => `
    <td width="${columnWidth}" valign="top" style="width: ${columnWidth}; max-width: ${columnWidth}; min-width: ${columnWidth}; text-align: center; padding: 0 10px 20px 10px; word-wrap: break-word;">
      <div style="margin-bottom: 8px; font-size: 36px; font-weight: 700; color: ${titleColor}; line-height: 1.2;">
        ${escapeHtml(item.value || '')}
      </div>
      <div style="margin-bottom: 4px; font-size: 16px; font-weight: 600; color: ${paragraphColor}; line-height: 1.4;">
        ${escapeHtml(item.title || '')}
      </div>
      ${item.description ? `
        <div style="font-size: 14px; color: #6b7280; line-height: 1.5; word-wrap: break-word;">
          ${escapeHtml(item.description)}
        </div>
      ` : ''}
    </td>
  `).join('');
  
  const bgColor = settings.backgroundColor || 'transparent';
  const pad = settings.padding || { top: 40, right: 20, bottom: 40, left: 20 };
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${bgColor};">
      <tr>
        <td style="padding: ${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
            <tr>
              ${itemsHtml}
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Two Column Text Layout
// ============================================================================

/**
 * Render two-column-text layout - FIXED WIDTH
 * Two columns of text side-by-side with no images
 */
export function renderTwoColumnTextLayout(content: any, settings: any, context: RenderContext): string {
  const leftColumn = content.leftColumn || '';
  const rightColumn = content.rightColumn || '';
  
  const backgroundColor = settings.backgroundColor || 'transparent';
  const textColor = settings.paragraphColor || '#374151';
  const fontSize = settings.paragraphFontSize || '16px';
  const lineHeight = '1.6';
  
  // Account for padding: 600px container - left padding (20) - right padding (20) - column gap (20) = 540px / 2 = 270px per column
  const padding = settings.padding || { top: 40, right: 20, bottom: 40, left: 20 };
  const availableWidth = 600 - padding.left - padding.right - 20; // 20px gap between columns
  const columnWidth = Math.floor(availableWidth / 2);
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
            <tr>
              <td width="${columnWidth}" valign="top" style="width: ${columnWidth}px; max-width: ${columnWidth}px; padding-right: 10px; word-wrap: break-word;">
                <p style="margin: 0; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
                  ${escapeHtml(leftColumn)}
                </p>
              </td>
              <td width="${columnWidth}" valign="top" style="width: ${columnWidth}px; max-width: ${columnWidth}px; padding-left: 10px; word-wrap: break-word;">
                <p style="margin: 0; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
                  ${escapeHtml(rightColumn)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ============================================================================
// Generic Layout (Fallback)
// ============================================================================

/**
 * Generic layout renderer (fallback for unknown variations)
 */
export function renderGenericLayout(content: any, settings: any, context: RenderContext): string {
  const elements: string[] = [];
  
  if (settings.showHeader !== false && content.header) {
    elements.push(renderLayoutHeader(content.header, settings));
  }
  
  if (settings.showTitle !== false && content.title) {
    elements.push(renderLayoutTitle(content.title, settings));
  }
  
  if (settings.showDivider && (content.divider || settings.dividerColor)) {
    elements.push(renderLayoutDivider(content.divider, settings));
  }
  
  if (settings.showParagraph !== false && content.paragraph) {
    elements.push(renderLayoutParagraph(content.paragraph, settings));
  }
  
  if (settings.showButton !== false && content.button) {
    elements.push(renderLayoutButton(content.button, settings, context));
  }
  
  // If no child elements, show a placeholder
  if (elements.length === 0) {
    elements.push(`
      <p style="margin: 0; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
        Layout<br/>
        <span style="font-size: 12px; color: #d1d5db;">Add content in settings</span>
      </p>
    `);
  }
  
  return wrapLayoutContainer(elements.join('\n'), settings.backgroundColor, settings.padding);
}

