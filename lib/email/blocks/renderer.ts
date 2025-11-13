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
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  HeroBlock,
  StatsBlock,
  TestimonialBlock,
  FeatureGridBlock,
  ComparisonBlock,
  SocialLinksBlock,
  FooterBlock,
  GlobalEmailSettings,
} from './types';

// ============================================================================
// Image Placeholder Helpers
// ============================================================================

/**
 * Generate placeholder image data URI for visual editor
 */
function getPlaceholderImage(type: 'logo' | 'image' | 'hero', width: number = 400, height: number = 300): string {
  const text = type === 'logo' ? 'Add your logo' : 'Add image';
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect fill="#f3f4f6" width="${width}" height="${height}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="16">${text}</text>
    </svg>
  `)}`;
}

/**
 * Replace merge tag URLs with placeholders for visual editor
 * Also handles invalid/broken URLs (like example.com) to prevent flickering
 */
function processImageUrl(url: string, type: 'logo' | 'image' | 'hero' = 'image'): string {
  // Check if URL is a merge tag placeholder
  if (/^\{\{.+\}\}$/.test(url)) {
    return getPlaceholderImage(type);
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
      return getPlaceholderImage(type);
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
    case 'heading':
      return renderHeadingBlock(block as HeadingBlock);
    case 'text':
      return renderTextBlock(block as TextBlock);
    case 'image':
      return renderImageBlock(block as ImageBlock);
    case 'button':
      return renderButtonBlock(block as ButtonBlock, context);
    case 'divider':
      return renderDividerBlock(block as DividerBlock);
    case 'hero':
      return renderHeroBlock(block as HeroBlock);
    case 'stats':
      return renderStatsBlock(block as StatsBlock);
    case 'testimonial':
      return renderTestimonialBlock(block as TestimonialBlock);
    case 'feature-grid':
      return renderFeatureGridBlock(block as FeatureGridBlock);
    case 'comparison':
      return renderComparisonBlock(block as ComparisonBlock);
    case 'social-links':
      return renderSocialLinksBlock(block as SocialLinksBlock);
    case 'footer':
      return renderFooterBlock(block as FooterBlock, context);
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
  
  const processedUrl = processImageUrl(content.imageUrl, 'logo');
  const isPlaceholder = /^\{\{.+\}\}$/.test(content.imageUrl);
  const minHeight = isPlaceholder ? ' min-height: 80px;' : '';
  const imgHtml = `<img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.altText)}" width="${width}" ${height ? `height="${height}"` : ''} style="display: block; max-width: 100%; height: ${height || 'auto'}; border: none;${minHeight}" />`;
  
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
 * 3. Heading Block
 */
function renderHeadingBlock(block: HeadingBlock): string {
  const { settings, content } = block;
  const { fontSize, fontWeight, color, align, backgroundColor, padding, lineHeight, letterSpacing } = settings;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">
          <h1 style="margin: 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align};${letterSpacing ? ` letter-spacing: ${letterSpacing};` : ''}">
            ${escapeHtml(content.text)}
          </h1>
        </td>
      </tr>
    </table>`;
}

/**
 * 4. Text Block
 */
function renderTextBlock(block: TextBlock): string {
  const { settings, content } = block;
  const { fontSize, fontWeight, color, align, backgroundColor, padding, lineHeight } = settings;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}">
          <p style="margin: 0; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight}; text-align: ${align};">
            ${content.text}
          </p>
        </td>
      </tr>
    </table>`;
}

/**
 * 5. Image Block
 */
function renderImageBlock(block: ImageBlock): string {
  const { settings, content } = block;
  const { align, width, height, borderRadius, padding } = settings;
  
  const processedUrl = processImageUrl(content.imageUrl, 'image');
  const isPlaceholder = /^\{\{.+\}\}$/.test(content.imageUrl);
  const minHeight = isPlaceholder ? ' min-height: 200px;' : '';
  const imgStyle = `display: block; max-width: 100%; width: ${width}; height: ${height || 'auto'}; border: none;${minHeight}${borderRadius ? ` border-radius: ${borderRadius};` : ''}`;
  const imgHtml = `<img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(content.altText)}" style="${imgStyle}" />`;
  
  const imageContent = content.linkUrl
    ? `<a href="${escapeHtml(content.linkUrl)}" style="text-decoration: none; display: inline-block;">${imgHtml}</a>`
    : imgHtml;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          ${imageContent}
          ${content.caption ? `
          <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280; text-align: ${align};">
            ${escapeHtml(content.caption)}
          </p>` : ''}
        </td>
      </tr>
    </table>`;
}

/**
 * 6. Button Block (Bulletproof)
 */
function renderButtonBlock(block: ButtonBlock, context: RenderContext): string {
  const { settings, content } = block;
  const { style, color, textColor, align, borderRadius, fontSize, fontWeight, padding, containerPadding } = settings;
  
  let url = content.url;
  if (context.mergeTags) {
    Object.entries(context.mergeTags).forEach(([key, value]) => {
      url = url.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
  }
  
  const buttonPadding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
  
  // Solid button (most common)
  if (style === 'solid') {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${containerPadding.top}px ${containerPadding.right}px ${containerPadding.bottom}px ${containerPadding.left}px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(url)}" style="height:auto;v-text-anchor:middle;width:auto;" arcsize="${getOutlookArcsize(borderRadius)}" strokecolor="${color}" fillcolor="${color}">
            <w:anchorlock/>
            <center style="color:${textColor};font-size:${fontSize};font-weight:${fontWeight};">${escapeHtml(content.text)}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" style="border-radius: ${borderRadius}; background-color: ${color};">
                <a href="${escapeHtml(url)}" style="display: inline-block; padding: ${buttonPadding}; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${textColor}; text-decoration: none; border-radius: ${borderRadius};">
                  ${escapeHtml(content.text)}
                </a>
              </td>
            </tr>
          </table>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`;
  }
  
  // Outline button
  if (style === 'outline') {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${containerPadding.top}px ${containerPadding.right}px ${containerPadding.bottom}px ${containerPadding.left}px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" style="border-radius: ${borderRadius}; border: 2px solid ${color}; background-color: transparent;">
                <a href="${escapeHtml(url)}" style="display: inline-block; padding: ${buttonPadding}; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; text-decoration: none; border-radius: ${borderRadius};">
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
        <td align="${align}" style="padding: ${containerPadding.top}px ${containerPadding.right}px ${containerPadding.bottom}px ${containerPadding.left}px;">
          <a href="${escapeHtml(url)}" style="display: inline-block; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; text-decoration: underline;">
            ${escapeHtml(content.text)}
          </a>
        </td>
      </tr>
    </table>`;
}

/**
 * 7. Divider Block
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
          ${escapeHtml(content.decorativeElement)}
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
 * 8. Hero Block
 */
function renderHeroBlock(block: HeroBlock): string {
  const { settings, content } = block;
  const { backgroundColor, backgroundGradient, padding, align, headlineFontSize, headlineFontWeight, headlineColor, subheadlineFontSize, subheadlineColor } = settings;
  
  // Mobile-first padding (cap at 20px for mobile safety)
  const mobilePadding = {
    top: Math.min(padding.top, 40),
    right: Math.min(padding.right, 20),
    bottom: Math.min(padding.bottom, 40),
    left: Math.min(padding.left, 20),
  };
  
  // Mobile-first font sizes (cap large headlines for mobile)
  const headlineSizeNum = parseInt(headlineFontSize);
  const mobileFontSize = headlineSizeNum > 48 ? '40px' : headlineFontSize;
  
  const subheadlineSizeNum = parseInt(subheadlineFontSize);
  const mobileSubheadlineSize = subheadlineSizeNum > 20 ? '18px' : subheadlineFontSize;
  
  let bgStyle = '';
  if (backgroundGradient) {
    const { from, to, direction } = backgroundGradient;
    const gradientDir = direction === 'to-right' ? 'to right' : 
                       direction === 'to-bottom' ? 'to bottom' :
                       direction === 'to-tr' ? 'to top right' : '135deg';
    bgStyle = `background: linear-gradient(${gradientDir}, ${from}, ${to});`;
  } else if (backgroundColor) {
    bgStyle = `background-color: ${backgroundColor};`;
  }
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${mobilePadding.top}px ${mobilePadding.right}px ${mobilePadding.bottom}px ${mobilePadding.left}px; ${bgStyle}">
          <h1 style="margin: 0 0 ${content.subheadline ? '16px' : '0'}; font-size: ${mobileFontSize}; font-weight: ${headlineFontWeight}; color: ${headlineColor}; line-height: 1.1; text-align: ${align}; letter-spacing: -0.03em;">
            ${escapeHtml(content.headline)}
          </h1>
          ${content.subheadline ? `
          <p style="margin: 0; font-size: ${mobileSubheadlineSize}; color: ${subheadlineColor}; line-height: 1.5; text-align: ${align};">
            ${escapeHtml(content.subheadline)}
          </p>` : ''}
          ${content.imageUrl ? `
          <div style="margin-top: 24px;">
            <img src="${escapeHtml(processImageUrl(content.imageUrl, 'hero'))}" alt="" style="display: block; max-width: 100%; height: auto; margin: 0 auto;${/^\{\{.+\}\}$/.test(content.imageUrl) ? ' min-height: 200px;' : ''}" />
          </div>` : ''}
        </td>
      </tr>
    </table>`;
}

/**
 * 9. Stats Block
 */
function renderStatsBlock(block: StatsBlock): string {
  const { settings, content } = block;
  const { layout, align, valueFontSize, valueFontWeight, valueColor, labelFontSize, labelFontWeight, labelColor, padding, spacing } = settings;
  
  // Mobile-first padding
  const mobilePadding = {
    top: Math.min(padding.top, 30),
    right: Math.min(padding.right, 20),
    bottom: Math.min(padding.bottom, 30),
    left: Math.min(padding.left, 20),
  };
  
  const colCount = layout === '2-col' ? 2 : layout === '3-col' ? 3 : 4;
  const maxWidth = layout === '2-col' ? '240px' : layout === '3-col' ? '180px' : '140px';
  const minWidth = layout === '2-col' ? '200px' : layout === '3-col' ? '140px' : '100px';
  
  const statsHtml = content.stats.map((stat, index) => {
    return `
      <div style="display: inline-block; width: 100%; max-width: ${maxWidth}; min-width: ${minWidth}; vertical-align: top; margin: 0 8px 16px; text-align: ${align};">
        <p style="margin: 0 0 8px; font-size: ${valueFontSize}; font-weight: ${valueFontWeight}; color: ${valueColor}; line-height: 1; letter-spacing: -0.03em;">
          ${escapeHtml(stat.value)}
        </p>
        <p style="margin: 0; font-size: ${labelFontSize}; font-weight: ${labelFontWeight}; color: ${labelColor}; text-transform: uppercase; letter-spacing: 0.05em;">
          ${escapeHtml(stat.label)}
        </p>
      </div>`;
  }).join('');
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${mobilePadding.top}px ${mobilePadding.right}px ${mobilePadding.bottom}px ${mobilePadding.left}px; text-align: ${align};">
          ${statsHtml}
        </td>
      </tr>
    </table>`;
}

/**
 * 10. Testimonial Block
 */
function renderTestimonialBlock(block: TestimonialBlock): string {
  const { settings, content } = block;
  const { backgroundColor, borderColor, borderWidth, borderRadius, padding, quoteFontSize, quoteColor, quoteFontStyle, authorFontSize, authorColor, authorFontWeight } = settings;
  
  const containerStyle = `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;${backgroundColor ? ` background-color: ${backgroundColor};` : ''}${borderColor && borderWidth ? ` border-left: ${borderWidth}px solid ${borderColor};` : ''}${borderRadius ? ` border-radius: ${borderRadius};` : ''}`;
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="${containerStyle}">
          ${content.avatarUrl ? `
          <div style="margin-bottom: 16px; text-align: center;">
            <img src="${escapeHtml(processAvatarUrl(content.avatarUrl))}" alt="${escapeHtml(content.author)}" style="width: 64px; height: 64px; border-radius: 50%; display: inline-block; object-fit: cover;" onerror="this.onerror=null; this.src='${escapeHtml(getPlaceholderAvatar())}'" />
          </div>` : ''}
          <p style="margin: 0 0 16px; font-size: ${quoteFontSize}; color: ${quoteColor}; font-style: ${quoteFontStyle}; line-height: 1.6;">
            "${escapeHtml(content.quote)}"
          </p>
          <p style="margin: 0; font-size: ${authorFontSize}; color: ${authorColor}; font-weight: ${authorFontWeight};">
            <strong>${escapeHtml(content.author)}</strong>${content.role ? `, ${escapeHtml(content.role)}` : ''}${content.company ? ` at ${escapeHtml(content.company)}` : ''}
          </p>
        </td>
      </tr>
    </table>`;
}

/**
 * 11. Feature Grid Block
 */
function renderFeatureGridBlock(block: FeatureGridBlock): string {
  const { settings, content } = block;
  const { layout, align, iconSize, titleFontSize, titleFontWeight, titleColor, descriptionFontSize, descriptionColor, padding, spacing } = settings;
  
  // Mobile-first padding
  const mobilePadding = {
    top: Math.min(padding.top, 30),
    right: Math.min(padding.right, 20),
    bottom: Math.min(padding.bottom, 30),
    left: Math.min(padding.left, 20),
  };
  
  if (layout === 'single-col') {
    const featuresHtml = content.features.map((feature, index) => `
      ${feature.icon ? `
      <p style="margin: 0 0 12px; font-size: ${iconSize}; line-height: 1;">
        ${escapeHtml(feature.icon)}
      </p>` : ''}
      <h3 style="margin: 0 0 8px; font-size: ${titleFontSize}; font-weight: ${titleFontWeight}; color: ${titleColor}; line-height: 1.3;">
        ${escapeHtml(feature.title)}
      </h3>
      <p style="margin: ${index < content.features.length - 1 ? `0 0 ${spacing}px` : '0'}; font-size: ${descriptionFontSize}; color: ${descriptionColor}; line-height: 1.6;">
        ${escapeHtml(feature.description)}
      </p>
    `).join('');
    
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${mobilePadding.top}px ${mobilePadding.right}px ${mobilePadding.bottom}px ${mobilePadding.left}px;">
          ${featuresHtml}
        </td>
      </tr>
    </table>`;
  }
  
  // Multi-column layout with natural stacking
  const colCount = layout === '2-col' ? 2 : 3;
  const maxWidth = layout === '2-col' ? '280px' : '180px';
  const minWidth = layout === '2-col' ? '240px' : '160px';
  
  const featuresHtml = content.features.map((feature, index) => {
    return `
      <div style="display: inline-block; width: 100%; max-width: ${maxWidth}; min-width: ${minWidth}; vertical-align: top; margin: 0 8px 16px; text-align: center;">
        ${feature.icon ? `
        <p style="margin: 0 0 12px; font-size: ${iconSize}; line-height: 1;">
          ${escapeHtml(feature.icon)}
        </p>` : ''}
        <h3 style="margin: 0 0 8px; font-size: ${titleFontSize}; font-weight: ${titleFontWeight}; color: ${titleColor}; line-height: 1.3;">
          ${escapeHtml(feature.title)}
        </h3>
        <p style="margin: 0; font-size: ${descriptionFontSize}; color: ${descriptionColor}; line-height: 1.6;">
          ${escapeHtml(feature.description)}
        </p>
      </div>`;
  }).join('');
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${mobilePadding.top}px ${mobilePadding.right}px ${mobilePadding.bottom}px ${mobilePadding.left}px; text-align: ${align};">
          ${featuresHtml}
        </td>
      </tr>
    </table>`;
}

/**
 * 12. Comparison Block
 */
function renderComparisonBlock(block: ComparisonBlock): string {
  const { settings, content } = block;
  const { beforeBackgroundColor, afterBackgroundColor, beforeLabelColor, afterLabelColor, labelFontSize, labelFontWeight, contentFontSize, contentColor, borderRadius, padding, cellPadding } = settings;
  
  // Mobile-first padding
  const mobilePadding = {
    top: Math.min(padding.top, 24),
    right: Math.min(padding.right, 20),
    bottom: Math.min(padding.bottom, 24),
    left: Math.min(padding.left, 20),
  };
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${mobilePadding.top}px ${mobilePadding.right}px ${mobilePadding.bottom}px ${mobilePadding.left}px; text-align: center;">
          <div style="display: inline-block; width: 100%; max-width: 260px; min-width: 240px; vertical-align: top; margin: 0 4px 12px; padding: ${cellPadding}px; background-color: ${beforeBackgroundColor};${borderRadius ? ` border-radius: ${borderRadius};` : ''} text-align: left;">
            <p style="margin: 0 0 8px; font-size: ${labelFontSize}; font-weight: ${labelFontWeight}; color: ${beforeLabelColor}; text-transform: uppercase; letter-spacing: 0.05em;">
              ${escapeHtml(content.before.label || 'BEFORE')}
            </p>
            <p style="margin: 0; font-size: ${contentFontSize}; color: ${contentColor}; line-height: 1.6;">
              ${escapeHtml(content.before.text)}
            </p>
          </div>
          <div style="display: inline-block; width: 100%; max-width: 260px; min-width: 240px; vertical-align: top; margin: 0 4px 12px; padding: ${cellPadding}px; background-color: ${afterBackgroundColor};${borderRadius ? ` border-radius: ${borderRadius};` : ''} text-align: left;">
            <p style="margin: 0 0 8px; font-size: ${labelFontSize}; font-weight: ${labelFontWeight}; color: ${afterLabelColor}; text-transform: uppercase; letter-spacing: 0.05em;">
              ${escapeHtml(content.after.label || 'AFTER')}
            </p>
            <p style="margin: 0; font-size: ${contentFontSize}; color: ${contentColor}; line-height: 1.6;">
              ${escapeHtml(content.after.text)}
            </p>
          </div>
        </td>
      </tr>
    </table>`;
}

/**
 * 13. Social Links Block
 */
function renderSocialLinksBlock(block: SocialLinksBlock): string {
  const { settings, content } = block;
  const { align, iconSize, spacing, iconStyle, iconColor, padding } = settings;
  
  const socialIcons = content.links.map((link, index) => {
    const iconUrl = getSocialIconUrl(link.platform, iconStyle, iconColor);
    const isLast = index === content.links.length - 1;
    
    return `
      <td style="padding-right: ${isLast ? 0 : spacing}px;">
        <a href="${escapeHtml(link.url)}" style="text-decoration: none;">
          <img src="${iconUrl}" alt="${link.platform}" width="${iconSize}" height="${iconSize}" style="display: block; border: none;" />
        </a>
      </td>`;
  }).join('');
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              ${socialIcons}
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

/**
 * 14. Footer Block
 */
function renderFooterBlock(block: FooterBlock, context: RenderContext): string {
  const { settings, content } = block;
  const { backgroundColor, textColor, fontSize, align, padding, lineHeight, linkColor } = settings;
  
  let unsubscribeUrl = content.unsubscribeUrl;
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
            <strong>${escapeHtml(content.companyName)}</strong>
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
// Helper Functions
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
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
 * Get social media icon URL
 * In production, these would be hosted on your CDN
 */
function getSocialIconUrl(platform: string, style: string, color?: string | null): string {
  // Placeholder - in production, replace with actual CDN URLs
  return `https://via.placeholder.com/32/${color?.replace('#', '') || '000000'}/FFFFFF?text=${platform[0].toUpperCase()}`;
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    /* Desktop Enhancement - Progressive Enhancement Only */
    /* Emails work perfectly without these styles! */
    @media only screen and (min-width: 600px) {
      .desktop-padding {
        padding: 40px 20px !important;
      }
      
      /* Enhance column widths on desktop for better layout */
      .feature-column-2 {
        max-width: 280px !important;
      }
      
      .feature-column-3 {
        max-width: 180px !important;
      }
      
      .stat-column {
        max-width: 200px !important;
      }
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

