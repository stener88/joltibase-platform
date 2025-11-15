/**
 * Email Block Renderer
 * 
 * Renders blocks to email-safe HTML using table-based layouts.
 * All HTML is tested for Gmail, Outlook, Apple Mail, and other major email clients.
 */

import type {
  EmailBlock,
  LogoBlock,
  SpacerBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SocialLinksBlock,
  FooterBlock,
  GlobalEmailSettings,
} from './types';

// ============================================================================
// Image Placeholder Helpers
// ============================================================================

/**
 * Replace merge tag URLs with placeholders for visual editor
 * Also handles invalid/broken URLs (like example.com) to prevent flickering
 */
function processImageUrl(url: string, type: 'logo' | 'image' | 'hero' = 'image'): string {
  // Check if URL is a merge tag placeholder
  if (/^\{\{.+\}\}$/.test(url)) {
    return getPlaceholderImage(600, 400, type === 'hero' ? 'image' : type);
  }
  
  // Check for invalid/broken URLs that should be replaced with placeholders
  // This prevents flickering from broken image links
  if (url && typeof url === 'string') {
    const lowerUrl = url.toLowerCase();
    // Detect example.com URLs and other obviously invalid patterns
    if (
      lowerUrl.includes('example.com') ||
      lowerUrl.includes('placeholder.com') ||
      lowerUrl === 'url' ||
      lowerUrl === 'image' ||
      lowerUrl === 'logo'
    ) {
      return getPlaceholderImage(600, 400, type === 'hero' ? 'image' : type);
    }
  }
  
  return url;
}

/**
 * Get placeholder avatar image (circular SVG)
 */
function getPlaceholderAvatar(): string {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <circle cx="32" cy="32" r="32" fill="#e5e7eb"/>
      <circle cx="32" cy="28" r="10" fill="#9ca3af"/>
      <path d="M16 50 Q32 40 48 50" stroke="#9ca3af" stroke-width="2" fill="none"/>
    </svg>
  `)}`;
}

/**
 * Validate and process avatar URL - returns placeholder if invalid
 */
function processAvatarUrl(url: string | null | undefined): string {
  if (!url) {
    return getPlaceholderAvatar();
  }
  
  // Check if URL is a merge tag placeholder
  if (/^\{\{.+\}\}$/.test(url)) {
    return getPlaceholderAvatar();
  }
  
  // Check if URL looks invalid (contains "fake", not a valid URL format)
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('fake') || lowerUrl.includes('placeholder') || lowerUrl === 'url' || lowerUrl === 'avatar') {
    return getPlaceholderAvatar();
  }
  
  // Basic URL validation - must start with http:// or https:// or data:
  if (!/^(https?:\/\/|data:)/i.test(url)) {
    return getPlaceholderAvatar();
  }
  
  return url;
}

// ============================================================================
// Main Renderer
// ============================================================================

export interface RenderContext {
  globalSettings: GlobalEmailSettings;
  mergeTags?: Record<string, string>;
}

/**
 * Render a single block to email-safe HTML
 */
export function renderBlock(block: EmailBlock, context: RenderContext): string {
  switch (block.type) {
    case 'logo':
      return renderLogoBlock(block as LogoBlock, context);
    case 'spacer':
      return renderSpacerBlock(block as SpacerBlock);
    // Legacy heading block removed (merged into text block)
    // case 'heading': return renderHeadingBlock(block as HeadingBlock);
    case 'text':
      return renderTextBlock(block as TextBlock);
    case 'image':
      return renderImageBlock(block as ImageBlock);
    case 'button':
      return renderButtonBlock(block as ButtonBlock, context);
    case 'divider':
      return renderDividerBlock(block as DividerBlock);
    // Legacy blocks removed from registry (now handled as layout variations):
    // case 'hero': return renderHeroBlock(block as HeroBlock);
    // case 'stats': return renderStatsBlock(block as StatsBlock);
    // case 'testimonial': return renderTestimonialBlock(block as TestimonialBlock);
    // case 'feature-grid': return renderFeatureGridBlock(block as FeatureGridBlock);
    // case 'comparison': return renderComparisonBlock(block as ComparisonBlock);
    case 'social-links':
      return renderSocialLinksBlock(block as SocialLinksBlock);
    case 'footer':
      return renderFooterBlock(block as FooterBlock, context);
    // V2 blocks - New implementations
    case 'link-bar':
      return `<p style="padding: 20px; text-align: center; color: #666;">Link Bar - rendering coming soon</p>`;
    case 'address':
      return `<p style="padding: 20px; text-align: center; color: #666;">Address Block - rendering coming soon</p>`;
    case 'layouts':
      return renderLayoutBlock(block, context);
    default:
      return '';
  }
}

