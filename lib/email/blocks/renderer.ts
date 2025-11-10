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
  
  const imgHtml = `<img src="${escapeHtml(content.imageUrl)}" alt="${escapeHtml(content.altText)}" width="${width}" ${height ? `height="${height}"` : ''} style="display: block; max-width: 100%; height: ${height || 'auto'}; border: none;" />`;
  
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
  
  const imgStyle = `display: block; max-width: 100%; width: ${width}; height: ${height || 'auto'}; border: none;${borderRadius ? ` border-radius: ${borderRadius};` : ''}`;
  const imgHtml = `<img src="${escapeHtml(content.imageUrl)}" alt="${escapeHtml(content.altText)}" style="${imgStyle}" />`;
  
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
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px; ${bgStyle}">
          <h1 style="margin: 0 0 ${content.subheadline ? '16px' : '0'}; font-size: ${headlineFontSize}; font-weight: ${headlineFontWeight}; color: ${headlineColor}; line-height: 1.1; text-align: ${align}; letter-spacing: -0.03em;">
            ${escapeHtml(content.headline)}
          </h1>
          ${content.subheadline ? `
          <p style="margin: 0; font-size: ${subheadlineFontSize}; color: ${subheadlineColor}; line-height: 1.5; text-align: ${align};">
            ${escapeHtml(content.subheadline)}
          </p>` : ''}
          ${content.imageUrl ? `
          <div style="margin-top: 24px;">
            <img src="${escapeHtml(content.imageUrl)}" alt="" style="display: block; max-width: 100%; height: auto; margin: 0 auto;" />
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
  
  const colCount = layout === '2-col' ? 2 : layout === '3-col' ? 3 : 4;
  const statsPerRow = Math.ceil(content.stats.length / colCount);
  
  const statsHtml = content.stats.map((stat, index) => {
    const isLast = (index + 1) % colCount === 0 || index === content.stats.length - 1;
    return `
      <td align="${align}" style="padding-right: ${isLast ? 0 : spacing}px; vertical-align: top;">
        <p style="margin: 0 0 8px; font-size: ${valueFontSize}; font-weight: ${valueFontWeight}; color: ${valueColor}; line-height: 1; letter-spacing: -0.03em;">
          ${escapeHtml(stat.value)}
        </p>
        <p style="margin: 0; font-size: ${labelFontSize}; font-weight: ${labelFontWeight}; color: ${labelColor}; text-transform: uppercase; letter-spacing: 0.05em;">
          ${escapeHtml(stat.label)}
        </p>
      </td>`;
  }).join('');
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              ${statsHtml}
            </tr>
          </table>
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
            <img src="${escapeHtml(content.avatarUrl)}" alt="${escapeHtml(content.author)}" style="width: 64px; height: 64px; border-radius: 50%; display: inline-block;" />
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
        <td align="${align}" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          ${featuresHtml}
        </td>
      </tr>
    </table>`;
  }
  
  // Multi-column layout
  const colCount = layout === '2-col' ? 2 : 3;
  const featuresHtml = content.features.map((feature, index) => {
    const isLast = (index + 1) % colCount === 0 || index === content.features.length - 1;
    return `
      <td align="center" style="padding-right: ${isLast ? 0 : spacing}px; vertical-align: top;">
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
      </td>`;
  }).join('');
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${featuresHtml}
            </tr>
          </table>
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
  
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width: 50%; padding: ${cellPadding}px; background-color: ${beforeBackgroundColor};${borderRadius ? ` border-radius: ${borderRadius};` : ''} vertical-align: top;">
                <p style="margin: 0 0 8px; font-size: ${labelFontSize}; font-weight: ${labelFontWeight}; color: ${beforeLabelColor}; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${escapeHtml(content.before.label || 'BEFORE')}
                </p>
                <p style="margin: 0; font-size: ${contentFontSize}; color: ${contentColor}; line-height: 1.6;">
                  ${escapeHtml(content.before.text)}
                </p>
              </td>
              <td style="width: 16px;"></td>
              <td style="width: 50%; padding: ${cellPadding}px; background-color: ${afterBackgroundColor};${borderRadius ? ` border-radius: ${borderRadius};` : ''} vertical-align: top;">
                <p style="margin: 0 0 8px; font-size: ${labelFontSize}; font-weight: ${labelFontWeight}; color: ${afterLabelColor}; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${escapeHtml(content.after.label || 'AFTER')}
                </p>
                <p style="margin: 0; font-size: ${contentFontSize}; color: ${contentColor}; line-height: 1.6;">
                  ${escapeHtml(content.after.text)}
                </p>
              </td>
            </tr>
          </table>
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
function getSocialIconUrl(platform: string, style: string, color?: string): string {
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
</head>
<body style="margin: 0; padding: 0; font-family: ${fontFamily}; background-color: ${backgroundColor};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="${maxWidth}" cellpadding="0" cellspacing="0" style="max-width: ${maxWidth}px; width: 100%; background-color: ${contentBackgroundColor};">
          ${blocksHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

