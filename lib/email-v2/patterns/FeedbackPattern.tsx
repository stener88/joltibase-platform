/**
 * Feedback Pattern Component
 * 
 * Customer feedback collection sections
 * Supports 3 variants:
 * - simple-rating: Simple rating prompt with star rating
 * - survey: Multi-question survey form
 * - customer-reviews: Display of customer reviews/testimonials
 * Uses @react-email/components for email-safe rendering
 */

import { Section, Row, Column, Heading, Text, Button, Link, Img } from '@react-email/components';
import type { FeedbackBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface FeedbackPatternProps {
  block: FeedbackBlock;
  settings: GlobalEmailSettings;
}

export function FeedbackPattern({ block, settings }: FeedbackPatternProps) {
  const { variant = 'simple-rating' } = block;

  if (variant === 'survey') {
    return <SurveyFeedback block={block} settings={settings} />;
  }

  if (variant === 'customer-reviews') {
    return <CustomerReviews block={block} settings={settings} />;
  }

  // Default: simple-rating
  return <SimpleRating block={block} settings={settings} />;
}

/**
 * Simple Rating Feedback
 * Quick rating prompt with star buttons (1-5)
 */
function SimpleRating({ block, settings }: FeedbackPatternProps) {
  const { heading, subheading, ctaUrl } = block;

  return (
    <Section
      style={{
        padding: '60px 24px',
        textAlign: 'center' as const,
      }}
    >
      {/* Heading */}
      {heading && (
        <Heading
          as="h2"
          style={{
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {heading}
        </Heading>
      )}

      {/* Subheading */}
      {subheading && (
        <Text
          style={{
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {subheading}
        </Text>
      )}

      {/* Star Rating Buttons */}
      <Row>
        <Column style={{ textAlign: 'center' as const }}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <span key={rating} style={{ display: 'inline-block', margin: '0 4px' }}>
              <Link
                href={ctaUrl ? `${ctaUrl}?rating=${rating}` : '#'}
                style={{
                  display: 'inline-block',
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '24px',
                  fontWeight: 600,
                  fontFamily: settings.fontFamily,
                }}
              >
                {'⭐'.repeat(rating)}
              </Link>
            </span>
          ))}
        </Column>
      </Row>

      {/* Alternative Text Link */}
      {ctaUrl && (
        <Text
          style={{
            marginTop: '24px',
            fontSize: '14px',
            color: '#999999',
            fontFamily: settings.fontFamily,
          }}
        >
          <Link
            href={ctaUrl}
            style={{
              color: settings.primaryColor,
              textDecoration: 'none',
            }}
          >
            Or leave detailed feedback →
          </Link>
        </Text>
      )}
    </Section>
  );
}

/**
 * Survey Feedback
 * Multi-question survey with CTA buttons
 */
function SurveyFeedback({ block, settings }: FeedbackPatternProps) {
  const { heading, subheading, questions = [], ctaText, ctaUrl } = block;

  return (
    <Section
      style={{
        padding: '60px 24px',
      }}
    >
      {/* Header */}
      {heading && (
        <Heading
          as="h2"
          style={{
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {heading}
        </Heading>
      )}

      {subheading && (
        <Text
          style={{
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {subheading}
        </Text>
      )}

      {/* Questions */}
      {questions.map((question, index) => (
        <div
          key={index}
          style={{
            marginBottom: '32px',
            padding: '24px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          <Text
            style={{
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              fontFamily: settings.fontFamily,
            }}
          >
            {index + 1}. {question.text}
          </Text>

          {/* Answer Options */}
          {question.options && question.options.length > 0 && (
            <Row>
              <Column>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} style={{ marginBottom: '8px' }}>
                    <Link
                      href={ctaUrl ? `${ctaUrl}?q=${index + 1}&a=${optIndex + 1}` : '#'}
                      style={{
                        display: 'inline-block',
                        padding: '10px 16px',
                        backgroundColor: '#ffffff',
                        color: '#666666',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: settings.fontFamily,
                        border: '1px solid #e5e5e5',
                        width: '100%',
                        textAlign: 'left' as const,
                      }}
                    >
                      {option}
                    </Link>
                  </div>
                ))}
              </Column>
            </Row>
          )}
        </div>
      ))}

      {/* CTA Button */}
      {ctaText && ctaUrl && (
        <Row>
          <Column style={{ textAlign: 'center' as const }}>
            <Button
              href={ctaUrl}
              style={{
                backgroundColor: settings.primaryColor,
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                display: 'inline-block',
                fontFamily: settings.fontFamily,
              }}
            >
              {ctaText}
            </Button>
          </Column>
        </Row>
      )}
    </Section>
  );
}

/**
 * Customer Reviews Display
 * Showcase existing customer feedback/testimonials
 */
function CustomerReviews({ block, settings }: FeedbackPatternProps) {
  const { heading, subheading, reviews = [] } = block;

  return (
    <Section
      style={{
        padding: '60px 24px',
      }}
    >
      {/* Header */}
      {heading && (
        <Heading
          as="h2"
          style={{
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0 0 12px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {heading}
        </Heading>
      )}

      {subheading && (
        <Text
          style={{
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 40px 0',
            textAlign: 'center' as const,
            fontFamily: settings.fontFamily,
          }}
        >
          {subheading}
        </Text>
      )}

      {/* Reviews Grid */}
      <Row>
        {reviews.map((review, index) => (
          <Column
            key={index}
            style={{
              width: reviews.length === 1 ? '100%' : '50%',
              padding: '0 8px',
              verticalAlign: 'top',
            }}
          >
            <div
              style={{
                padding: '24px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                marginBottom: '16px',
                height: '100%',
              }}
            >
              {/* Rating Stars */}
              {review.rating && (
                <Text
                  style={{
                    fontSize: '20px',
                    margin: '0 0 12px 0',
                  }}
                >
                  {'⭐'.repeat(Math.min(5, Math.max(1, review.rating)))}
                </Text>
              )}

              {/* Review Text */}
              <Text
                style={{
                  color: '#1a1a1a',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                  fontFamily: settings.fontFamily,
                  fontStyle: 'italic',
                }}
              >
                "{review.text}"
              </Text>

              {/* Author Info */}
              <Text
                style={{
                  color: '#666666',
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: '0',
                  fontFamily: settings.fontFamily,
                }}
              >
                {review.authorName}
                {review.authorTitle && (
                  <span style={{ fontWeight: 400, color: '#999999' }}>
                    {' '}• {review.authorTitle}
                  </span>
                )}
              </Text>
            </div>
          </Column>
        ))}
      </Row>
    </Section>
  );
}

