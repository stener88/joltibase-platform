/**
 * Features Pattern Component
 * 
 * Grid layout of 2-4 features with titles and descriptions
 * Uses Row/Column for responsive email-safe grid
 */

import { Section, Heading, Text, Row, Column } from '@react-email/components';
import type { FeaturesBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface FeaturesPatternProps {
  block: FeaturesBlock;
  settings: GlobalEmailSettings;
}

export function FeaturesPattern({ block, settings }: FeaturesPatternProps) {
  // Calculate column width based on feature count
  const featureCount = block.features.length;
  const columnWidth = featureCount === 2 ? '50%' : featureCount === 3 ? '33.33%' : '25%';

  return (
    <Section
      style={{
        padding: '48px 24px',
        backgroundColor: '#ffffff',
      }}
    >
      {block.heading && (
        <Heading
          as="h2"
          style={{
            color: '#111827',
            fontSize: '32px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {block.heading}
        </Heading>
      )}

      {block.subheading && (
        <Text
          style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: '0 0 40px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {block.subheading}
        </Text>
      )}

      <Row>
        {block.features.map((feature, index) => (
          <Column
            key={index}
            style={{
              width: columnWidth,
              padding: '16px',
              verticalAlign: 'top',
            }}
          >
            <Heading
              as="h3"
              style={{
                color: '#111827',
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 0 8px 0',
                fontFamily: settings.fontFamily,
              }}
            >
              {feature.title}
            </Heading>
            <Text
              style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0',
                fontFamily: settings.fontFamily,
              }}
            >
              {feature.description}
            </Text>
          </Column>
        ))}
      </Row>
    </Section>
  );
}

