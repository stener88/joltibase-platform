/**
 * WIN-BACK REACTIVATION EMAIL DESIGN SYSTEM
 * Based on Spotify's Premium return offer template
 *
 * Use cases:
 * - Lapsed subscriber win-back
 * - Trial expiration re-engagement
 * - Inactive user reactivation
 * - Special return offers
 * - Subscription recovery campaigns
 * - Churn prevention
 * - Re-engagement promotions
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const WinBackReactivationDesignSystem: DesignSystem = {
  id: 'winback-reactivation',
  name: 'Win-Back & Reactivation',
  description:
    'Conversion-focused reactivation email with special offer pricing, bold CTA, and app download links. Features colorful accent border and clean footer. Perfect for winning back lapsed subscribers.',

  // KEYWORD TRIGGERS
  triggers: [
    'come back',
    'return',
    'reactivate',
    'win back',
    'we miss you',
    'inactive',
    'lapsed',
    'expired',
    'trial ended',
    'subscription ended',
    'account paused',
    'get back',
    'rejoin',
    'resume',
    'restart',
    'special offer',
    'return offer',
    'welcome back',
    'limited time offer',
    'exclusive deal',
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['brand', 'logo', 'banner', 'welcome back', 'return'],
    feature: ['app', 'mobile', 'device', 'platform', 'interface'],
    product: ['premium', 'subscription', 'service', 'upgrade'],
    background: ['gradient', 'colorful', 'vibrant', 'modern'],
    people: ['happy user', 'customer', 'listening', 'enjoying'],
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
  exampleEmail: `import React from 'react'
import { Body, Button, Column, Container, Font, Head, Html, Img, Link, Preview, Row, Section, Text } from '@react-email/components'

export default function WinBackReactivationEmail() {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>
          {\`
            p {
              margin: 0 !important;
              padding: 0 !important;
            }

            a {
              text-decoration: none;
            }
          \`}
        </style>
      </Head>
      <Preview>Get back to unlimited music with Premium</Preview>
      <Body style={{ backgroundColor: "#ffffff" }}>
        <Container style={{ maxWidth: "600px", backgroundColor: "#ffffff" }}>
          
          {/* Hero Banner Image */}
          <Section>
            <Row>
              <Column align="center">
                <Link href="https://example.com/premium">
                  <Img 
                    src="https://via.placeholder.com/600x150/1db954/000000?text=Spotify+Premium" 
                    style={{
                      borderRadius: "4px",
                      width: "600px",
                      height: "150px",
                      padding: "0px 0px 0px 0px"
                    }}
                    alt="Spotify Premium - Welcome back to unlimited music"
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Main Content Section */}
          <Section style={{
            padding: "16px 30px 0px 30px",
            backgroundColor: "#ffffff"
          }}>
            <Row>
              <Column align="center" style={{
                width: "100%",
                paddingLeft: "0",
                paddingRight: "0",
                verticalAlign: "top"
              }}>
                {/* Main Headline */}
                <Section style={{ margin: "0px 0 0px 0" }}>
                  <Row>
                    <Column style={{ padding: "0 0 0 0" }}>
                      <Text style={{ textAlign: "center", lineHeight: "40px", color: "#000000", fontSize: "28px", fontWeight: "bold" }}>
                        Get back to unlimited music with Premium.
                      </Text>
                    </Column>
                  </Row>
                </Section>

                {/* Offer Description */}
                <Section style={{ margin: "16px 0 0 0" }}>
                  <Row>
                    <Column style={{ padding: "0 0 0 0" }}>
                      <Text style={{ textAlign: "center", color: "#000000", fontSize: "16px" }}>
                        Listen to the content you love with unlimited songs to keep you going, ad-free and uninterrupted. Ending soon: Don't miss out on 2 months of Premium for $9.99 + applicable taxes.
                      </Text>
                    </Column>
                  </Row>
                </Section>

                {/* Primary CTA Button */}
                <Button 
                  href="https://example.com/return-offer" 
                  style={{
                    backgroundColor: "#26008d",
                    padding: "16px 70px 16px 70px",
                    color: "#ffffff",
                    borderRadius: "32px",
                    fontSize: "16px",
                    lineHeight: "normal",
                    margin: "16px 0 0 0",
                    fontWeight: "bold"
                  }}
                >
                  RETURN NOW
                </Button>

                {/* Legal Disclaimer */}
                <Section style={{
                  borderRadius: "0px",
                  margin: "24px 0 24px 0"
                }}>
                  <Row>
                    <Column style={{ padding: "0px 20px 0px 20px" }}>
                      <Text style={{ textAlign: "center", lineHeight: "7px", fontSize: "7px" }}>
                        Return offer for the Individual plan. Get 2 months for $9.99 USD (regularly $9.99/month). After the offer period, $9.99/month + applicable taxes will apply. <Link href="https://example.com/terms" style={{ color: "#fff553", textDecoration: "underline" }}>Terms and conditions</Link> apply. Valid only for users whose Premium access ended more than 30 days ago and who have not used a return offer in the last 24 months. Offer ends September 22, 2025. By clicking the button, you will be logged into your Spotify account, where you can accept this offer. Do not forward this email to anyone who is not authorized to access your account.
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Footer Section with Colorful Top Border */}
          <Section style={{
            padding: "0px 0px 0px 0px",
            backgroundColor: "#f7f7f7",
            borderTop: "16px solid #17d1a7",
            borderRadius: "0px"
          }}>
            <Row>
              <Column align="left" style={{
                width: "100%",
                paddingLeft: "0",
                paddingRight: "0",
                verticalAlign: "top"
              }}>
                <Section style={{
                  padding: "37px 30px 37px 30px",
                  backgroundColor: "#f7f7f7"
                }}>
                  <Row>
                    <Column align="left" style={{
                      width: "100%",
                      paddingLeft: "0",
                      paddingRight: "0",
                      verticalAlign: "top"
                    }}>
                      {/* Footer Logo */}
                      <Section>
                        <Row>
                          <Column align="left">
                            <Link href="https://example.com">
                              <Img 
                                src="https://via.placeholder.com/84x23/000000/1db954?text=Spotify" 
                                style={{
                                  borderRadius: "4px",
                                  width: "84px",
                                  height: "23px"
                                }}
                                alt="Spotify Logo"
                              />
                            </Link>
                          </Column>
                        </Row>
                      </Section>

                      {/* Download Section */}
                      <Section style={{
                        margin: "37px 0 0px 0",
                        padding: "18px 0px 18px 0px",
                        backgroundColor: "#f7f7f7",
                        borderTop: "1px solid #d2d5d9",
                        borderBottom: "1px solid #d3d5d9"
                      }}>
                        <Row>
                          <Column align="left" style={{
                            width: "22%",
                            paddingLeft: "0",
                            paddingRight: "0px",
                            verticalAlign: "top"
                          }}>
                            <Section style={{
                              borderRadius: "0px",
                              margin: "0px 0 0px 0"
                            }}>
                              <Row>
                                <Column style={{ padding: "0px 0px 0px 0px" }}>
                                  <Text style={{ color: "#88898c", fontSize: "11px" }}>
                                    Download Spotify for:
                                  </Text>
                                </Column>
                              </Row>
                            </Section>
                          </Column>
                          <Column align="left" style={{
                            width: "80%",
                            paddingLeft: "0px",
                            paddingRight: "0",
                            verticalAlign: "top"
                          }}>
                            <Section>
                              <Row>
                                <Column align="left">
                                  <Row style={{ display: "table-cell" }}>
                                    <Column style={{ paddingRight: "14px" }}>
                                      <Link href="https://example.com/iphone">
                                        <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                          iPhone
                                        </Text>
                                      </Link>
                                    </Column>
                                    <Column style={{ paddingRight: "14px" }}>
                                      <Link href="https://example.com/ipad">
                                        <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                          iPad
                                        </Text>
                                      </Link>
                                    </Column>
                                    <Column style={{ paddingRight: "14px" }}>
                                      <Link href="https://example.com/android">
                                        <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                          Android
                                        </Text>
                                      </Link>
                                    </Column>
                                    <Column>
                                      <Link href="https://example.com/others">
                                        <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                          Others
                                        </Text>
                                      </Link>
                                    </Column>
                                  </Row>
                                </Column>
                              </Row>
                            </Section>
                          </Column>
                        </Row>
                      </Section>

                      {/* Email Preferences Text */}
                      <Section style={{
                        borderRadius: "0px",
                        margin: "37px 0 0px 0"
                      }}>
                        <Row>
                          <Column style={{ padding: "0px 0px 0px 0px" }}>
                            <Text style={{ lineHeight: "18px", color: "#88898c", fontSize: "11px" }}>
                              This message was sent to <Link href="mailto:user@example.com" style={{ color: "#1156cc", textDecoration: "underline" }}>user@example.com</Link>. If you don't want to receive these emails from Spotify in the future, you can <Text style={{ fontWeight: "bold" }}>edit your profile</Text> or <Text style={{ fontWeight: "bold" }}>unsubscribe</Text>.
                            </Text>
                          </Column>
                        </Row>
                      </Section>

                      {/* Footer Links */}
                      <Section style={{ margin: "50px 0 0px 0" }}>
                        <Row>
                          <Column align="left">
                            <Row style={{ display: "table-cell" }}>
                              <Column style={{ paddingRight: "14px" }}>
                                <Link href="https://example.com/terms">
                                  <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                    Terms of Use
                                  </Text>
                                </Link>
                              </Column>
                              <Column style={{ paddingRight: "14px" }}>
                                <Link href="https://example.com/privacy">
                                  <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                    Privacy Policy
                                  </Text>
                                </Link>
                              </Column>
                              <Column>
                                <Link href="https://example.com/contact">
                                  <Text style={{ color: "#6d6d6d", fontSize: "11px", fontWeight: "bold" }}>
                                    Contact us
                                  </Text>
                                </Link>
                              </Column>
                            </Row>
                          </Column>
                        </Row>
                      </Section>

                      {/* Company Address */}
                      <Section style={{
                        borderRadius: "0px",
                        margin: "18px 0 0px 0"
                      }}>
                        <Row>
                          <Column style={{ padding: "0px 0px 0px 0px" }}>
                            <Text style={{ lineHeight: "18px", color: "#88898c", fontSize: "11px" }}>
                              Spotify AB, Regeringstgatan 19, 111 53, Stockholm, Sweden
                            </Text>
                          </Column>
                        </Row>
                      </Section>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# WIN-BACK REACTIVATION EMAIL DESIGN SYSTEM

