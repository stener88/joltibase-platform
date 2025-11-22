/**
 * Features Pattern Component
 * 
 * Multiple layout variants for features sections
 * Variants: grid, list, numbered, icons-2col, icons-centered
 */

import { Section, Heading, Text, Row, Column, Hr, Img, Tailwind } from '@react-email/components';
import type { FeaturesBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface FeaturesPatternProps {
  block: FeaturesBlock;
  settings: GlobalEmailSettings;
}

export function FeaturesPattern({ block, settings }: FeaturesPatternProps) {
  const { variant = 'numbered-list', layout = 'grid' } = block;

  return (
    <Tailwind>
      {variant === 'list-items' && <ListVariant block={block} settings={settings} />}
      {variant === 'numbered-list' && <NumberedVariant block={block} settings={settings} />}
      {variant === 'four-paragraphs-two-columns' && <GridVariant block={block} settings={settings} />}
      {variant === 'four-paragraphs' && <GridVariant block={block} settings={settings} />}
      {variant === 'three-centered-paragraphs' && <IconsCenteredVariant block={block} settings={settings} />}
      {/* Fallback to numbered-list if variant doesn't match */}
      {!['list-items', 'numbered-list', 'four-paragraphs-two-columns', 'four-paragraphs', 'three-centered-paragraphs'].includes(variant) && (
        <NumberedVariant block={block} settings={settings} />
      )}
    </Tailwind>
  );
}

// Grid Variant (default)
function GridVariant({ block, settings }: FeaturesPatternProps) {
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

// List Variant with horizontal dividers
function ListVariant({ block, settings }: FeaturesPatternProps) {
  return (
    <Section className="my-[16px]">
      <Section>
        <Row>
          {block.heading && (
            <Text className="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
              {block.heading}
            </Text>
          )}
          {block.subheading && (
            <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              {block.subheading}
            </Text>
          )}
        </Row>
      </Section>
      <Section>
        <Hr className="!border-gray-300 mx-0 my-[32px] w-full border border-solid" />
        {block.features.map((feature, index) => (
          <div key={index}>
            <Section>
              <Row>
                {feature.imageUrl && (
                  <Column className="align-baseline">
                    <Img
                      alt={feature.title}
                      height="48"
                      src={feature.imageUrl}
                      width="48"
                    />
                  </Column>
                )}
                <Column className="w-[85%]">
                  <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
                    {feature.title}
                  </Text>
                  <Text className="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                    {feature.description}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr className="!border-gray-300 mx-0 my-[32px] w-full border border-solid" />
          </div>
        ))}
      </Section>
    </Section>
  );
}

// Numbered List Variant
function NumberedVariant({ block, settings }: FeaturesPatternProps) {
  return (
    <Section className="my-[16px]">
      <Section className="pb-[24px]">
        <Row>
          {block.heading && (
            <Text className="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
              {block.heading}
            </Text>
          )}
          {block.subheading && (
            <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              {block.subheading}
            </Text>
          )}
        </Row>
      </Section>
      {block.features.map((feature, index) => (
        <div key={index}>
          <Hr className="!border-gray-300 m-0 w-full border border-solid" />
          <Section className="py-[24px]">
            <Row>
              <Column
                width="48"
                height="40"
                className="w-[40px] h-[40px] pr-[8px]"
                valign="baseline"
              >
                <Row width="40" align="left">
                  <Column
                    align="center"
                    valign="middle"
                    width="40"
                    height="40"
                    className="h-[40px] font-semibold w-[40px] rounded-full bg-indigo-200 text-indigo-600 p-0"
                  >
                    {index + 1}
                  </Column>
                </Row>
              </Column>
              <Column width="100%" className="w-full">
                <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
                  {feature.title}
                </Text>
                <Text className="m-0 pt-[8px] text-[16px] text-gray-500 leading-[24px]">
                  {feature.description}
                </Text>
              </Column>
            </Row>
          </Section>
        </div>
      ))}
    </Section>
  );
}

// 2-Column with Icons
function Icons2ColVariant({ block, settings }: FeaturesPatternProps) {
  return (
    <Section className="my-[16px]">
      <Row>
        {block.heading && (
          <Text className="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
            {block.heading}
          </Text>
        )}
        {block.subheading && (
          <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            {block.subheading}
          </Text>
        )}
      </Row>
      <Row className="mt-[16px]">
        {block.features.slice(0, 2).map((feature, index) => (
          <Column key={index} className="w-1/2 pr-[12px] align-baseline" colSpan={1}>
            {feature.imageUrl && (
              <Img
                alt={feature.title}
                height="48"
                src={feature.imageUrl}
                width="48"
              />
            )}
            <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]">
              {feature.title}
            </Text>
            <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
              {feature.description}
            </Text>
          </Column>
        ))}
      </Row>
      {block.features.length > 2 && (
        <Row className="mt-[32px]">
          {block.features.slice(2, 4).map((feature, index) => (
            <Column key={index} className="w-1/2 pr-[12px] align-baseline" colSpan={1}>
              {feature.imageUrl && (
                <Img
                  alt={feature.title}
                  height="48"
                  src={feature.imageUrl}
                  width="48"
                />
              )}
              <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]">
                {feature.title}
              </Text>
              <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
                {feature.description}
              </Text>
            </Column>
          ))}
        </Row>
      )}
    </Section>
  );
}

// Centered Icons Variant (3-column centered)
function IconsCenteredVariant({ block, settings }: FeaturesPatternProps) {
  return (
    <Section className="my-[16px]">
      <Row>
        {block.heading && (
          <Text className="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
            {block.heading}
          </Text>
        )}
        {block.subheading && (
          <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            {block.subheading}
          </Text>
        )}
      </Row>
      <Row className="mt-[16px]">
        {block.features.slice(0, 3).map((feature, index) => (
          <Column key={index} align="center" className="w-1/3 pl-[12px] align-baseline">
            {feature.imageUrl && (
              <Img
                alt={feature.title}
                height="48"
                src={feature.imageUrl}
                width="48"
              />
            )}
            <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[24px]">
              {feature.title}
            </Text>
            <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
              {feature.description}
            </Text>
          </Column>
        ))}
      </Row>
    </Section>
  );
}
