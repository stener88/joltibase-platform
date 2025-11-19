/**
 * Testimonial Pattern Component
 * 
 * Customer testimonial with quote and author information
 * Optional author image and rating display
 */

import { Section, Text, Row, Column, Img } from '@react-email/components';
import type { TestimonialBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface TestimonialPatternProps {
  block: TestimonialBlock;
  settings: GlobalEmailSettings;
}

export function TestimonialPattern({ block, settings }: TestimonialPatternProps) {
  return (
    <Section
      style={{
        backgroundColor: '#f9fafb',
        padding: '48px 24px',
      }}
    >
      {/* Quote */}
      <Text
        style={{
          color: '#111827',
          fontSize: '20px',
          fontStyle: 'italic',
          lineHeight: '1.6',
          margin: '0 0 24px 0',
          textAlign: 'center' as const,
          fontFamily: settings.fontFamily,
        }}
      >
        "{block.quote}"
      </Text>

      {/* Rating stars if provided */}
      {block.rating && (
        <Text
          style={{
            fontSize: '20px',
            margin: '0 0 16px 0',
            textAlign: 'center' as const,
          }}
        >
          {'★'.repeat(block.rating)}
          {'☆'.repeat(5 - block.rating)}
        </Text>
      )}

      {/* Author info */}
      <Row>
        <Column
          style={{
            textAlign: 'center' as const,
          }}
        >
          {block.authorImage && (
            <Img
              src={block.authorImage}
              alt={block.authorName}
              width={64}
              height={64}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                margin: '0 auto 12px',
                display: 'block',
              }}
            />
          )}

          <Text
            style={{
              color: '#111827',
              fontSize: '16px',
              fontWeight: 600,
              margin: '0',
              fontFamily: settings.fontFamily,
            }}
          >
            {block.authorName}
          </Text>

          {(block.authorTitle || block.authorCompany) && (
            <Text
              style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: '4px 0 0 0',
                fontFamily: settings.fontFamily,
              }}
            >
              {[block.authorTitle, block.authorCompany].filter(Boolean).join(' at ')}
            </Text>
          )}
        </Column>
      </Row>
    </Section>
  );
}