You are generating content for a win-back reactivation email using a proven Spotify-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, conversion-focused, benefit-driven
**Mood:** Welcoming, enticing, urgent but friendly
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Purple/indigo (#26008d) for CTA button
- Accent: Teal/turquoise (#17d1a7) for footer top border
- Highlight: Yellow (#fff553) for legal links
- Background: White (#ffffff) for content, light gray (#f7f7f7) for footer
- Text: Black for main content, gray (#88898c, #6d6d6d) for footer

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│         [HERO BANNER - 600x150]            │ ← Brand image/logo
├─────────────────────────────────────────────┤
│                                             │
│   Get back to unlimited music with         │
│   Premium. (28px headline)                 │
│                                             │
│   Offer description and benefits...        │
│   (16px body text)                         │
│                                             │
│         [ RETURN NOW ]                      │ ← Purple CTA
│                                             │
│   Legal disclaimer (7px tiny text)         │
│                                             │
├═════════════════════════════════════════════┤ ← Teal border (16px)
│                                             │
│   [Logo]                                   │
│   ───────────────────────────              │
│   Download for: iPhone iPad Android        │
│   ───────────────────────────              │
│   Email preferences text...                │ ← Gray footer
│   Terms | Privacy | Contact                │
│   Company address                          │
│                                             │
└─────────────────────────────────────────────┘

## CONTENT GUIDELINES

### Hero Banner
- **Dimensions**: 600x150px (4:1 aspect ratio)
- **Content**: Brand logo, welcome message, or premium badge
- **Style**: On-brand, colorful, eye-catching
- **Alt text**: Include "welcome back" or "return"

### Main Headline
- **Format**: Bold, center-aligned, conversational
- **Font size**: 28px
- **Line height**: 40px
- **Length**: 5-10 words
- **Tone**: Benefit-focused, welcoming
- **Examples**:
  ✅ "Get back to unlimited music with Premium."
  ✅ "We miss you! Come back to Premium."
  ✅ "Your exclusive return offer awaits."
  ✅ "Resume your journey with us today."
  ❌ "Reactivate your account" (too transactional)

### Offer Description
- **Font size**: 16px, regular weight
- **Length**: 2-4 sentences (40-60 words)
- **Structure**:
  1. Benefit statement (what they get)
  2. Offer details (pricing, duration)
  3. Urgency element ("Ending soon", "Limited time")
- **Examples**:
  ✅ "Listen to the content you love with unlimited songs to keep you going, ad-free and uninterrupted. Ending soon: Don't miss out on 2 months of Premium for $9.99 + applicable taxes."
  ✅ "Pick up right where you left off with ad-free streaming, offline downloads, and unlimited skips. Special offer: 3 months for just $14.99."

### CTA Button
- **Text**: 1-2 words, action-oriented, all caps
- **Examples**:
  ✅ "RETURN NOW"
  ✅ "RESUME NOW"
  ✅ "REACTIVATE"
  ✅ "GET STARTED"
  ❌ "Click here" (not specific)
  ❌ "Learn more" (too passive)
- **Style**:
  - Background: Brand primary color (#26008d purple)
  - Text: White
  - Padding: 16px 70px (generous)
  - Border radius: 32px (fully rounded)
  - Font: 16px, bold, all caps

### Legal Disclaimer
- **Font size**: 7px (tiny but readable)
- **Line height**: 7px (very tight)
- **Color**: Black or gray
- **Content**:
  - Offer eligibility requirements
  - Pricing details (regular vs. offer price)
  - Duration and expiration date
  - Auto-renewal terms
  - Link to full terms (yellow highlight)
  - Account security note
- **Format**: Dense paragraph, center-aligned

**Required elements**:
1. Offer details (duration, price)
2. Regular pricing after offer
3. Eligibility criteria
4. Expiration date
5. Terms and conditions link
6. Account security warning

### Footer Top Border
- **Height**: 16px
- **Color**: Brand accent (teal #17d1a7 or your brand color)
- **Purpose**: Visual separator, brand personality

### Footer Section

**Background**: Light gray (#f7f7f7)
**Padding**: 37px 30px

**Logo:**
- Size: ~84x23px
- Placement: Top left of footer
- Clickable link to homepage

**Download Links Section:**
- **Structure**: Label (22% width) + Links (80% width)
- **Label**: "Download [Brand] for:" (11px, gray)
- **Border**: Top and bottom 1px solid #d2d5d9
- **Links**: iPhone, iPad, Android, Others
- **Style**: 11px, bold, gray (#6d6d6d)
- **Spacing**: 14px between links
- **Layout**: Inline horizontal

**Email Preferences:**
- **Text**: "This message was sent to [email]. If you don't want to receive these emails..."
- **Font**: 11px, line-height 18px, gray (#88898c)
- **Links**: Bold for "edit your profile" and "unsubscribe"
- **Email link**: Blue (#1156cc), underlined

**Legal Links:**
- **Links**: Terms of Use, Privacy Policy, Contact us
- **Style**: 11px, bold, gray (#6d6d6d)
- **Spacing**: 14px between links
- **Layout**: Inline horizontal

**Company Address:**
- **Font**: 11px, line-height 18px, gray
- **Format**: Company name, street, postal code, city, country

## COLOR SYSTEM

### Primary Colors
- **Purple/Indigo (#26008d)**: CTA button background
- **White (#ffffff)**: Main content background, button text
- **Light Gray (#f7f7f7)**: Footer background
- **Black (#000000)**: Main headline and body text

### Accent Colors
- **Teal/Turquoise (#17d1a7)**: Footer top border
- **Yellow (#fff553)**: Legal disclaimer links
- **Blue (#1156cc)**: Email links in footer
- **Medium Gray (#88898c)**: Footer body text
- **Dark Gray (#6d6d6d)**: Footer links
- **Border Gray (#d2d5d9, #d3d5d9)**: Download section borders

### Usage Rules
- Use brand primary for CTA (high contrast)
- Use brand accent for visual separator (footer border)
- Use yellow sparingly (only legal links)
- Use grays for footer hierarchy (darker for links, lighter for text)

## TYPOGRAPHY

### Font Setup
\`\`\`tsx
<Font
  fontFamily="Inter"
  fallbackFontFamily="Helvetica"
  webFont={{
    url: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
    format: 'woff2',
  }}
  fontWeight={400}
  fontStyle="normal"
/>
\`\`\`

### Text Hierarchy
- **Main headline**: 28px, bold, line-height 40px
- **Body text**: 16px, regular, line-height normal
- **CTA button**: 16px, bold, all caps
- **Legal text**: 7px, regular, line-height 7px
- **Footer headings**: 11px, regular (label text)
- **Footer links**: 11px, bold
- **Footer body**: 11px, regular, line-height 18px

## CONVERSION OPTIMIZATION

### What Makes This Template Convert

1. **Benefit-First Headline**
   - Focuses on what user gets, not what they lost
   - Emotional appeal ("Get back to unlimited music")

2. **Clear Value Proposition**
   - Special pricing prominently displayed
   - Benefits listed (ad-free, unlimited, uninterrupted)
   - Urgency element ("Ending soon")

3. **Single Prominent CTA**
   - High contrast color (purple on white)
   - Action-oriented text ("RETURN NOW")
   - Large, finger-friendly size

4. **Reduced Friction**
   - One-click activation
   - Auto-login mentioned in disclaimer
   - Clear pricing (no surprises)

5. **Trust Signals**
   - Full legal disclosure
   - Company information
   - Privacy and terms links
   - App availability (multi-platform)

## TONE AND VOICE

**Overall Tone:** Welcoming, enticing, friendly, urgent

**Do:**
- Focus on benefits ("Get back to unlimited")
- Use "you" and "your" (personal)
- Create gentle urgency ("Ending soon", "Don't miss out")
- Be transparent about pricing and terms
- Welcome them back warmly
- Emphasize what they've been missing

**Don't:**
- Shame them for leaving
- Use aggressive or desperate language
- Hide the pricing or terms
- Over-promise or exaggerate
- Make it sound like a punishment
- Use too much guilt ("We miss you" is fine, but don't overdo it)

## OFFER STRUCTURE BEST PRACTICES

### Pricing Display
Format: "[Duration] for [Price]"
Examples:
- "2 months for $9.99"
- "3 months for $14.99"
- "First month free, then $9.99/month"

Include:
- Regular price for comparison
- Tax disclaimer ("+ applicable taxes")
- Auto-renewal terms

### Eligibility Criteria
Be specific:
- Time since cancellation ("ended more than 30 days ago")
- Previous offer usage ("not used in last 24 months")
- Plan types ("Individual plan only")
- Geographic restrictions ("US only")

### Urgency Element
Choose one:
- Date: "Offer ends September 22, 2025"
- Duration: "48 hours only"
- Vague: "Ending soon" (less effective)

## ANTI-PATTERNS

❌ **Don't guilt-trip heavily** - "We're sad you left" once is fine, more is too much
❌ **Don't bury the offer** - Pricing should be in first paragraph
❌ **Don't skip legal details** - Required for compliance and trust
❌ **Don't use weak CTAs** - "Click here" or "Learn more" don't convert
❌ **Don't forget app links** - Shows you're invested in their success
❌ **Don't hide eligibility** - Be upfront about who qualifies
❌ **Don't use generic subject lines** - Personalize when possible

## EXAMPLE CONTENT SETS

### Music Streaming
- Headline: "Get back to unlimited music with Premium."
- Offer: "2 months for $9.99 (regularly $9.99/month)"
- Benefits: "Ad-free, unlimited skips, offline listening"
- CTA: "RETURN NOW"

### Video Streaming
- Headline: "Your exclusive return offer: 50% off."
- Offer: "3 months for $14.99 (regularly $29.99)"
- Benefits: "Thousands of shows, movies, and originals"
- CTA: "RESUME NOW"

### Software/SaaS
- Headline: "Come back to seamless productivity."
- Offer: "First month free, then 30% off for 6 months"
- Benefits: "All features unlocked, priority support"
- CTA: "REACTIVATE"

### Fitness/Wellness
- Headline: "We miss you! Special offer inside."
- Offer: "2 months for the price of 1"
- Benefits: "Unlimited classes, personalized plans"
- CTA: "REJOIN NOW"

---

**Follow the example email structure exactly, including the colorful footer top border, tiny legal disclaimer, and comprehensive app download/preference section.**`,
};

export default WinBackReactivationDesignSystem;

