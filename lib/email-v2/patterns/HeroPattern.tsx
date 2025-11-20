/**
 * Hero Pattern Component
 * 
 * Full-width hero section with headline, optional subheadline, and CTA button
 * Supports 2 variants: centered (default) and split (content on left, menu/nav on right)
 * Uses @react-email/components for email-safe rendering
 */

import { Section, Heading, Text, Button, Row, Column } from '@react-email/components';
import type { HeroBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';
import { isValidImageUrl } from './utils';

interface HeroPatternProps {
  block: HeroBlock;
  settings: GlobalEmailSettings;
}

export function HeroPattern({ block, settings }: HeroPatternProps) {
  const { variant = 'centered' } = block;

  if (variant === 'split') {
    return <SplitHero block={block} settings={settings} />;
  }

  // Default centered hero
  return (
    <Section
      style={{
        backgroundColor: settings.primaryColor,
        padding: '60px 24px',
        textAlign: 'center' as const,
      }}
    >
      <Heading
        as="h1"
        style={{
          color: '#ffffff',
          fontSize: '42px',
          fontWeight: 700,
          lineHeight: '1.2',
          margin: '0 0 16px 0',
          textAlign: 'center' as const,
          fontFamily: settings.fontFamily,
        }}
      >
        {block.headline}
      </Heading>

      {block.subheadline && (
        <Text
          style={{
            color: '#e9d5ff',
            fontSize: '18px',
            lineHeight: '1.5',
            margin: '0 0 32px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {block.subheadline}
        </Text>
      )}

      {block.imageUrl && isValidImageUrl(block.imageUrl) && (
        <img
          src={block.imageUrl}
          alt={block.headline}
          style={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            margin: '0 auto 32px',
            borderRadius: '8px',
            display: 'block',
          }}
        />
      )}

      <Button
        href={block.ctaUrl}
        style={{
          backgroundColor: '#ffffff',
          color: settings.primaryColor,
          padding: '16px 40px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-block',
          fontFamily: settings.fontFamily,
        }}
      >
        {block.ctaText}
      </Button>
    </Section>
  );
}

// Split variant with two-column layout
function SplitHero({ block, settings }: HeroPatternProps) {
  return (
    <Section
      style={{
        backgroundColor: settings.primaryColor,
        padding: '60px 24px',
      }}
    >
      <Row>
        <Column
          style={{
            width: '60%',
            paddingRight: '24px',
            verticalAlign: 'middle',
          }}
        >
          <Heading
            as="h1"
            style={{
              color: '#ffffff',
              fontSize: '42px',
              fontWeight: 700,
              lineHeight: '1.2',
              margin: '0 0 16px 0',
              fontFamily: settings.fontFamily,
            }}
          >
            {block.headline}
          </Heading>

          {block.subheadline && (
            <Text
              style={{
                color: '#e9d5ff',
                fontSize: '18px',
                lineHeight: '1.5',
                margin: '0 0 32px 0',
                fontFamily: settings.fontFamily,
              }}
            >
              {block.subheadline}
            </Text>
          )}

          <Button
            href={block.ctaUrl}
            style={{
              backgroundColor: '#ffffff',
              color: settings.primaryColor,
              padding: '16px 40px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
              fontFamily: settings.fontFamily,
            }}
          >
            {block.ctaText}
          </Button>
        </Column>

        <Column
          style={{
            width: '40%',
            paddingLeft: '24px',
            verticalAlign: 'middle',
          }}
        >
          {block.imageUrl && isValidImageUrl(block.imageUrl) && (
            <img
              src={block.imageUrl}
              alt={block.headline}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          )}
        </Column>
      </Row>
    </Section>
  );
}

