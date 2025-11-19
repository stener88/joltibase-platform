/**
 * Footer Pattern Component
 * 
 * Email footer with company information, links, and unsubscribe
 * Includes optional social links and additional navigation links
 */

import { Section, Text, Link, Row, Column } from '@react-email/components';
import type { FooterBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface FooterPatternProps {
  block: FooterBlock;
  settings: GlobalEmailSettings;
}

export function FooterPattern({ block, settings }: FooterPatternProps) {
  return (
    <Section
      style={{
        backgroundColor: '#f9fafb',
        padding: '32px 24px',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      {/* Company name and copyright */}
      <Text
        style={{
          color: '#6b7280',
          fontSize: '14px',
          margin: '0 0 8px 0',
          textAlign: 'center' as const,
          fontFamily: settings.fontFamily,
        }}
      >
        © {new Date().getFullYear()} {block.companyName}. All rights reserved.
      </Text>

      {/* Address if provided */}
      {block.address && (
        <Text
          style={{
            color: '#9ca3af',
            fontSize: '12px',
            margin: '0 0 16px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {block.address}
        </Text>
      )}

      {/* Social links if provided */}
      {block.socialLinks && block.socialLinks.length > 0 && (
        <Row style={{ marginBottom: '16px' }}>
          <Column style={{ textAlign: 'center' as const }}>
            {block.socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                style={{
                  color: '#6b7280',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  margin: '0 8px',
                  fontFamily: settings.fontFamily,
                }}
              >
                {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
              </Link>
            ))}
          </Column>
        </Row>
      )}

      {/* Footer links */}
      <Text
        style={{
          color: '#9ca3af',
          fontSize: '12px',
          margin: '0',
          textAlign: 'center' as const,
          fontFamily: settings.fontFamily,
        }}
      >
        {/* Preference link if provided */}
        {block.preferenceUrl && (
          <>
            <Link
              href={block.preferenceUrl}
              style={{
                color: '#6b7280',
                textDecoration: 'underline',
              }}
            >
              Preferences
            </Link>
            {' • '}
          </>
        )}

        {/* Unsubscribe link (always present) */}
        <Link
          href={block.unsubscribeUrl}
          style={{
            color: '#6b7280',
            textDecoration: 'underline',
          }}
        >
          Unsubscribe
        </Link>

        {/* Additional links if provided */}
        {block.additionalLinks && block.additionalLinks.map((link, index) => (
          <span key={index}>
            {' • '}
            <Link
              href={link.url}
              style={{
                color: '#6b7280',
                textDecoration: 'underline',
              }}
            >
              {link.text}
            </Link>
          </span>
        ))}
      </Text>
    </Section>
  );
}