/**
 * Render array of blocks to complete email HTML
 */
export function renderBlocksToEmail(
  blocks: EmailBlock[],
  globalSettings: GlobalEmailSettings,
  mergeTags?: Record<string, string>
): string {
  const context: RenderContext = { globalSettings, mergeTags };
  
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
  
  // Render all blocks
  const blocksHtml = sortedBlocks
    .map(block => renderBlock(block, context))
    .join('\n');
  
  // Wrap in email structure
  return wrapInEmailStructure(blocksHtml, globalSettings);
}

// ============================================================================
// Individual Block Renderers
// ============================================================================

/**
 * 1. Logo Block
 */
function renderLogoBlock(block: LogoBlock, context: RenderContext): string {
  const { settings, content } = block;
  const { align, width, height, backgroundColor, padding } = settings;
  
  // Use placeholder if no image URL is provided
  const imageUrl = content.imageUrl || '';
  const processedUrl = imageUrl ? processImageUrl(imageUrl, 'logo') : getPlaceholderImage(parseInt(width) || 200, parseInt(height || '80'), 'logo');
  
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

/**
 * 2. Spacer Block
 */
function renderSpacerBlock(block: SpacerBlock): string {
  const { settings } = block;
  const { height, backgroundColor } = settings;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="height: ${height}px; line-height: ${height}px; font-size: ${height}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">&nbsp;</td>
      </tr>
    </table>`;
}

/**
 * 3. Text Block
 */
function renderTextBlock(block: TextBlock): string {
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

/**
 * 4. Image Block (supports single images and grids)
 */
function renderImageBlock(block: ImageBlock): string {
  const { settings, content } = block;
  const { align, width, borderRadius, padding, columns, aspectRatio, gap, backgroundColor } = settings;
  
  // Legacy single image support
  if (content.imageUrl && !content.images?.length) {
    const imageUrl = content.imageUrl || '';
    const processedUrl = imageUrl ? processImageUrl(imageUrl, 'image') : getPlaceholderImage(600, 400, 'image');
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
    const placeholderUrl = getPlaceholderImage(600, 400, 'image');
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor && backgroundColor !== 'transparent' ? ` background-color: ${backgroundColor};` : ''}">
            <img src="${placeholderUrl}" alt="Placeholder" width="600" style="display: block; width: 600px; height: auto; border: none;${borderRadius ? ` border-radius: ${borderRadius};` : ''}" />
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
      const processedUrl = imageUrl ? processImageUrl(imageUrl, 'image') : getPlaceholderImage(600, 400, 'image');
      
      // Use fixed pixel widths for cells and images
      const cellWidthPx = cols === 1 ? 600 : cols === 2 ? 290 : 190;
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

/**
 * 5. Button Block (Bulletproof)
 */
function renderButtonBlock(block: ButtonBlock, context: RenderContext): string {
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

/**
 * 6. Divider Block
 */
function renderDividerBlock(block: DividerBlock): string {
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

/**
 * 7. Social Links Block
 */
function renderSocialLinksBlock(block: SocialLinksBlock): string {
  const { settings, content } = block;
  const { align, iconSize, spacing, iconStyle, iconColor, padding, backgroundColor } = settings;
  
  // Ensure spacing has a proper default
  const iconSpacing = spacing || 24;
  const halfSpacing = Math.floor(iconSpacing / 2);
  
  const socialIcons = (content.links || []).map((link, index) => {
    const iconUrl = getSocialIconUrl(link.platform, iconStyle, iconColor);
    
    return `
      <td style="padding: 0 ${halfSpacing}px; vertical-align: middle;">
        <a href="${escapeHtml(link.url || '')}" style="text-decoration: none; display: inline-block;">
          <img src="${iconUrl}" alt="${link.platform}" width="${iconSize}" height="${iconSize}" style="display: block; border: none;" />
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

/**
 * 8. Footer Block
 */
function renderFooterBlock(block: FooterBlock, context: RenderContext): string {
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
  
  const linkStyle = `color: ${linkColor || textColor}; text-decoration: underline;`;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">
          <p style="margin: 0 0 8px; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            <strong>${escapeHtml(content.companyName || '')}</strong>
          </p>
          ${content.companyAddress ? `
          <p style="margin: 0 0 8px; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            ${escapeHtml(content.companyAddress)}
          </p>` : ''}
          ${content.customText ? `
          <p style="margin: 0 0 12px; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            ${escapeHtml(content.customText)}
          </p>` : ''}
          <p style="margin: 0; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
            <a href="${escapeHtml(unsubscribeUrl)}" style="${linkStyle}">Unsubscribe</a>
            ${preferencesUrl ? ` | <a href="${escapeHtml(preferencesUrl)}" style="${linkStyle}">Preferences</a>` : ''}
          </p>
        </td>
      </tr>
    </table>`;
}

// ============================================================================
// LAYOUT BLOCK RENDERING (V2)
// ============================================================================

/**
 * Calculate fixed pixel widths for columns
 * Assumes 600px max email width with 20px gap between columns
 */
interface ColumnWidths {
  left: string;
  right: string;
  leftPx: number;
  rightPx: number;
}

function calculateColumnWidths(variation: string): ColumnWidths {
  const totalWidth = 600;
  const gap = 20;
  
  let leftPx: number;
  let rightPx: number;
  
  switch (variation) {
    case 'two-column-60-40':
      leftPx = 360;
      rightPx = 220;
      break;
    case 'two-column-40-60':
      leftPx = 220;
      rightPx = 360;
      break;
    case 'two-column-70-30':
      leftPx = 420;
      rightPx = 160;
      break;
    case 'two-column-30-70':
      leftPx = 160;
      rightPx = 420;
      break;
    case 'two-column-50-50':
    default:
      leftPx = 290;
      rightPx = 290;
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
function calculateMultiColumnWidth(columns: number): { width: string; widthPx: number } {
  const totalWidth = 600;
  const gapPerColumn = 20;
  const totalGaps = (columns - 1) * gapPerColumn;
  const widthPx = Math.floor((totalWidth - totalGaps) / columns);
  
  return {
    width: `${widthPx}px`,
    widthPx,
  };
}

/**
 * Render Layout Block with flexible child elements
 * Supports all 60+ layout variations with configurable elements
 */
function renderLayoutBlock(block: EmailBlock, context: RenderContext): string {
  const variation = (block as any).layoutVariation || 'unknown';
  const settings = block.settings || {};
  const content = block.content || {};
  
  // Route to variation-specific renderer
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
    // New layout variations
    case 'image-overlay':
      return renderImageOverlayLayout(content, settings, context);
    case 'card-centered':
      return renderCardCenteredLayout(content, settings, context);
    case 'compact-image-text':
      return renderCompactImageTextLayout(content, settings, context);
    case 'two-column-text':
      return renderTwoColumnTextLayout(content, settings, context);
    case 'magazine-feature':
      return renderMagazineFeatureLayout(content, settings, context);
    default:
      return renderGenericLayout(content, settings, context);
  }
}

/**
 * Render Hero Center Layout
 * Vertically stacked: header, title, divider, paragraph, button
 */
function renderHeroCenterLayout(content: any, settings: any, context: RenderContext): string {
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

/**
 * Render Two Column Layout - FIXED WIDTH
 * Image on one side, content (title, paragraph, button) on other
 */
function renderTwoColumnLayout(variation: string, content: any, settings: any, context: RenderContext): string {
  // Calculate fixed pixel widths for columns
  const widths = calculateColumnWidths(variation);
  
  // Determine which column gets the image and text
  const imageColumnWidth = settings.flip ? widths.rightPx : widths.leftPx;
  const textColumnWidth = settings.flip ? widths.leftPx : widths.rightPx;
  
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
  
  // Build image column with fixed width
  const imageHtml = content.image?.url 
    ? renderLayoutImage(content.image, settings, imageColumnWidth)
    : `<img src="${getPlaceholderImage(imageColumnWidth, Math.floor(imageColumnWidth * 0.67), 'image')}" alt="Placeholder" width="${imageColumnWidth}" style="display: block; width: ${imageColumnWidth}px; max-width: ${imageColumnWidth}px; height: auto; border-radius: 8px;" />`;
  
  // Wrap text content in a fixed-width container
  const textColumnHtml = textElements.length > 0 
    ? `<div style="width: ${textColumnWidth}px; max-width: ${textColumnWidth}px; word-wrap: break-word; overflow-wrap: break-word;">${textElements.join('\n')}</div>`
    : `<div style="width: ${textColumnWidth}px; max-width: ${textColumnWidth}px;"><p style="color: #9ca3af; font-size: 14px;">Add content in settings</p></div>`;
  
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

/**
 * Render Stats Layout - FIXED WIDTH
 * Multi-column layout with value, title, description items
 */
function renderStatsLayout(variation: string, content: any, settings: any, context: RenderContext): string {
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

/**
 * Render image-overlay layout (Attachment 1)
 * Full-width background image with text overlay
 */
function renderImageOverlayLayout(content: any, settings: any, context: RenderContext): string {
  const imageUrl = content.image?.url || '';
  const processedUrl = imageUrl ? processImageUrl(imageUrl, 'image') : getPlaceholderImage(600, 400, 'image');
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

/**
 * Render card-centered layout (Attachment 2)
 * Centered card with large number, text, divider, and button
 */
function renderCardCenteredLayout(content: any, settings: any, context: RenderContext): string {
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

/**
 * Render compact-image-text layout (Attachment 3) - FIXED WIDTH
 * Small image on left, two text elements stacked on right
 */
function renderCompactImageTextLayout(content: any, settings: any, context: RenderContext): string {
  const imageUrl = content.image?.url || '';
  const processedUrl = imageUrl ? processImageUrl(imageUrl, 'image') : getPlaceholderImage(200, 200, 'image');
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
              <td width="200" valign="top" style="width: 200px;">
                <img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.image?.altText || '')}" 
                  width="200"
                  style="display: block; width: 200px; height: auto; border-radius: ${borderRadius}; border: 1px solid #e5e7eb;" />
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

/**
 * Render two-column-text layout - FIXED WIDTH
 * Two columns of text side-by-side with no images
 */
function renderTwoColumnTextLayout(content: any, settings: any, context: RenderContext): string {
  const leftColumn = content.leftColumn || '';
  const rightColumn = content.rightColumn || '';
  
  const backgroundColor = settings.backgroundColor || 'transparent';
  const textColor = settings.paragraphColor || '#374151';
  const fontSize = settings.paragraphFontSize || '16px';
  const lineHeight = '1.6';
  
  // Fixed width columns: 290px each with 20px gap
  const columnWidth = '290px';
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
      <tr>
        <td style="padding: ${settings.padding?.top || 40}px ${settings.padding?.right || 20}px ${settings.padding?.bottom || 40}px ${settings.padding?.left || 20}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
            <tr>
              <td width="${columnWidth}" valign="top" style="width: ${columnWidth}; max-width: ${columnWidth}; min-width: ${columnWidth}; padding-right: 10px; word-wrap: break-word;">
                <p style="margin: 0; font-size: ${fontSize}; color: ${textColor}; line-height: ${lineHeight};">
                  ${escapeHtml(leftColumn)}
                </p>
              </td>
              <td width="${columnWidth}" valign="top" style="width: ${columnWidth}; max-width: ${columnWidth}; min-width: ${columnWidth}; padding-left: 10px; word-wrap: break-word;">
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

/**
 * Render magazine-feature layout
 * Vertical layout: title on top, centered square image with number overlay, description below
 */
function renderMagazineFeatureLayout(content: any, settings: any, context: RenderContext): string {
  const imageUrl = content.image?.url || '';
  const processedUrl = imageUrl ? processImageUrl(imageUrl, 'image') : getPlaceholderImage(500, 500, 'image');
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

/**
 * Generic layout renderer (fallback for unknown variations)
 */
function renderGenericLayout(content: any, settings: any, context: RenderContext): string {
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

/**
 * Render layout image - FIXED WIDTH
 * Accepts optional width parameter for nested images in columns
 */
function renderLayoutImage(image: any, settings: any, width?: number): string {
  const imageWidth = width || 600;
  const imageHeight = Math.floor(imageWidth * 0.67); // Maintain aspect ratio
  const imageUrl = image.url || '';
  const processedUrl = imageUrl ? processImageUrl(imageUrl, 'image') : getPlaceholderImage(imageWidth, imageHeight, 'image');
  const borderRadius = settings.borderRadius || '8px';
  
  return `
    <img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(image.altText || '')}" 
      width="${imageWidth}"
      style="display: block; width: ${imageWidth}px; max-width: ${imageWidth}px; height: auto; border-radius: ${borderRadius};" />
  `;
}

/**
 * Render header text (small eyebrow text above title)
 */
function renderLayoutHeader(headerContent: any, settings: any): string {
  const text = typeof headerContent === 'string' ? headerContent : headerContent.text || '';
  const fontSize = headerContent.fontSize || settings.headerFontSize || '14px';
  const fontWeight = headerContent.fontWeight || settings.headerFontWeight || 600;
  const color = headerContent.color || settings.headerColor || '#6b7280';
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
function renderLayoutTitle(titleContent: any, settings: any): string {
  const text = typeof titleContent === 'string' ? titleContent : titleContent.text || '';
  const fontSize = titleContent.fontSize || settings.titleFontSize || '48px';
  const fontWeight = titleContent.fontWeight || settings.titleFontWeight || 700;
  const color = titleContent.color || settings.titleColor || '#111827';
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
function renderLayoutDivider(dividerContent: any, settings: any): string {
  const color = dividerContent?.color || settings.dividerColor || '#e5e7eb';
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
function renderLayoutParagraph(paragraphContent: any, settings: any): string {
  const text = typeof paragraphContent === 'string' ? paragraphContent : paragraphContent.text || '';
  const fontSize = paragraphContent.fontSize || settings.paragraphFontSize || '16px';
  const fontWeight = paragraphContent.fontWeight || settings.paragraphFontWeight || 400;
  const color = paragraphContent.color || settings.paragraphColor || '#374151';
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
function renderLayoutButton(buttonContent: any, settings: any, context: RenderContext): string {
  const text = buttonContent.text || 'Click Here';
  const url = buttonContent.url || '#';
  const backgroundColor = buttonContent.backgroundColor || settings.buttonBackgroundColor || '#7c3aed';
  const textColor = buttonContent.textColor || settings.buttonTextColor || '#ffffff';
  const fontSize = buttonContent.fontSize || settings.buttonFontSize || '16px';
  const fontWeight = buttonContent.fontWeight || settings.buttonFontWeight || 600;
  const borderRadius = buttonContent.borderRadius || settings.buttonBorderRadius || '8px';
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

/**
 * Wrap layout child elements in container with background and padding
 */
function wrapLayoutContainer(childHtml: string, backgroundColor: string, padding: any): string {
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

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Generate a placeholder image data URL (SVG)
 */
function getPlaceholderImage(width = 600, height = 400, type: 'logo' | 'image' = 'image'): string {
  const bgColor = type === 'logo' ? '#f3f4f6' : '#e5e7eb';
  const iconColor = type === 'logo' ? '#9ca3af' : '#9ca3af';
  const icon = type === 'logo' 
    ? `<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14.414M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
    : `<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14.414M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bgColor}"/>
    <g transform="translate(${width / 2 - 32}, ${height / 2 - 32})">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="1.5">
        ${icon}
      </svg>
    </g>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Get Outlook VML arcsize from border-radius
 */
function getOutlookArcsize(borderRadius: string): string {
  const px = parseInt(borderRadius);
  if (px <= 4) return '10%';
  if (px <= 8) return '20%';
  if (px >= 24) return '50%';
  return '15%';
}

/**
 * Get social media icon URL (data URI with SVG)
 */
function getSocialIconUrl(platform: string, style: string, color?: string | null): string {
  const iconColor = color || '#6b7280';
  const size = 32;
  
  // Define SVG paths for each platform
  const icons: Record<string, string> = {
    facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tiktok: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    pinterest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
  };
  
  const platformLower = platform.toLowerCase();
  const svgContent = icons[platformLower] || icons['email']; // Fallback to email icon
  
  // Return as data URI
  return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
}

/**
 * Wrap blocks in complete email HTML structure
 */
function wrapInEmailStructure(blocksHtml: string, globalSettings: GlobalEmailSettings): string {
  const { backgroundColor, contentBackgroundColor, maxWidth, fontFamily } = globalSettings;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=600">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      <o:AllowPNG/>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
    /* Fixed width layout - NO responsiveness */
    body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      min-width: 600px !important;
    }
    table {
      table-layout: fixed !important;
    }
    /* Prevent any responsive behavior */
    img {
      -ms-interpolation-mode: bicubic;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: ${fontFamily}; background-color: ${backgroundColor};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" class="desktop-padding" style="padding: 20px;">
        <!--[if mso]>
        <table align="center" width="${maxWidth}" cellpadding="0" cellspacing="0"><tr><td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: ${maxWidth}px; background-color: ${contentBackgroundColor};">
          ${blocksHtml}
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

