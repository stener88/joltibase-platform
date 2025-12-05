/**
 * RETAIL WELCOME EMAIL DESIGN SYSTEM
 * Based on New Balance's customer welcome template
 * 
 * Use cases:
 * - New customer welcome emails
 * - Post-purchase thank you emails
 * - Retail brand onboarding
 * - Newsletter signup confirmations
 * - First-time buyer welcomes
 * - Store membership confirmations
 */

export const RetailWelcomeDesignSystem = {
  id: 'retail-welcome',
  name: 'Retail Welcome & Thank You',
  description: 'Clean retail-focused welcome email with hero imagery, brand introduction, and optional survey/feedback section. Features bold colored dividers and dual-message capability.',

  // KEYWORD TRIGGERS
  triggers: [
    'welcome',
    'thank you',
    'thanks for joining',
    'thanks for shopping',
    'new customer',
    'first purchase',
    'account created',
    'signup',
    'joined',
    'member',
    'membership',
    'onboarding',
    'getting started',
    'hello',
    'hi there',
    'nice to meet you',
    'glad you\'re here',
    'retail',
    'store',
    'shop',
    'shopping'
  ],

  // IMAGE KEYWORDS
  imageKeywords: {
    hero: ['retail', 'store', 'shopping', 'brand', 'lifestyle'],
    feature: ['product', 'merchandise', 'collection', 'display'],
    product: ['apparel', 'clothing', 'shoes', 'accessories'],
    background: ['texture', 'pattern', 'minimal', 'clean'],
    people: ['customer', 'happy shopper', 'lifestyle', 'diverse']
  },

  // COMPLETE EXAMPLE EMAIL
  exampleEmail: `import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export const RetailWelcomeEmail = () => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily={["Helvetica Neue", "Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to StyleCraft - Premium Fashion Delivered</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans text-black antialiased">
          <Container className="mx-auto max-w-[600px] bg-white">
            
            {/* Top Banner */}
            <Section className="bg-[#EFEFEF] px-4 py-3">
              <Text className="m-0 text-xs text-[#222222]">
                Style & quality straight to your inbox
              </Text>
            </Section>

            {/* Header with Logo and Find Store */}
            <Section className="px-4 py-5">
              <Row>
                <Column>
                  <Img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=24&fit=crop"
                    width={150}
                    height={24}
                    alt="StyleCraft Logo"
                    style={{ width: '150px', height: 'auto' }}
                  />
                </Column>
                <Column align="right">
                  <Link href="https://stylecraft.com/stores" className="text-sm font-bold text-[#222222] no-underline">
                    📍 Find store
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Hero Image */}
            <Section>
              <Img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=500&fit=crop"
                width={600}
                height={500}
                alt="Modern retail store interior with stylish product displays"
                style={{ width: '100%', height: 'auto' }}
              />
            </Section>

            {/* Welcome Section */}
            <Section className="py-14 text-center">
              <Text className="m-0 text-3xl font-semibold">
                Welcome to StyleCraft
              </Text>
              <Hr style={{ maxWidth: '80px', borderWidth: '4px', borderColor: '#D4082D', marginTop: '32px', marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }} />
              <Text className="m-0 text-base text-[#090909]">
                Keep checking your inbox for the latest offers and exclusive drops.
              </Text>
              <Button
                href="https://stylecraft.com/shop"
                style={{
                  backgroundColor: '#D00B2C',
                  color: '#ffffff',
                  padding: '16px 56px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginTop: '24px',
                }}
              >
                Explore
              </Button>
            </Section>

            {/* Secondary Image */}
            <Section>
              <Img
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=390&fit=crop"
                width={600}
                height={390}
                alt="Premium shoes and apparel collection display"
                style={{ width: '100%', height: 'auto' }}
              />
            </Section>

            {/* Thank You / Survey Section */}
            <Section className="py-14 text-center">
              <Text className="m-0 text-3xl font-semibold">
                Thanks for shopping with us
              </Text>
              <Hr style={{ maxWidth: '80px', borderWidth: '4px', borderColor: '#D4082D', marginTop: '32px', marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }} />
              <Text className="m-0 text-base text-[#090909]">
                We value your feedback, and would love to hear about your
                experience in this brief survey.
              </Text>
              <Link href="https://stylecraft.com/survey">
                <Text className="mt-3 py-4 text-sm font-bold text-[#CF0F2C] underline">
                  Take survey
                </Text>
              </Link>
            </Section>

            {/* Dark Footer Section */}
            <Section className="bg-[#151415] px-4 py-5">
              <Row>
                <Column>
                  <Link href="https://stylecraft.com/account">
                    <Text className="m-0 pl-4 text-sm font-bold text-white">
                      Log in or create an account
                    </Text>
                  </Link>
                </Column>
                <Column align="right">
                  <Link href="https://stylecraft.com/stores" className="text-sm font-bold text-white no-underline">
                    📍 Find store
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Local Store Information */}
            <Section style={{ borderBottom: '1px solid #EFEFEF', padding: '28px 16px' }}>
              <Row>
                <Column style={{ width: 'auto', verticalAlign: 'top' }}>
                  <Text className="m-0 text-sm font-bold text-[#222222]">
                    Your Local store:
                  </Text>
                </Column>
                <Column style={{ paddingLeft: '12px' }}>
                  <Text className="m-0 text-sm font-bold text-[#222222]">
                    StyleCraft Flagship Store
                  </Text>
                  <Text className="m-0 text-xs text-[#222222]">
                    221 Fashion Avenue
                  </Text>
                  <Text className="m-0 text-xs text-[#222222]">
                    New York, NY 10001
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Forward to Friend Section */}
            <Section className="px-4 py-7">
              <Text className="m-0 text-sm text-[#222222]">
                Got this from a friend?{' '}
                <Link href="https://stylecraft.com/signup" className="font-bold text-[#222222]">
                  Sign up for StyleCraft emails
                </Link>
              </Text>
            </Section>

            {/* Footer Links */}
            <Section className="px-4 pb-4">
              <Row>
                <Column>
                  <Link className="text-xs text-black no-underline" href="https://stylecraft.com/view" style={{ marginRight: '16px' }}>
                    View in browser
                  </Link>
                  <Link className="text-xs text-black no-underline" href="https://stylecraft.com/unsubscribe" style={{ marginRight: '16px' }}>
                    Unsubscribe
                  </Link>
                  <Link className="text-xs text-black no-underline" href="https://stylecraft.com/privacy" style={{ marginRight: '16px' }}>
                    Privacy Policy
                  </Link>
                  <Link className="text-xs text-black no-underline" href="https://stylecraft.com/terms" style={{ marginRight: '16px' }}>
                    Terms
                  </Link>
                  <Link className="text-xs text-black no-underline" href="https://stylecraft.com/help">
                    Help
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Legal Text */}
            <Section className="px-4 pb-8">
              <Text className="text-xs text-[#222222]">
                © 2025, StyleCraft Inc. 221 Fashion Avenue, New York, NY 10001
              </Text>
              <Text className="text-xs text-[#666666]">
                Product availability may vary in stores. This email is sent
                from an account we use for sending messages only. For assistance, use our{' '}
                <Link href="https://stylecraft.com/contact" className="text-[#222222] underline">
                  Help Center
                </Link>.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default RetailWelcomeEmail`,

  // SYSTEM PROMPT
  system: `# RETAIL WELCOME EMAIL DESIGN SYSTEM

You are generating content for a retail welcome email using a proven New Balance-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, modern, retail-focused, professional
**Mood:** Welcome, friendly, inviting, brand-confident
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Brand red (#D4082D, #D00B2C, #CF0F2C) for accents and CTAs
- Text: Black (#222222, #090909) for readability
- Background: White (#ffffff) for clean, spacious feel
- Accent: Light gray (#EFEFEF) for subtle sections
- Dark: Near-black (#151415) for footer contrast

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│  Style & performance straight to inbox      │ ← Top banner (gray bg)
├─────────────────────────────────────────────┤
│  [LOGO]                      📍 Find store  │ ← Header
├─────────────────────────────────────────────┤
│                                             │
│         [HERO IMAGE - 600x500]             │ ← Lifestyle/brand image
│                                             │
├─────────────────────────────────────────────┤
│         Welcome to [Brand Name]            │
│         ════════                           │ ← Bold red divider (4px)
│         Keep checking your inbox...        │
│              [ EXPLORE ]                    │ ← Primary CTA
├─────────────────────────────────────────────┤
│                                             │
│        [SECONDARY IMAGE - 600x390]         │ ← Product/collection
│                                             │
├─────────────────────────────────────────────┤
│      Thanks for shopping with us           │
│      ════════                              │ ← Bold red divider
│      We value your feedback...             │
│         Take survey                         │ ← Text link
├─────────────────────────────────────────────┤
│  Log in / account        📍 Find store     │ ← Dark footer (black bg)
├─────────────────────────────────────────────┤
│  Your Local store:  Store Name             │
│                    Address Line 1           │ ← Store location
│                    City, State Zip          │
├─────────────────────────────────────────────┤
│  Got this from a friend? Sign up           │ ← Forward to friend
├─────────────────────────────────────────────┤
│  View | Unsubscribe | Privacy | Terms...  │ ← Footer links (inline)
├─────────────────────────────────────────────┤
│  © 2025 Brand Name, Address                │ ← Legal text
│  Product availability disclaimer...        │
└─────────────────────────────────────────────┘

## DISTINCTIVE FEATURES

### Bold Horizontal Dividers
This template uses **thick colored HR lines** as visual separators:

\`\`\`tsx
<Hr style={{ maxWidth: '80px', borderWidth: '4px', borderColor: '#D4082D', marginTop: '32px', marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }} />
\`\`\`

**Specs:**
- Width: 80px max (short, centered)
- Border: 4px thickness (bold, statement-making)
- Color: Brand primary (red #D4082D)
- Position: Centered below headlines
- Spacing: 32px above, 24px below

**Purpose:** Creates strong visual hierarchy and brand signature

### Dual-Message Structure
Two complete sections with identical structure:
1. **Welcome section**: Brand introduction, exploration CTA
2. **Thank you section**: Appreciation, feedback request

**Both sections include:**
- Large heading (text-3xl, font-semibold)
- Bold colored HR divider
- Body text (text-base)
- Call to action (button or link)

## CONTENT GUIDELINES

### Top Banner
- **Length**: 5-8 words maximum
- **Tone**: Friendly tagline, value proposition
- **Examples**:
  ✅ "Style & quality straight to your inbox"
  ✅ "Premium fashion delivered weekly"
  ❌ "Welcome to our newsletter" (too generic)

### Hero Image
- **Dimensions**: 600x500px (4:3 aspect ratio)
- **Content**: Lifestyle, brand environment, store interior
- **Style**: Professional, aspirational, on-brand
- **REQUIRED**: style={{ width: '100%', height: 'auto' }}

### Welcome Section
**Headline:**
- Format: "Welcome to [Brand Name]"
- Size: text-3xl (30px)
- Weight: font-semibold (600)

**HR Divider:**
- Use after every major heading
- Always 80px max width, 4px border, brand color
- Use inline style for precise control

**Body Text:**
- Length: 1-2 sentences
- Tone: Friendly, inviting, promise-focused

**CTA Button:**
- Text: 1-2 words (Explore, Shop Now, Discover)
- Style: Brand color background, white text, bold
- Padding: Generous (16px 56px)

### Thank You Section
**Headline:** "Thanks for shopping with us"
**Body:** Focus on feedback, survey, engagement
**CTA:** Text link with underline (not button)

### Dark Footer Section
- **Background**: Near-black (#151415)
- **Text**: White
- **Links**: Account login, Find store

### Store Location
- Label: "Your Local store:"
- Include: Store name, address, city/state/zip

### Footer Links
- **Layout**: Inline (horizontal)
- **Links**: View in browser, Unsubscribe, Privacy Policy, Terms, Help
- **Style**: Small text (text-xs), black, no underline

## 🔧 REACT EMAIL REQUIREMENTS

### CRITICAL RULES

1. **USE Tailwind className** - Wrap entire email in \`<Tailwind>\` component
2. **Tailwind for basics** - Colors, typography, spacing
3. **Inline styles for custom** - Brand colors, specific dimensions
4. **Table-based layouts** - Use Section, Row, Column for structure
5. **FORBIDDEN classes** - space-x-*, space-y-*, gap-*, hover:, focus:, dark:

### Required Imports

\`\`\`tsx
import {
  Html,
  Head,
  Body,
  Container,
  Tailwind,
  Font,
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link,
  Row,
  Column,
  Hr,
  Preview
} from '@react-email/components';
\`\`\`

### Structure
\`\`\`tsx
<Html>
  <Head>
    <Font ... />
  </Head>
  <Preview>Welcome to Brand - Tagline</Preview>
  <Tailwind>
    <Body className="bg-white">
      <Container className="mx-auto max-w-[600px]">
        {/* Content */}
      </Container>
    </Body>
  </Tailwind>
</Html>
\`\`\`

## ANTI-PATTERNS

❌ **Don't skip the HR dividers** - They're a signature design element
❌ **Don't make CTAs too wordy** - "Explore" beats "Click here to explore"
❌ **Don't forget store location** - Critical for retail brands
❌ **Don't skip the dark footer** - Creates visual contrast
❌ **Don't use thin dividers** - Must be 4px border for impact

---

**Follow the example email structure exactly, including the distinctive 4px red HR dividers and dual-message layout (welcome + thank you sections).**`
};

export default RetailWelcomeDesignSystem;

