/**
 * Content Pattern Component
 * 
 * Text content section with optional heading and image
 * Image can be positioned top, bottom, left, or right
 */

import { Section, Heading, Text, Row, Column, Img } from '@react-email/components';
import type { ContentBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface ContentPatternProps {
  block: ContentBlock;
  settings: GlobalEmailSettings;
}

export function ContentPattern({ block, settings }: ContentPatternProps) {
  // For left/right layouts, use Row with Columns
  const hasImage = !!block.imageUrl;
  const isHorizontalLayout = hasImage && (block.imagePosition === 'left' || block.imagePosition === 'right');

  if (isHorizontalLayout) {
    return (
      <Section style={{ padding: '48px 24px' }}>
        <Row>
          {block.imagePosition === 'left' && hasImage && (
            <Column style={{ width: '40%', paddingRight: '16px', verticalAlign: 'top' }}>
              <Img
                src={block.imageUrl!}
                alt={block.imageAlt || ''}
                width={240}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </Column>
          )}

          <Column style={{ width: hasImage ? '60%' : '100%', verticalAlign: 'top' }}>
            {block.heading && (
              <Heading
                as="h2"
                style={{
                  color: '#111827',
                  fontSize: '28px',
                  fontWeight: 700,
                  margin: '0 0 16px 0',
                  fontFamily: settings.fontFamily,
                }}
              >
                {block.heading}
              </Heading>
            )}

            {block.paragraphs.map((paragraph, index) => (
              <Text
                key={index}
                style={{
                  color: '#374151',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  margin: index === block.paragraphs.length - 1 ? '0' : '0 0 16px 0',
                  fontFamily: settings.fontFamily,
                }}
              >
                {paragraph}
              </Text>
            ))}
          </Column>

          {block.imagePosition === 'right' && hasImage && (
            <Column style={{ width: '40%', paddingLeft: '16px', verticalAlign: 'top' }}>
              <Img
                src={block.imageUrl!}
                alt={block.imageAlt || ''}
                width={240}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </Column>
          )}
        </Row>
      </Section>
    );
  }

  // For top/bottom or no image, use simple vertical layout
  return (
    <Section style={{ padding: '48px 24px' }}>
      {block.heading && (
        <Heading
          as="h2"
          style={{
            color: '#111827',
            fontSize: '28px',
            fontWeight: 700,
            margin: '0 0 24px 0',
            fontFamily: settings.fontFamily,
          }}
        >
          {block.heading}
        </Heading>
      )}

      {hasImage && block.imagePosition === 'top' && (
        <Img
          src={block.imageUrl!}
          alt={block.imageAlt || ''}
          width={600}
          style={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            margin: '0 0 24px 0',
            borderRadius: '8px',
          }}
        />
      )}

      {block.paragraphs.map((paragraph, index) => (
        <Text
          key={index}
          style={{
            color: '#374151',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: index === block.paragraphs.length - 1 ? '0' : '0 0 16px 0',
            fontFamily: settings.fontFamily,
          }}
        >
          {paragraph}
        </Text>
      ))}

      {hasImage && block.imagePosition === 'bottom' && (
        <Img
          src={block.imageUrl!}
          alt={block.imageAlt || ''}
          width={600}
          style={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            margin: '24px 0 0 0',
            borderRadius: '8px',
          }}
        />
      )}
    </Section>
  );
}

