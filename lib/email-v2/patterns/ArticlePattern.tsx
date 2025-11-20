/**
 * Article Pattern Component
 * 
 * Article/blog post layouts with 6 variants
 * Uses React Email components with Tailwind for styling
 */

import { Section, Row, Column, Heading, Text, Button, Img, Link, Hr, Tailwind } from '@react-email/components';
import type { ArticleBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface ArticlePatternProps {
  block: ArticleBlock;
  settings: GlobalEmailSettings;
}

export function ArticlePattern({ block, settings }: ArticlePatternProps) {
  const { variant = 'image-top' } = block;

  return (
    <Tailwind>
      {variant === 'image-top' && <ImageTop block={block} />}
      {variant === 'image-right' && <ImageRight block={block} />}
      {variant === 'image-background' && <ImageBackground block={block} />}
      {variant === 'two-cards' && <TwoCards block={block} />}
      {variant === 'single-author' && <SingleAuthor block={block} />}
      {variant === 'multiple-authors' && <MultipleAuthors block={block} />}
    </Tailwind>
  );
}

// Image Top Variant
function ImageTop({ block }: { block: ArticleBlock }) {
  return (
    <Section className="my-[16px]">
      {block.imageUrl && (
        <Img
          alt={block.imageAlt || block.headline}
          className="w-full rounded-[12px] object-cover"
          height="320"
          src={block.imageUrl}
        />
      )}
      <Section className="mt-[32px] text-center">
        {block.eyebrow && (
          <Text className="my-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]">
            {block.eyebrow}
          </Text>
        )}
        <Heading
          as="h1"
          className="m-0 mt-[8px] font-semibold text-[36px] text-gray-900 leading-[36px]"
        >
          {block.headline}
        </Heading>
        {block.excerpt && (
          <Text className="text-[16px] text-gray-500 leading-[24px]">
            {block.excerpt}
          </Text>
        )}
        {block.ctaText && block.ctaUrl && (
          <Button
            className="mt-[16px] mb-[32px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
            href={block.ctaUrl}
          >
            {block.ctaText}
          </Button>
        )}
      </Section>
    </Section>
  );
}

// Image Right Variant
function ImageRight({ block }: { block: ArticleBlock }) {
  return (
    <Section className="my-[16px] text-center">
      <Section className="inline-block w-full max-w-[250px] text-left align-top">
        {block.eyebrow && (
          <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
            {block.eyebrow}
          </Text>
        )}
        <Text className="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]">
          {block.headline}
        </Text>
        {block.excerpt && (
          <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            {block.excerpt}
          </Text>
        )}
        {block.ctaText && block.ctaUrl && (
          <Link className="text-indigo-600 underline" href={block.ctaUrl}>
            {block.ctaText}
          </Link>
        )}
      </Section>
      {block.imageUrl && (
        <Section className="my-[8px] inline-block w-full max-w-[220px] align-top">
          <Img
            alt={block.imageAlt || block.headline}
            className="rounded-[8px] object-cover"
            height={220}
            src={block.imageUrl}
            width={220}
          />
        </Section>
      )}
    </Section>
  );
}

// Image Background Variant
function ImageBackground({ block }: { block: ArticleBlock }) {
  return (
    <table
      align="center"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      className="my-[16px] h-[424px] rounded-[12px] bg-blue-600"
      role="presentation"
      style={{
        backgroundImage: block.imageUrl ? `url('${block.imageUrl}')` : undefined,
        backgroundSize: '100% 100%',
      }}
      width="100%"
    >
      <tbody>
        <tr>
          <td align="center" className="p-[40px] text-center">
            {block.eyebrow && (
              <Text className="m-0 font-semibold text-gray-200">
                {block.eyebrow}
              </Text>
            )}
            <Heading as="h1" className="m-0 mt-[4px] font-bold text-white">
              {block.headline}
            </Heading>
            {block.excerpt && (
              <Text className="m-0 mt-[8px] text-[16px] text-white leading-[24px]">
                {block.excerpt}
              </Text>
            )}
            {block.ctaText && block.ctaUrl && (
              <Button
                className="mt-[24px] mb-[32px] rounded-[8px] border border-gray-200 border-solid bg-white px-[40px] py-[12px] font-semibold text-gray-900"
                href={block.ctaUrl}
              >
                {block.ctaText}
              </Button>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// Two Cards Variant
function TwoCards({ block }: { block: ArticleBlock }) {
  // Split content into two cards (simplified version)
  return (
    <Section className="my-[16px]">
      <Row>
        {block.eyebrow && (
          <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
            {block.eyebrow}
          </Text>
        )}
        {block.excerpt && (
          <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            {block.excerpt}
          </Text>
        )}
      </Row>
      <Row className="mt-[16px]">
        <Column
          className="box-border w-[50%] pr-[8px] align-baseline"
          colSpan={1}
        >
          {block.imageUrl && (
            <Img
              alt={block.imageAlt || block.headline}
              className="w-full rounded-[8px] object-cover"
              height="180"
              src={block.imageUrl}
            />
          )}
          <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
            {block.headline}
          </Text>
          {block.excerpt && (
            <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
              {block.excerpt.substring(0, 120)}...
            </Text>
          )}
        </Column>
        <Column
          className="box-border w-[50%] pl-[8px] align-baseline"
          colSpan={1}
        >
          {block.imageUrl && (
            <Img
              alt="Related"
              className="w-full rounded-[8px] object-cover"
              height="180"
              src={block.imageUrl}
            />
          )}
          <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
            Related Article
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            Discover more insights on this topic.
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

// Single Author Variant
function SingleAuthor({ block }: { block: ArticleBlock }) {
  return (
    <Section>
      {block.imageUrl && (
        <Img
          alt={block.imageAlt || block.headline}
          className="w-full rounded-[12px] object-cover"
          height="320"
          src={block.imageUrl}
        />
      )}
      <Section className="mt-[32px]">
        {block.eyebrow && (
          <Text className="my-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]">
            {block.eyebrow}
          </Text>
        )}
        <Heading
          as="h1"
          className="m-0 mt-[8px] font-semibold text-[36px] text-gray-900 leading-[36px]"
        >
          {block.headline}
        </Heading>
        {block.excerpt && (
          <Text className="text-[16px] text-gray-500 leading-[24px]">
            {block.excerpt}
          </Text>
        )}
      </Section>
      {block.author && (
        <>
          <Hr className="!border-gray-300 my-[16px]" />
          <Row width={undefined}>
            <Column
              width="48"
              height="48"
              className="pt-[5px] h-[48px] w-[48px]"
              align="left"
            >
              {block.author.imageUrl && (
                <Img
                  alt={block.author.name}
                  className="block h-[48px] w-[48px] rounded-full object-cover object-center"
                  height="48"
                  src={block.author.imageUrl}
                  width="48"
                />
              )}
            </Column>
            <Column
              width="120"
              className="pl-[18px] w-[120px]"
              align="left"
              valign="top"
            >
              <Heading
                as="h3"
                className="m-[0px] font-medium text-[14px] text-gray-800 leading-[20px]"
              >
                {block.author.name}
              </Heading>
              {block.author.title && (
                <Text className="m-[0px] font-medium text-[12px] text-gray-500 leading-[14px]">
                  {block.author.title}
                </Text>
              )}
            </Column>
          </Row>
        </>
      )}
    </Section>
  );
}

// Multiple Authors Variant
function MultipleAuthors({ block }: { block: ArticleBlock }) {
  return (
    <Section>
      {block.imageUrl && (
        <Img
          alt={block.imageAlt || block.headline}
          className="w-full rounded-[12px] object-cover"
          height="320"
          src={block.imageUrl}
        />
      )}
      <Section className="mt-[32px]">
        {block.eyebrow && (
          <Text className="my-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]">
            {block.eyebrow}
          </Text>
        )}
        <Heading
          as="h1"
          className="m-0 mt-[8px] font-semibold text-[36px] text-gray-900 leading-[36px]"
        >
          {block.headline}
        </Heading>
        {block.excerpt && (
          <Text className="text-[16px] text-gray-500 leading-[24px]">
            {block.excerpt}
          </Text>
        )}
      </Section>
      {block.author && (
        <>
          <Hr className="!border-gray-300 mt-[16px] mb-[0px]" />
          <Row align="left" width="288" className="pt-[16px] w-[288px]">
            <Column
              width="48"
              height="48"
              align="left"
              className="pt-[5px] h-[48px] w-[48px]"
            >
              {block.author.imageUrl && (
                <Img
                  alt={block.author.name}
                  className="block rounded-full object-cover object-center"
                  height={48}
                  src={block.author.imageUrl}
                  width={48}
                />
              )}
            </Column>
            <Column
              width="100%"
              className="pl-[18px] w-full"
              align="left"
              valign="top"
            >
              <Heading
                as="h3"
                className="m-0 font-medium text-[14px] text-gray-900 leading-[20px]"
              >
                {block.author.name}
              </Heading>
              {block.author.title && (
                <Text className="m-0 font-medium text-[12px] text-gray-500 leading-[14px]">
                  {block.author.title}
                </Text>
              )}
            </Column>
          </Row>
        </>
      )}
    </Section>
  );
}

