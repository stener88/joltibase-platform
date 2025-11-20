/**
 * List Pattern Component
 * 
 * List layouts with 2 variants (numbered and image-left)
 * Uses React Email components with Tailwind for styling
 */

import { Section, Row, Column, Heading, Text, Img, Link, Tailwind } from '@react-email/components';
import type { ListBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface ListPatternProps {
  block: ListBlock;
  settings: GlobalEmailSettings;
}

export function ListPattern({ block, settings }: ListPatternProps) {
  const { variant = 'numbered', heading, items } = block;

  return (
    <Tailwind>
      <Section className="my-[16px]">
        {heading && (
          <Heading className="mb-[42px] text-center text-[24px] leading-[32px]">
            {heading}
          </Heading>
        )}
        {variant === 'numbered' && <NumberedList items={items} />}
        {variant === 'image-left' && <ImageLeftList items={items} />}
      </Section>
    </Tailwind>
  );
}

// Numbered list variant
function NumberedList({ items }: { items: ListBlock['items'] }) {
  return (
    <>
      {items.map((item, index) => (
        <Section key={index} className="mb-[36px]">
          <Row className="pr-[32px] pl-[12px]">
            <Column
              width="24"
              height="24"
              align="center"
              valign="top"
              className="pr-[18px] h-[24px] w-[24px]"
            >
              <Row>
                <Column
                  align="center"
                  valign="middle"
                  width="24"
                  height="24"
                  className="h-[24px] w-[24px] rounded-full bg-indigo-600 font-semibold text-white text-[12px] leading-none"
                >
                  {index + 1}
                </Column>
              </Row>
            </Column>
            <Column valign="top">
              <Heading
                as="h2"
                className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
              >
                {item.title}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {item.description}
              </Text>
              {item.link && (
                <Link
                  href={item.link}
                  className="mt-[12px] block font-semibold text-indigo-600 text-[14px] no-underline"
                >
                  Learn more →
                </Link>
              )}
            </Column>
          </Row>
        </Section>
      ))}
    </>
  );
}

// Image-left list variant
function ImageLeftList({ items }: { items: ListBlock['items'] }) {
  return (
    <>
      {items.map((item, index) => (
        <Section key={index} className="mb-[30px]">
          <Row className="mb-[24px]">
            <Column width="40%" className="w-2/5 pr-[24px]">
              {item.imageUrl && (
                <Img
                  src={item.imageUrl}
                  width="100%"
                  height="168"
                  alt={item.title}
                  className="block w-full rounded-[4px] object-cover object-center"
                />
              )}
            </Column>
            <Column width="60%" className="w-3/5 pr-[24px]">
              <Row
                width="24"
                className="w-[24px] h-[24px] mb-[18px]"
                align={undefined}
              >
                <Column
                  width="24"
                  height="24"
                  className="rounded-full h-[24px] w-[24px] bg-indigo-600 font-semibold text-white text-[12px] leading-none"
                  align="center"
                  valign="middle"
                >
                  {index + 1}
                </Column>
              </Row>
              <Heading
                as="h2"
                className="mt-0 mb-[8px] font-bold text-[20px] leading-none"
              >
                {item.title}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {item.description}
              </Text>
              {item.link && (
                <Link
                  href={item.link}
                  className="mt-[12px] block font-semibold text-indigo-600 text-[14px] no-underline"
                >
                  Learn more →
                </Link>
              )}
            </Column>
          </Row>
        </Section>
      ))}
    </>
  );
}

