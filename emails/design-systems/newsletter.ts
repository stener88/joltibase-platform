/**
 * NEWSLETTER EDITORIAL DESIGN SYSTEM
 * 
 * Content-focused design for newsletters, blog digests, and editorial communications.
 * 
 * Target Audience: Subscribers, readers, content consumers, blog followers
 */

export const NewsletterDesignSystem = {
  id: 'newsletter-editorial',
  name: 'Newsletter Editorial',
  description: 'Content-focused, readable design for newsletters and blog digests',
  
  triggers: [
    'newsletter', 'digest', 'weekly', 'monthly', 'roundup', 'blog',
    'article', 'content', 'editorial', 'publication', 'magazine',
    'tips', 'insights', 'updates', 'news', 'stories'
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['reading', 'newsletter', 'blog'],
    feature: ['article', 'creative', 'laptop'],
    product: ['writing', 'journalism', 'content'],
    background: ['minimal', 'abstract', 'light'],
  },
  
  system: `
# NEWSLETTER EDITORIAL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Content first. Maximize readability and engagement.

- Clear hierarchy for skimming
- Generous line spacing for long-form content
- Minimal decoration, maximum substance
- Mobile-friendly reading experience

---

## KEY DIFFERENCES FROM CORPORATE

1. **More casual tone** - Conversational but professional
2. **Content-heavy** - Multiple articles/sections per email
3. **Visual breaks** - Dividers between sections
4. **Lighter color palette** - Less formal blues, more variety
5. **Flexible layout** - Adapt to content amount

---

## STYLING GUIDELINES

**Colors**:
- Primary: #2563eb (friendly blue)
- Text: #374151 (softer black)
- Backgrounds: #ffffff, #f9fafb
- Links: #3b82f6

**Typography**:
- Headlines: 28-32px, bold
- Article titles: 20-24px, semi-bold
- Body: 16px, line-height 1.8 (extra generous)
- Captions: 14px

**Layout**:
- Article cards with images
- Clear section dividers
- Read More links for each article
- Social sharing encouraged

**CTAs**:
- Text links preferred over buttons
- Multiple CTAs okay (one per article)
- "Read More", "Continue Reading", "View Full Article"

---

## EXAMPLE STRUCTURE

\`\`\`tsx
<Html>
  <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
    <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      
      {/* Header with logo */}
      <Section style={{ padding: '32px 24px 16px', textAlign: 'center' }}>
        <Heading style={{ fontSize: '28px', margin: 0 }}>Newsletter Title</Heading>
        <Text style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
          Weekly Edition • January 2025
        </Text>
      </Section>

      {/* Article 1 */}
      <Section style={{ padding: '24px' }}>
        <Img src="..." alt="Article image" style={{ width: '100%', borderRadius: '8px' }} />
        <Heading style={{ fontSize: '24px', marginTop: '16px' }}>Article Title</Heading>
        <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#374151' }}>
          Article excerpt or summary. Keep it 2-3 sentences to entice readers.
        </Text>
        <Link href="#" style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600' }}>
          Read More →
        </Link>
      </Section>

      {/* Divider */}
      <Hr style={{ borderColor: '#e5e7eb', margin: '0 24px' }} />

      {/* Article 2 */}
      <Section style={{ padding: '24px' }}>
        {/* Repeat pattern */}
      </Section>

      {/* Footer */}
      <Section style={{ padding: '32px 24px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
        <Text style={{ fontSize: '14px', color: '#888' }}>
          © 2025 Newsletter Name | <Link href="#">Unsubscribe</Link>
        </Text>
      </Section>

    </Container>
  </Body>
</Html>
\`\`\`
`,

  exampleEmail: `import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Img,
  Hr
} from '@react-email/components';

export default function WeeklyNewsletter() {
  return (
    <Html lang="en">
      <Head>
        <title>Weekly Newsletter</title>
      </Head>
      <Body style={{
        backgroundColor: '#f9fafb',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
          
          {/* Header */}
          <Section style={{ padding: '32px 24px 16px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>
            <Heading style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: '0' }}>
              The Weekly Roundup
            </Heading>
            <Text style={{ fontSize: '14px', color: '#666', marginTop: '8px', margin: '8px 0 0 0' }}>
              Your weekly dose of insights • January 15, 2025
            </Text>
          </Section>

          {/* Article 1 */}
          <Section style={{ padding: '32px 24px' }}>
            <Img 
              src="https://example.com/article1.jpg"
              alt="Person working on laptop with coffee in modern workspace"
              style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', display: 'block' }}
            />
            <Heading style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginTop: '16px',
              margin: '16px 0 12px 0'
            }}>
              5 Productivity Tips That Actually Work
            </Heading>
            <Text style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>
              We tested dozens of productivity methods to find what really makes a difference.
              Here are the five techniques that consistently improved focus and output across our team.
            </Text>
            <Link 
              href="https://example.com/article1"
              style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}
            >
              Read More →
            </Link>
          </Section>

          {/* Divider */}
          <Hr style={{ borderColor: '#e5e7eb', margin: '0 24px' }} />

          {/* Article 2 */}
          <Section style={{ padding: '32px 24px' }}>
            <Img 
              src="https://example.com/article2.jpg"
              alt="Team collaborating around whiteboard with sticky notes"
              style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', display: 'block' }}
            />
            <Heading style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginTop: '16px',
              margin: '16px 0 12px 0'
            }}>
              The Future of Remote Collaboration
            </Heading>
            <Text style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>
              As hybrid work becomes the norm, teams are discovering new ways to stay connected.
              We explore the tools and practices shaping the future of distributed teams.
            </Text>
            <Link 
              href="https://example.com/article2"
              style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}
            >
              Read More →
            </Link>
          </Section>

      {/* Footer */}
      <Section style={{
        padding: '32px 24px',
        backgroundColor: '#f9fafb',
        textAlign: 'center',
        marginTop: '16px'
      }}>
        <Text style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
          © 2025 The Weekly Roundup
        </Text>
        <Text style={{ fontSize: '14px', color: '#888', margin: '0' }}>
          <Link href="https://example.com/unsubscribe" style={{ color: '#3b82f6' }}>
            Unsubscribe
          </Link>
          {' '}•{' '}
          <Link href="https://example.com/preferences" style={{ color: '#3b82f6' }}>
            Manage Preferences
          </Link>
        </Text>
      </Section>

    </Container>
  </Body>
</Html>
);
}`,

  // Social media footer pattern (optional, use when user requests social footer)
  socialFooterPattern: `
{/* Optional: Social Media Footer - Use when user requests "social footer" or "connect with us" */}
<Section style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
  <Text style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 16px 0' }}>
    Connect With Us
  </Text>
  <Row align="center" style={{ width: 'auto', margin: '0 auto' }}>
    <Column style={{ paddingRight: '12px' }}>
      <Link href="[TWITTER_URL]">
        <Img 
          src="[APP_URL]/email-assets/icons/twitter.png" 
          width="24" 
          height="24" 
          alt="Twitter" 
          style={{ width: '24px', height: '24px' }} 
        />
      </Link>
    </Column>
    <Column style={{ paddingRight: '12px' }}>
      <Link href="[FACEBOOK_URL]">
        <Img 
          src="[APP_URL]/email-assets/icons/facebook.png" 
          width="24" 
          height="24" 
          alt="Facebook" 
          style={{ width: '24px', height: '24px' }} 
        />
      </Link>
    </Column>
    <Column>
      <Link href="[INSTAGRAM_URL]">
        <Img 
          src="[APP_URL]/email-assets/icons/instagram.png" 
          width="24" 
          height="24" 
          alt="Instagram" 
          style={{ width: '24px', height: '24px' }} 
        />
      </Link>
    </Column>
  </Row>
</Section>

**CRITICAL - Icon Requirements**:
- Format: PNG (48x48 actual, displayed at 24x24 for retina)
- Self-hosted: [APP_URL]/email-assets/icons/{platform}.png
- Size: MUST be 24px × 24px display (specify in BOTH width/height attributes AND inline style)
- Standard platforms: Twitter/X, Facebook, Instagram, LinkedIn, TikTok
- IMPORTANT: Use [APP_URL] placeholder - it will be replaced with actual domain at runtime
`
};

