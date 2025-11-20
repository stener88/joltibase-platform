/**
 * Marketing Pattern Component
 * 
 * Bento-grid layout for showcasing featured products/offers
 * Single variant: bento-grid (asymmetric grid with large featured item + smaller items)
 * Uses @react-email/components for email-safe rendering
 */

import { Section, Heading, Text, Button, Row, Column, Img } from '@react-email/components';
import type { MarketingBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';
import { isValidImageUrl } from './utils';

interface MarketingPatternProps {
  block: MarketingBlock;
  settings: GlobalEmailSettings;
}

export function MarketingPattern({ block, settings }: MarketingPatternProps) {
  // Only one variant: bento-grid
  return <BentoGrid block={block} settings={settings} />;
}

/**
 * Bento Grid Layout
 * Large featured item on left/top, 2-4 smaller items in grid on right/bottom
 */
function BentoGrid({ block, settings }: MarketingPatternProps) {
  const { heading, subheading, featuredItem, items } = block;

  return (
    <Section
      style={{
        padding: '60px 24px',
      }}
    >
      {/* Header */}
      {heading && (
        <Heading
          as="h2"
          style={{
            color: '#1a1a1a',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {heading}
        </Heading>
      )}

      {subheading && (
        <Text
          style={{
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {subheading}
        </Text>
      )}

      {/* Bento Grid Layout */}
      <Row>
        {/* Featured Item (Left/Top - takes up more space) */}
        <Column
          style={{
            width: '100%',
            maxWidth: '360px',
            verticalAlign: 'top',
            padding: '0 8px 16px 0',
          }}
        >
          <div
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {featuredItem.imageUrl && isValidImageUrl(featuredItem.imageUrl) && (
              <Img
                src={featuredItem.imageUrl}
                alt={featuredItem.imageAlt || featuredItem.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            )}
            <div style={{ padding: '24px' }}>
              <Heading
                as="h3"
                style={{
                  color: '#1a1a1a',
                  fontSize: '24px',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  margin: '0 0 8px 0',
                  fontFamily: settings.fontFamily,
                }}
              >
                {featuredItem.title}
              </Heading>
              {featuredItem.description && (
                <Text
                  style={{
                    color: '#666666',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    margin: '0 0 16px 0',
                    fontFamily: settings.fontFamily,
                  }}
                >
                  {featuredItem.description}
                </Text>
              )}
              {featuredItem.ctaText && featuredItem.ctaUrl && (
                <Button
                  href={featuredItem.ctaUrl}
                  style={{
                    backgroundColor: settings.primaryColor,
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'inline-block',
                    fontFamily: settings.fontFamily,
                  }}
                >
                  {featuredItem.ctaText}
                </Button>
              )}
            </div>
          </div>
        </Column>

        {/* Smaller Items Grid (Right/Bottom) */}
        <Column
          style={{
            width: '100%',
            maxWidth: '360px',
            verticalAlign: 'top',
            padding: '0 0 0 8px',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: index < items.length - 1 ? '16px' : '0',
                padding: '20px',
              }}
            >
              {item.imageUrl && isValidImageUrl(item.imageUrl) && (
                <Img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                />
              )}
              <Heading
                as="h4"
                style={{
                  color: '#1a1a1a',
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  margin: '0 0 8px 0',
                  fontFamily: settings.fontFamily,
                }}
              >
                {item.title}
              </Heading>
              {item.description && (
                <Text
                  style={{
                    color: '#666666',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                    fontFamily: settings.fontFamily,
                  }}
                >
                  {item.description}
                </Text>
              )}
              {item.ctaText && item.ctaUrl && (
                <Button
                  href={item.ctaUrl}
                  style={{
                    backgroundColor: 'transparent',
                    color: settings.primaryColor,
                    padding: '0',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'inline-block',
                    fontFamily: settings.fontFamily,
                  }}
                >
                  {item.ctaText} →
                </Button>
              )}
            </div>
          ))}
        </Column>
      </Row>
    </Section>
  );
}

