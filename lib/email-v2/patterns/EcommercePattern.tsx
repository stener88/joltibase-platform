/**
 * Ecommerce Pattern Component
 * 
 * Product showcase layouts with 5 variants
 * Uses React Email components with Tailwind for styling
 */

import { Section, Row, Column, Heading, Text, Button, Img, Tailwind } from '@react-email/components';
import type { EcommerceBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface EcommercePatternProps {
  block: EcommerceBlock;
  settings: GlobalEmailSettings;
}

export function EcommercePattern({ block, settings }: EcommercePatternProps) {
  const { variant = 'single' } = block;

  return (
    <Tailwind>
      {variant === 'single' && <SingleProduct block={block} />}
      {variant === 'image-left' && <ImageLeftProduct block={block} />}
      {variant === '3-column' && <ThreeColumnProducts block={block} />}
      {variant === '4-grid' && <FourGridProducts block={block} />}
      {variant === 'checkout' && <CheckoutCart block={block} />}
    </Tailwind>
  );
}

// Single Product Centered
function SingleProduct({ block }: { block: EcommerceBlock }) {
  const product = block.products[0];
  if (!product) return null;

  return (
    <Section className="my-[16px]">
      <Img
        alt={product.name}
        className="w-full rounded-[12px] object-cover"
        height={320}
        src={product.imageUrl}
      />
      <Section className="mt-[32px] text-center">
        {block.heading && (
          <Text className="mt-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]">
            {block.heading}
          </Text>
        )}
        <Heading
          as="h1"
          className="font-semibold text-[36px] text-gray-900 leading-[40px] tracking-[0.4px]"
        >
          {product.name}
        </Heading>
        {product.description && (
          <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            {product.description}
          </Text>
        )}
        <Text className="font-semibold text-[16px] text-gray-900 leading-[24px]">
          {product.price}
        </Text>
        <Button
          className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href={product.ctaUrl}
        >
          {product.ctaText}
        </Button>
      </Section>
    </Section>
  );
}

// Product with Image on Left
function ImageLeftProduct({ block }: { block: EcommerceBlock }) {
  const product = block.products[0];
  if (!product) return null;

  return (
    <Section className="my-[16px]">
      <table className="w-full">
        <tbody className="w-full">
          <tr className="w-full">
            <td className="box-border w-1/2 pr-[32px]">
              <Img
                alt={product.name}
                className="w-full rounded-[8px] object-cover"
                height={220}
                src={product.imageUrl}
              />
            </td>
            <td className="w-1/2 align-baseline">
              <Text className="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]">
                {product.name}
              </Text>
              {product.description && (
                <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                  {product.description}
                </Text>
              )}
              <Text className="mt-[8px] font-semibold text-[18px] text-gray-900 leading-[28px]">
                {product.price}
              </Text>
              <Button
                className="w-3/4 rounded-[8px] bg-indigo-600 px-[16px] py-[12px] text-center font-semibold text-white"
                href={product.ctaUrl}
              >
                {product.ctaText}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

// Three Products in a Row
function ThreeColumnProducts({ block }: { block: EcommerceBlock }) {
  return (
    <Section className="my-[16px]">
      {(block.heading || block.subheading) && (
        <Row>
          {block.heading && (
            <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
              {block.heading}
            </Text>
          )}
          {block.subheading && (
            <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              {block.subheading}
            </Text>
          )}
        </Row>
      )}
      <Row className="mt-[16px]">
        {block.products.slice(0, 3).map((product, index) => (
          <Column key={index} className="py-[16px] pr-[4px] text-left">
            <Img
              alt={product.name}
              className="w-full rounded-[8px] object-cover"
              height={180}
              src={product.imageUrl}
            />
            <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
              {product.name}
            </Text>
            {product.description && (
              <Text className="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
                {product.description}
              </Text>
            )}
            <Text className="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
              {product.price}
            </Text>
            <Button
              className="mt-[16px] mb-[24px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
              href={product.ctaUrl}
            >
              {product.ctaText}
            </Button>
          </Column>
        ))}
      </Row>
    </Section>
  );
}

// Four Products in a Grid (2x2)
function FourGridProducts({ block }: { block: EcommerceBlock }) {
  return (
    <Section className="my-[16px]">
      {(block.heading || block.subheading) && (
        <Section>
          <Row>
            {block.heading && (
              <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
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
            {block.products.slice(0, 2).map((product, index) => (
              <Column key={index} align="left" className="w-1/2 pr-[8px]" colSpan={1}>
                <Img
                  alt={product.name}
                  className="w-full rounded-[8px] object-cover"
                  height={250}
                  src={product.imageUrl}
                />
                <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
                  {product.name}
                </Text>
                {product.description && (
                  <Text className="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
                    {product.description}
                  </Text>
                )}
                <Text className="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
                  {product.price}
                </Text>
                <Button
                  className="mt-[16px] mb-[24px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
                  href={product.ctaUrl}
                >
                  {product.ctaText}
                </Button>
              </Column>
            ))}
          </Row>
        </Section>
      )}
      {block.products.length > 2 && (
        <Section>
          <Row>
            {block.products.slice(2, 4).map((product, index) => (
              <Column key={index} align="left" className="w-1/2 pl-[8px]" colSpan={1}>
                <Img
                  alt={product.name}
                  className="w-full rounded-[8px] object-cover"
                  height={250}
                  src={product.imageUrl}
                />
                <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
                  {product.name}
                </Text>
                {product.description && (
                  <Text className="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
                    {product.description}
                  </Text>
                )}
                <Text className="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
                  {product.price}
                </Text>
                <Button
                  className="mt-[16px] mb-[24px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
                  href={product.ctaUrl}
                >
                  {product.ctaText}
                </Button>
              </Column>
            ))}
          </Row>
        </Section>
      )}
    </Section>
  );
}

// Checkout Cart Table
function CheckoutCart({ block }: { block: EcommerceBlock }) {
  const total = block.products.reduce((sum, product) => {
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <Section className="py-[16px] text-center">
      <Heading as="h1" className="mb-0 font-semibold text-[30px] leading-[36px]">
        {block.heading || 'Your Cart'}
      </Heading>
      <Section className="my-[16px] rounded-[8px] border border-gray-200 border-solid p-[16px] pt-0">
        <table className="mb-[16px]" width="100%">
          <tr>
            <th className="border-0 border-gray-200 border-b border-solid py-[8px]">
              &nbsp;
            </th>
            <th
              align="left"
              className="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
              colSpan={6}
            >
              <Text className="font-semibold">Product</Text>
            </th>
            <th
              align="center"
              className="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
            >
              <Text className="font-semibold">Quantity</Text>
            </th>
            <th
              align="center"
              className="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
            >
              <Text className="font-semibold">Price</Text>
            </th>
          </tr>
          {block.products.map((product, index) => (
            <tr key={index}>
              <td className="border-0 border-gray-200 border-b border-solid py-[8px]">
                <Img
                  alt={product.name}
                  className="rounded-[8px] object-cover"
                  height={110}
                  src={product.imageUrl}
                />
              </td>
              <td
                align="left"
                className="border-0 border-gray-200 border-b border-solid py-[8px]"
                colSpan={6}
              >
                <Text>{product.name}</Text>
              </td>
              <td
                align="center"
                className="border-0 border-gray-200 border-b border-solid py-[8px]"
              >
                <Text>1</Text>
              </td>
              <td
                align="center"
                className="border-0 border-gray-200 border-b border-solid py-[8px]"
              >
                <Text>{product.price}</Text>
              </td>
            </tr>
          ))}
        </table>
        <Row>
          <Column align="center">
            <Button
              className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
              href={block.products[0]?.ctaUrl || '#'}
            >
              {block.products[0]?.ctaText || 'Checkout'}
            </Button>
          </Column>
        </Row>
      </Section>
    </Section>
  );
}

