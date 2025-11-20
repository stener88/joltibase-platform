/**
 * Pricing Pattern Component
 * 
 * Pricing tables with 2 layout variants
 * Uses React Email components with Tailwind for styling
 */

import { Section, Row, Column, Heading, Text, Button, Hr, Tailwind } from '@react-email/components';
import type { PricingBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface PricingPatternProps {
  block: PricingBlock;
  settings: GlobalEmailSettings;
}

export function PricingPattern({ block, settings }: PricingPatternProps) {
  const { variant = 'simple', heading, subheading, plans } = block;

  return (
    <Tailwind>
      <Section className="bg-white rounded-[12px] mx-auto max-w-[600px] p-[24px]">
        {/* Header */}
        {(heading || subheading) && (
          <Section className="mb-[42px]">
            {heading && (
              <Heading className="text-[24px] leading-[32px] mb-[12px] text-center">
                {heading}
              </Heading>
            )}
            {subheading && (
              <Text className="text-gray-500 text-[14px] leading-[20px] mx-auto max-w-[500px] text-center">
                {subheading}
              </Text>
            )}
          </Section>
        )}

        {/* Pricing Layout */}
        {variant === 'simple' && plans.length === 1 && <SimplePricing plan={plans[0]} />}
        {variant === 'two-tier' && <TwoTierPricing plans={plans} />}
        {variant === 'simple' && plans.length > 1 && <TwoTierPricing plans={plans} />}
      </Section>
    </Tailwind>
  );
}

// Simple single pricing card
function SimplePricing({ plan }: { plan: PricingBlock['plans'][0] }) {
  return (
    <Section className="bg-white border border-solid border-gray-300 rounded-[12px] text-gray-600 p-[28px] w-full text-left mb-0">
      <Text className="text-indigo-600 text-[12px] leading-[20px] font-semibold tracking-wide mb-[16px] mt-[16px] uppercase">
        {plan.highlighted ? 'Exclusive Offer' : plan.name}
      </Text>
      <Text className="text-[30px] font-bold leading-[36px] mb-[12px] mt-0">
        <span className="text-[rgb(16,24,40)]">{plan.price}</span>{' '}
        {plan.interval && (
          <span className="text-[16px] font-medium leading-[20px]">
            / {plan.interval}
          </span>
        )}
      </Text>
      {plan.description && (
        <Text className="text-gray-700 text-[14px] leading-[20px] mt-[16px] mb-[24px]">
          {plan.description}
        </Text>
      )}
      <ul className="text-gray-500 text-[14px] leading-[24px] mb-[32px] pl-[14px]">
        {plan.features.map((feature, index) => (
          <li key={index} className="mb-[12px] relative">
            <span className="relative">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        href={plan.ctaUrl}
        className="bg-indigo-600 rounded-[8px] box-border text-white inline-block text-[16px] leading-[24px] font-bold tracking-wide mb-[24px] max-w-full p-[14px] text-center w-full"
      >
        {plan.ctaText}
      </Button>
      <Hr />
      <Text className="text-gray-500 text-[12px] leading-[16px] italic mt-[24px] mb-[6px] text-center">
        Limited time offer - Upgrade now and save 20%
      </Text>
      <Text className="text-gray-500 text-[12px] m-0 leading-[16px] text-center">
        No credit card required. 14-day free trial available.
      </Text>
    </Section>
  );
}

// Two-tier comparison pricing
function TwoTierPricing({ plans }: { plans: PricingBlock['plans'] }) {
  return (
    <Section className="flex items-start gap-[20px] justify-center pb-[24px]">
      {plans.slice(0, 2).map((plan, index) => (
        <Section
          key={index}
          className={`${
            plan.highlighted
              ? 'bg-[rgb(16,24,40)] border-[rgb(16,24,40)] text-gray-300 mb-[12px]'
              : 'bg-white border-gray-300 text-gray-600 mb-[24px]'
          } rounded-[8px] border border-solid p-[24px] text-left w-full`}
        >
          <Text
            className={`${
              plan.highlighted
                ? 'text-[rgb(124,134,255)]'
                : 'text-[rgb(79,70,229)]'
            } text-[14px] leading-[20px] font-semibold mb-[16px]`}
          >
            {plan.name}
          </Text>
          <Text className="text-[28px] font-bold mb-[8px] mt-0">
            <span
              className={`${
                plan.highlighted ? 'text-white' : 'text-[rgb(16,24,40)]'
              }`}
            >
              {plan.price}
            </span>{' '}
            {plan.interval && (
              <span className="text-[14px] leading-[20px]">
                / {plan.interval}
              </span>
            )}
          </Text>
          {plan.description && (
            <Text className="mt-[12px] mb-[24px]">{plan.description}</Text>
          )}
          <ul className="text-[12px] leading-[20px] mb-[30px] pl-[14px]">
            {plan.features.map((feature, index) => (
              <li key={index} className="mb-[8px]">
                {feature}
              </li>
            ))}
          </ul>
          <Button
            href={plan.ctaUrl}
            className="bg-indigo-600 rounded-[8px] box-border text-white inline-block font-semibold m-0 max-w-full p-[12px] text-center w-full"
          >
            {plan.ctaText}
          </Button>
        </Section>
      ))}
    </Section>
  );
}

