/**
 * Testimonial Pattern Component
 * 
 * Customer testimonial with quote and author information
 * Variants: centered (default) and large-avatar (side-by-side layout)
 */

import { Section, Text, Row, Column, Img, Tailwind } from '@react-email/components';
import type { TestimonialBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';
import { isValidImageUrl } from './utils';

interface TestimonialPatternProps {
  block: TestimonialBlock;
  settings: GlobalEmailSettings;
}

export function TestimonialPattern({ block, settings }: TestimonialPatternProps) {
  const { variant = 'centered' } = block;

  return (
    <Tailwind>
      {variant === 'centered' && <CenteredTestimonial block={block} settings={settings} />}
      {variant === 'large-avatar' && <LargeAvatarTestimonial block={block} settings={settings} />}
    </Tailwind>
  );
}

// Centered Testimonial (default)
function CenteredTestimonial({ block, settings }: TestimonialPatternProps) {
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
          {block.authorImage && isValidImageUrl(block.authorImage) && (
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

// Large Avatar Testimonial (side-by-side layout)
function LargeAvatarTestimonial({ block, settings }: TestimonialPatternProps) {
  return (
    <Section className="mx-[12px] my-[16px] text-[14px] text-gray-600">
      <Row>
        {block.authorImage && isValidImageUrl(block.authorImage) && (
          <Column className="mt-0 mr-[24px] mb-[24px] ml-0 w-64 overflow-hidden rounded-3xl">
            <Img
              src={block.authorImage}
              width={320}
              height={320}
              alt={block.authorName}
              className="h-[320px] w-full object-cover object-center"
            />
          </Column>
        )}
        <Column className="pr-[24px]">
          {/* Rating stars if provided */}
          {block.rating && (
            <Text className="mx-0 mt-0 mb-[16px] text-[20px]">
              {'★'.repeat(block.rating)}
              {'☆'.repeat(5 - block.rating)}
            </Text>
          )}
          <p className="mx-0 my-0 mb-[24px] text-left text-[16px] leading-[1.625] font-light text-gray-700">
            "{block.quote}"
          </p>
          <p className="mx-0 mt-0 mb-[4px] text-left text-[16px] font-semibold text-gray-800">
            {block.authorName}
          </p>
          {(block.authorTitle || block.authorCompany) && (
            <p className="m-0 text-left text-[14px] text-gray-600">
              {[block.authorTitle, block.authorCompany].filter(Boolean).join(' at ')}
            </p>
          )}
        </Column>
      </Row>
    </Section>
  );
}
