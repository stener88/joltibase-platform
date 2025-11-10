/**
 * Comparison Hero Template
 * 
 * Before/after transformation stories
 * Best for: Case studies, ROI demonstrations, transformation showcases, problem-solution narratives
 * 
 * Design Philosophy:
 * - Visual before/after contrast
 * - Transformation-focused
 * - Clear problem → solution flow
 * - Results-oriented
 */

import type { TemplateRenderInput } from './types';
import { getFontStack, replaceMergeTags, getTypography, getSpacing } from './types';

export function renderComparisonHero(input: TemplateRenderInput): string {
  const { content, design, brandColors, mergeTags } = input;
  const fontStack = getFontStack(brandColors.fontStyle);
  const ctaColor = design.ctaColor || brandColors.primaryColor;
  const backgroundColor = design.backgroundColor || '#f8f9fa';
  
  // Comparison Hero uses standard scale for professional presentation
  const typography = getTypography(design.typographyScale || 'standard');
  const spacing = getSpacing(design.layoutVariation?.spacing || 'generous');

  const sectionsHtml = content.sections
    .map((section) => {
      switch (section.type) {
        case 'heading':
          return `<h2 style="margin: ${spacing.sectionSpacing} 0 20px; font-size: ${typography.h3}; font-weight: 700; color: #2d3748; line-height: 1.3; text-align: center;">${section.content || ''}</h2>`;
        
        case 'text':
          return `<p style="margin: 0 0 ${spacing.paragraphSpacing}; font-size: ${typography.body}; color: #4a5568; line-height: 1.7;">${section.content || ''}</p>`;
        
        case 'list':
          const items = (section.items || [])
            .map(item => `<li style="margin-bottom: 12px;">${item}</li>`)
            .join('');
          return `<ul style="margin: 0 0 ${spacing.paragraphSpacing}; padding-left: 24px; font-size: ${typography.body}; color: #4a5568; line-height: 1.7;">${items}</ul>`;
        
        case 'divider':
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;"><span style="font-size: 48px; color: ${ctaColor};">→</span></div>`;
        
        case 'spacer':
          const height = section.size === 'small' ? '24px' : section.size === 'large' ? '64px' : spacing.elementSpacing;
          return `<div style="height: ${height};"></div>`;
        
        case 'hero':
          return `
            <div style="margin: 0 0 ${spacing.sectionSpacing}; text-align: center;">
              <h2 style="margin: 0 0 20px; font-size: ${typography.h2}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2; letter-spacing: -0.02em;">${section.headline || ''}</h2>
              ${section.subheadline ? `<p style="margin: 0; font-size: 20px; color: #718096; line-height: 1.6;">${section.subheadline}</p>` : ''}
            </div>
          `;
        
        case 'feature-grid':
          const featuresHtml = (section.features || [])
            .map(feature => `
              <div style="margin-bottom: 24px; padding: 24px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                ${feature.icon ? `<div style="font-size: 36px; margin-bottom: 16px; text-align: center;">${feature.icon}</div>` : ''}
                <p style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #2d3748; text-align: center;">${feature.title}</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #718096; line-height: 1.6; text-align: center;">${feature.description}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: 0 0 ${spacing.sectionSpacing};">${featuresHtml}</div>`;
        
        case 'testimonial':
          if (!section.testimonial) return '';
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: center;">
              <div style="font-size: 40px; margin-bottom: 16px;">💬</div>
              <p style="margin: 0 0 20px; font-size: 20px; color: #2d3748; line-height: 1.7; font-style: italic;">
                "${section.testimonial.quote}"
              </p>
              <p style="margin: 0; font-size: ${typography.body}; color: #718096; font-weight: 600;">
                — ${section.testimonial.author}${section.testimonial.role ? `, ${section.testimonial.role}` : ''}
              </p>
            </div>
          `;
        
        case 'stats':
          const statsHtml = (section.stats || [])
            .map(stat => `
              <div style="display: inline-block; margin: 0 32px ${spacing.elementSpacing} 0; text-align: center; padding: 28px; background: linear-gradient(135deg, ${ctaColor}08, ${brandColors.secondaryColor}08); border-radius: 12px; min-width: 150px;">
                <p style="margin: 0 0 12px; font-size: ${typography.stats}; font-weight: ${typography.weight.stats}; color: ${ctaColor}; line-height: 1;">${stat.value}</p>
                <p style="margin: 0; font-size: ${typography.body}; color: #718096; font-weight: 700;">${stat.label}</p>
              </div>
            `)
            .join('');
          return `<div style="margin: ${spacing.sectionSpacing} 0; text-align: center;">${statsHtml}</div>`;
        
        case 'comparison':
          if (!section.comparison) return '';
          return `
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin: ${spacing.sectionSpacing} 0; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; padding: 32px; background-color: #fff5f5; border-radius: 12px; vertical-align: top;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <div style="display: inline-block; padding: 8px 20px; background-color: #fee2e2; border-radius: 20px;">
                      <p style="margin: 0; font-size: 13px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1px;">Before</p>
                    </div>
                  </div>
                  <p style="margin: 0; font-size: 18px; color: #4a5568; line-height: 1.7; text-align: center;">${section.comparison.before}</p>
                </td>
                <td style="width: 40px; text-align: center; vertical-align: middle;">
                  <div style="font-size: 36px; color: ${ctaColor};">→</div>
                </td>
                <td style="width: 50%; padding: 32px; background: linear-gradient(135deg, ${ctaColor}12, ${brandColors.secondaryColor}12); border: 3px solid ${ctaColor}; border-radius: 12px; vertical-align: top;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <div style="display: inline-block; padding: 8px 20px; background-color: ${ctaColor}; border-radius: 20px;">
                      <p style="margin: 0; font-size: 13px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">After</p>
                    </div>
                  </div>
                  <p style="margin: 0; font-size: 18px; color: #2d3748; line-height: 1.7; font-weight: 700; text-align: center;">${section.comparison.after}</p>
                </td>
              </tr>
            </table>
          `;
        
        case 'cta-block':
          return `
            <div style="margin: ${spacing.sectionSpacing} 0; padding: ${spacing.elementSpacing}; background-color: #ffffff; border-radius: 12px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
              ${section.content ? `<p style="margin: 0 0 24px; font-size: 20px; color: #2d3748; line-height: 1.6; font-weight: 600;">${section.content}</p>` : ''}
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: ${ctaColor}; box-shadow: 0 4px 12px ${ctaColor}40;">
                    <a href="${section.ctaUrl || '{{cta_url}}'}" style="display: inline-block; padding: 18px 48px; font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                      ${section.ctaText || 'See The Transformation'} →
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          `;
        
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
<body style="margin: 0; padding: 0; font-family: ${fontStack}; background-color: ${backgroundColor}; line-height: 1.7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="650" cellpadding="0" cellspacing="0" style="max-width: 650px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
          
          <!-- Preheader -->
          ${content.preheader ? `
          <tr>
            <td style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
              ${content.preheader}
            </td>
          </tr>
          ` : ''}
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 50%; padding: 12px; background-color: #fff5f5; text-align: center;">
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 1px;">Before</p>
                  </td>
                  <td style="width: 50%; padding: 12px; background-color: ${ctaColor}; text-align: center;">
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">After</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: ${spacing.outerPadding} 48px;">
              
              <!-- Headline -->
              <h1 style="margin: 0 0 20px; font-size: ${typography.h1}; font-weight: ${typography.weight.headline}; color: #1a202c; line-height: 1.2; text-align: center; letter-spacing: -0.02em;">
                ${content.headline}
              </h1>
              
              <!-- Subheadline -->
              ${content.subheadline ? `
              <p style="margin: 0 0 ${spacing.sectionSpacing}; font-size: 20px; color: #718096; line-height: 1.6; text-align: center;">
                ${content.subheadline}
              </p>
              ` : ''}
              
              <!-- Body Sections -->
              ${sectionsHtml}
              
              <!-- Main CTA -->
              <div style="margin: ${spacing.sectionSpacing} 0 0; text-align: center;">
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 10px; background-color: ${ctaColor}; box-shadow: 0 4px 12px ${ctaColor}40;">
                      <a href="${content.cta.url}" style="display: inline-block; padding: 18px 48px; font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                        ${content.cta.text} →
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Secondary CTA -->
              ${content.cta.secondary ? `
              <div style="margin: 24px 0 0; text-align: center;">
                <a href="${content.cta.secondary.url}" style="color: #718096; text-decoration: underline; font-size: ${typography.body};">
                  ${content.cta.secondary.text}
                </a>
              </div>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: ${spacing.elementSpacing} 48px; background-color: ${backgroundColor}; border-top: 1px solid #e2e8f0;">
              
              ${content.footer?.companyName ? `
              <p style="margin: 0 0 8px; font-size: ${typography.small}; color: #718096; text-align: center; font-weight: 600;">
                ${content.footer.companyName}
              </p>
              ` : ''}
              
              ${content.footer?.companyAddress ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #a0aec0; text-align: center;">
                ${content.footer.companyAddress}
              </p>
              ` : ''}
              
              ${content.footer?.customText ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #718096; text-align: center;">
                ${content.footer.customText}
              </p>
              ` : ''}
              
              <p style="margin: 0; font-size: 14px; color: #a0aec0; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #718096; text-decoration: underline;">Unsubscribe</a>
                · <a href="{{preferences_url}}" style="color: #718096; text-decoration: underline;">Preferences</a>
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

