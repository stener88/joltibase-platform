/**
 * CTA (Call-to-Action) Pattern Component
 * 
 * Centered call-to-action section with headline, optional subheadline, and button
 * Supports primary, secondary, and outline button styles
 */

import { Section, Heading, Text, Button } from '@react-email/components';
import type { CtaBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface CtaPatternProps {
  block: CtaBlock;
  settings: GlobalEmailSettings;
}

export function CtaPattern({ block, settings }: CtaPatternProps) {
  // Determine button styling based on style prop
  const getButtonStyle = () => {
    const baseStyle = {
      padding: '16px 40px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      textDecoration: 'none' as const,
      display: 'inline-block',
      fontFamily: settings.fontFamily,
    };

    switch (block.style) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: settings.primaryColor,
          color: '#ffffff',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#374151',
          color: '#ffffff',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: settings.primaryColor,
          border: `2px solid ${settings.primaryColor}`,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: settings.primaryColor,
          color: '#ffffff',
        };
    }
  };

  return (
    <Section
      style={{
        backgroundColor: '#f9fafb', // CtaBlock doesn't have backgroundColor property
        padding: '60px 24px',
        textAlign: 'center' as const,
      }}
    >
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
        {block.headline}
      </Heading>

      {block.subheadline && (
        <Text
          style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: '0 0 32px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {block.subheadline}
        </Text>
      )}

      <Button
        href={block.buttonUrl}
        style={getButtonStyle()}
      >
        {block.buttonText}
      </Button>
    </Section>
  );
}

