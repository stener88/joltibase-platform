/**
 * Header Pattern Component
 * 
 * Newsletter header with logo and navigation
 * Supports 3 variants:
 * - centered-menu: Logo centered with menu items below
 * - side-menu: Logo left, menu items right
 * - social-icons: Logo centered with social icons below
 * Uses @react-email/components for email-safe rendering
 */

import { Section, Row, Column, Img, Link, Text } from '@react-email/components';
import type { HeaderBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';
import { isValidImageUrl } from './utils';

interface HeaderPatternProps {
  block: HeaderBlock;
  settings: GlobalEmailSettings;
}

export function HeaderPattern({ block, settings }: HeaderPatternProps) {
  const { variant = 'centered-menu' } = block;

  if (variant === 'side-menu') {
    return <SideMenuHeader block={block} settings={settings} />;
  }

  if (variant === 'social-icons') {
    return <SocialIconsHeader block={block} settings={settings} />;
  }

  // Default: centered-menu
  return <CenteredMenuHeader block={block} settings={settings} />;
}

/**
 * Centered Menu Header
 * Logo centered at top, menu items centered below
 */
function CenteredMenuHeader({ block, settings }: HeaderPatternProps) {
  const { logoUrl, logoAlt, companyName, menuItems = [] } = block;

  return (
    <Section
      style={{
        padding: '40px 24px 32px',
        textAlign: 'center' as const,
      }}
    >
      {/* Logo */}
      {logoUrl && isValidImageUrl(logoUrl) && (
        <Img
          src={logoUrl}
          alt={logoAlt || companyName || 'Logo'}
          width={140}
          style={{
            maxWidth: '140px',
            height: 'auto',
            margin: '0 auto 20px',
            display: 'block',
          }}
        />
      )}

      {/* Company Name (fallback if no logo) */}
      {!logoUrl && companyName && (
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: settings.primaryColor,
            margin: '0 0 20px 0',
            fontFamily: settings.fontFamily,
          }}
        >
          {companyName}
        </Text>
      )}

      {/* Menu Items */}
      {menuItems.length > 0 && (
        <Row>
          <Column style={{ textAlign: 'center' as const }}>
            {menuItems.map((item, index) => (
              <span key={index} style={{ display: 'inline-block' }}>
                <Link
                  href={item.url}
                  style={{
                    color: '#666666',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '0 12px',
                    fontFamily: settings.fontFamily,
                  }}
                >
                  {item.label}
                </Link>
                {index < menuItems.length - 1 && (
                  <span style={{ color: '#cccccc', padding: '0 4px' }}>|</span>
                )}
              </span>
            ))}
          </Column>
        </Row>
      )}
    </Section>
  );
}

/**
 * Side Menu Header
 * Logo on left, menu items on right (horizontal layout)
 */
function SideMenuHeader({ block, settings }: HeaderPatternProps) {
  const { logoUrl, logoAlt, companyName, menuItems = [] } = block;

  return (
    <Section
      style={{
        padding: '32px 24px',
      }}
    >
      <Row>
        {/* Logo Column */}
        <Column
          style={{
            width: '40%',
            verticalAlign: 'middle',
          }}
        >
          {logoUrl && isValidImageUrl(logoUrl) && (
            <Img
              src={logoUrl}
              alt={logoAlt || companyName || 'Logo'}
              width={120}
              style={{
                maxWidth: '120px',
                height: 'auto',
              }}
            />
          )}
          {!logoUrl && companyName && (
            <Text
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: settings.primaryColor,
                margin: '0',
                fontFamily: settings.fontFamily,
              }}
            >
              {companyName}
            </Text>
          )}
        </Column>

        {/* Menu Column */}
        {menuItems.length > 0 && (
          <Column
            style={{
              width: '60%',
              verticalAlign: 'middle',
              textAlign: 'right' as const,
            }}
          >
            {menuItems.map((item, index) => (
              <span key={index} style={{ display: 'inline-block' }}>
                <Link
                  href={item.url}
                  style={{
                    color: '#666666',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '0 8px',
                    fontFamily: settings.fontFamily,
                  }}
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </Column>
        )}
      </Row>
    </Section>
  );
}

/**
 * Social Icons Header
 * Logo centered at top, social media icons centered below
 */
function SocialIconsHeader({ block, settings }: HeaderPatternProps) {
  const { logoUrl, logoAlt, companyName, socialLinks = [] } = block;

  return (
    <Section
      style={{
        padding: '40px 24px 32px',
        textAlign: 'center' as const,
      }}
    >
      {/* Logo */}
      {logoUrl && isValidImageUrl(logoUrl) && (
        <Img
          src={logoUrl}
          alt={logoAlt || companyName || 'Logo'}
          width={140}
          style={{
            maxWidth: '140px',
            height: 'auto',
            margin: '0 auto 20px',
            display: 'block',
          }}
        />
      )}

      {/* Company Name (fallback if no logo) */}
      {!logoUrl && companyName && (
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: settings.primaryColor,
            margin: '0 0 20px 0',
            fontFamily: settings.fontFamily,
          }}
        >
          {companyName}
        </Text>
      )}

      {/* Social Icons */}
      {socialLinks.length > 0 && (
        <Row>
          <Column style={{ textAlign: 'center' as const }}>
            {socialLinks.map((social, index) => (
              <span key={index} style={{ display: 'inline-block' }}>
                <Link
                  href={social.url}
                  style={{
                    display: 'inline-block',
                    margin: '0 8px',
                  }}
                >
                  {social.icon && (
                    <Img
                      src={getSocialIconUrl(social.platform)}
                      alt={social.platform}
                      width={24}
                      height={24}
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'block',
                      }}
                    />
                  )}
                  {!social.icon && (
                    <Text
                      style={{
                        color: '#666666',
                        fontSize: '14px',
                        fontFamily: settings.fontFamily,
                      }}
                    >
                      {social.platform}
                    </Text>
                  )}
                </Link>
              </span>
            ))}
          </Column>
        </Row>
      )}
    </Section>
  );
}

/**
 * Get social media icon URL
 * Returns a simple SVG icon URL for common platforms
 */
function getSocialIconUrl(platform: string): string {
  // These are placeholder SVG data URIs for common social icons
  // In production, you'd use actual hosted icon images
  const icons: Record<string, string> = {
    twitter: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"%3E%3C/path%3E%3C/svg%3E',
    facebook: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"%3E%3C/path%3E%3C/svg%3E',
    instagram: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Crect x="2" y="2" width="20" height="20" rx="5" ry="5"%3E%3C/rect%3E%3Cpath d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"%3E%3C/path%3E%3Cline x1="17.5" y1="6.5" x2="17.51" y2="6.5"%3E%3C/line%3E%3C/svg%3E',
    linkedin: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"%3E%3C/path%3E%3Ccircle cx="4" cy="4" r="2"%3E%3C/circle%3E%3C/svg%3E',
  };

  return icons[platform.toLowerCase()] || icons.twitter;
}

