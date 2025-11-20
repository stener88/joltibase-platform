/**
 * Footer Pattern Component
 * 
 * Email footer with company information, links, and unsubscribe
 * Variants: one-column (centered) and two-column (split layout)
 */

import { Section, Text, Link, Row, Column, Img, Tailwind } from '@react-email/components';
import type { FooterBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface FooterPatternProps {
  block: FooterBlock;
  settings: GlobalEmailSettings;
}

export function FooterPattern({ block, settings }: FooterPatternProps) {
  const { variant = 'one-column' } = block;

  return (
    <Tailwind>
      {variant === 'one-column' && <OneColumnFooter block={block} settings={settings} />}
      {variant === 'two-column' && <TwoColumnFooter block={block} settings={settings} />}
    </Tailwind>
  );
}

// One-Column Centered Footer (default)
function OneColumnFooter({ block, settings }: FooterPatternProps) {
  return (
    <Section
      style={{
        backgroundColor: '#f9fafb',
        padding: '32px 24px',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <Section className="text-center">
        <table className="w-full">
          <tr className="w-full">
            <td align="center">
              <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
                {block.companyName}
              </Text>
              {block.address && (
                <Text className="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]">
                  {block.address}
                </Text>
              )}
            </td>
          </tr>
          {block.socialLinks && block.socialLinks.length > 0 && (
            <tr>
              <td align="center">
                <Row className="table-cell h-[44px] w-[56px] align-bottom">
                  {block.socialLinks.slice(0, 3).map((social, index) => (
                    <Column key={index} className="pr-[8px]">
                      <Link href={social.url}>
                        <Text className="text-gray-600">
                          {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                        </Text>
                      </Link>
                    </Column>
                  ))}
                </Row>
              </td>
            </tr>
          )}
          {block.photoCredits && block.photoCredits.length > 0 && (
            <tr>
              <td align="center">
                <Text className="my-[8px] text-[12px] text-gray-500 leading-[18px]">
                  Photos by {block.photoCredits.join(', ')} on{' '}
                  <Link href="https://unsplash.com" className="text-gray-600 underline">
                    Unsplash
                  </Link>
                </Text>
              </td>
            </tr>
          )}
          <tr>
            <td align="center">
              <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                {block.address || 'Contact us'}
              </Text>
              <Text className="mt-[4px] mb-0 font-semibold text-[16px] text-gray-500 leading-[24px]">
                <Link href={block.unsubscribeUrl} className="text-gray-600">
                  Unsubscribe
                </Link>
                {block.preferenceUrl && (
                  <>
                    {' • '}
                    <Link href={block.preferenceUrl} className="text-gray-600">
                      Preferences
                    </Link>
                  </>
                )}
              </Text>
            </td>
          </tr>
        </table>
      </Section>
    </Section>
  );
}

// Two-Column Footer
function TwoColumnFooter({ block, settings }: FooterPatternProps) {
  return (
    <Section
      style={{
        backgroundColor: '#f9fafb',
        padding: '32px 24px',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <Section>
        <Row>
          <Column colSpan={4}>
            <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
              {block.companyName}
            </Text>
            {block.address && (
              <Text className="mt-[4px] mb-[0px] text-[16px] text-gray-500 leading-[24px]">
                {block.address}
              </Text>
            )}
          </Column>
          <Column align="left" className="table-cell align-bottom">
            {block.socialLinks && block.socialLinks.length > 0 && (
              <Row className="table-cell h-[44px] w-[56px] align-bottom">
                {block.socialLinks.slice(0, 3).map((social, index) => (
                  <Column key={index} className="pr-[8px]">
                    <Link href={social.url}>
                      <Text className="text-gray-600">
                        {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                      </Text>
                    </Link>
                  </Column>
                ))}
              </Row>
            )}
            <Row>
              <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                <Link href={block.unsubscribeUrl} className="text-gray-600">
                  Unsubscribe
                </Link>
                {block.preferenceUrl && (
                  <>
                    {' • '}
                    <Link href={block.preferenceUrl} className="text-gray-600">
                      Preferences
                    </Link>
                  </>
                )}
              </Text>
              {block.additionalLinks && block.additionalLinks.length > 0 && (
                <Text className="mt-[4px] mb-[0px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                  {block.additionalLinks.map((link, index) => (
                    <span key={index}>
                      {index > 0 && ' • '}
                      <Link href={link.url} className="text-gray-600">
                        {link.text}
                      </Link>
                    </span>
                  ))}
                </Text>
              )}
            </Row>
            {block.photoCredits && block.photoCredits.length > 0 && (
              <Row>
                <Text className="my-[8px] text-[12px] text-gray-500 leading-[18px]">
                  Photos by {block.photoCredits.join(', ')} on{' '}
                  <Link href="https://unsplash.com" className="text-gray-600 underline">
                    Unsplash
                  </Link>
                </Text>
              </Row>
            )}
          </Column>
        </Row>
      </Section>
    </Section>
  );
}
