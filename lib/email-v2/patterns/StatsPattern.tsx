/**
 * Stats Pattern Component
 * 
 * Display key metrics with 2 layout variants
 * Uses React Email components with Tailwind for styling
 */

import { Section, Row, Column, Text, Tailwind } from '@react-email/components';
import type { StatsBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface StatsPatternProps {
  block: StatsBlock;
  settings: GlobalEmailSettings;
}

export function StatsPattern({ block, settings }: StatsPatternProps) {
  const { variant = 'simple', stats, heading, subheading } = block;

  return (
    <Tailwind>
      <Section className="px-4 py-8">
        {(heading || subheading) && (
          <Row className="mb-6">
            <Column>
              {heading && (
                <Text className="m-0 text-center text-[28px] leading-[36px] font-bold tracking-tight text-gray-900">
                  {heading}
                </Text>
              )}
              {subheading && (
                <Text className="m-0 mt-3 text-center text-[16px] leading-[24px] text-gray-600">
                  {subheading}
                </Text>
              )}
            </Column>
          </Row>
        )}
        
        {variant === 'simple' && <SimpleStats stats={stats} />}
        {variant === 'stepped' && <SteppedStats stats={stats} />}
      </Section>
    </Tailwind>
  );
}

// Simple horizontal row layout
function SimpleStats({ stats }: { stats: StatsBlock['stats'] }) {
  return (
    <Row>
      {stats.map((stat, index) => (
        <Column key={index} className="text-center px-4">
          <p className="m-0 text-center text-[32px] leading-[40px] font-bold tracking-tight text-gray-900 tabular-nums">
            {stat.value}
          </p>
          <p className="m-0 mt-2 text-center text-[14px] leading-[20px] font-semibold text-gray-700 uppercase tracking-wide">
            {stat.label}
          </p>
          {stat.description && (
            <p className="m-0 mt-2 text-center text-[13px] leading-[18px] text-gray-600">
              {stat.description}
            </p>
          )}
        </Column>
      ))}
    </Row>
  );
}

// Stepped cards layout with different background colors
function SteppedStats({ stats }: { stats: StatsBlock['stats'] }) {
  const backgrounds = [
    'bg-gray-100',
    'bg-gray-900',
    'bg-indigo-700',
  ];

  const textColors = [
    'text-gray-900',
    'text-gray-50',
    'text-indigo-50',
  ];

  const descriptionColors = [
    'text-gray-700',
    'text-gray-300',
    'text-indigo-100',
  ];

  const subDescriptionColors = [
    'text-gray-600',
    'text-gray-400',
    'text-indigo-200',
  ];

  return (
    <>
      {stats.map((stat, index) => {
        const bgClass = backgrounds[index % backgrounds.length];
        const textClass = textColors[index % textColors.length];
        const descClass = descriptionColors[index % descriptionColors.length];
        const subDescClass = subDescriptionColors[index % subDescriptionColors.length];

        return (
          <Row key={index} className={index < stats.length - 1 ? 'mb-2' : ''}>
            <Column className={`min-h-[112px] rounded-2xl ${bgClass} p-4`}>
              <p className={`mb-0 text-[24px] leading-[32px] font-bold tracking-tight tabular-nums ${textClass}`}>
                {stat.value}
              </p>
              <div className={descClass}>
                <p className="mb-0 text-[15px] leading-[22px]">
                  {stat.label}
                </p>
                {stat.description && (
                  <p className={`mb-0 mt-1 text-[13px] leading-[18px] ${subDescClass}`}>
                    {stat.description}
                  </p>
                )}
              </div>
            </Column>
          </Row>
        );
      })}
    </>
  );
}

