/**
 * E-COMMERCE DISCOUNT EMAIL DESIGN SYSTEM
 * Based on DocuSign's 20% off promotional template
 * 
 * Use cases:
 * - Limited-time discount offers
 * - Promo code campaigns
 * - Seasonal sales (Black Friday, Cyber Monday)
 * - Flash sales
 * - First-time customer discounts
 * - Loyalty program offers
 */

import type { DesignSystem } from '@/emails/lib/design-system-selector';

export const EcommerceDiscountDesignSystem: DesignSystem = {
  id: 'ecommerce-discount',
  name: 'E-commerce Discount & Promo',
  description: 'Clean, conversion-focused discount email template with hero image, promo code, and prominent CTA. Perfect for limited-time offers and promotional campaigns.',

  // KEYWORD TRIGGERS
  triggers: [
    // Discounts & Offers
    'discount',
    'promo',
    'promo code',
    'sale',
    'off',
    'percent off',
    '% off',
    '20% off',
    '30% off',
    '50% off',
    'limited time',
    'offer',
    'deal',
    'coupon',
    'save',
    'flash sale',
    'special offer',
    'exclusive',
    'promotion',
    'savings',
    // Seasonal
    'black friday',
    'cyber monday',
    'clearance',
    // E-commerce
    'store',
    'shop',
    'ecommerce',
    'e-commerce',
    'retail',
    'product',
    'buy',
    'purchase',
    'cart',
    'checkout'
  ],

  // IMAGE KEYWORDS
  imageKeywords: {
    hero: ['sale', 'discount', 'shopping', 'promotion', 'offer'],
    feature: ['product', 'merchandise', 'shopping cart', 'purchase'],
    product: ['ecommerce', 'retail', 'store', 'boutique'],
    background: ['pattern', 'abstract', 'celebration', 'confetti'],
    people: ['shopping', 'happy customer', 'celebration', 'excited']
  },

  // COMPLETE EXAMPLE EMAIL
  exampleEmail: `import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export const DiscountPromoEmail = () => {
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
      <Preview>20% Off - Limited Time Offer</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#f6f8fa] font-sans antialiased">
          <Container className="mx-auto my-[40px] max-w-[600px]">
            
            {/* Header with Logo and Promo Badge */}
            <Section className="pb-[10px] pt-[30px]">
              <Row>
                <Column className="w-[40%]">
                  <Img
                    src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=114&h=25&fit=crop"
                    width={114}
                    height={25}
                    alt="ShopStyle Logo"
                    style={{ width: '114px', height: 'auto' }}
                  />
                </Column>
                <Column className="w-[60%] text-right">
                  <Row>
                    <Column>
                      <Text className="mx-4 text-sm text-black">
                        #1 Fashion Marketplace
                      </Text>
                    </Column>
                    <Column>
                      <Link href="https://example.com/sale">
                        <Text className="text-sm font-bold text-black no-underline">
                          SAVE 20%
                        </Text>
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Hero Image */}
            <Section>
              <Img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop"
                width={600}
                height={400}
                alt="Shopping bags and gifts with 20% off discount banner"
                style={{ width: '100%', height: 'auto' }}
              />
            </Section>

            {/* Main Message */}
            <Section className="bg-white px-10 pb-4 pt-10">
              <Text className="text-base leading-relaxed">
                This is the first time we have ever offered 20% off{' '}
                <span className="font-bold">monthly</span> and{' '}
                <span className="font-bold">annual</span> plans. Use promo code{' '}
                <span className="font-bold">HELLO20</span> at checkout. Offer*
                ends Friday September 17, 2023.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="bg-white px-10 pb-10 pt-4">
              <Row align="center">
                <Column align="center">
                  <Button 
                    href="https://example.com/shop"
                    style={{
                      backgroundColor: '#0369ff',
                      color: '#ffffff',
                      padding: '16px 36px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center',
                    }}
                  >
                    Save 20%
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Disclaimer */}
            <Section className="mt-3 bg-white p-10">
              <Text className="m-0 text-center text-xs text-gray-600">
                * HELLO20 offer expires September 17th, 2023 at 11:59 PM PT.
                Savings valid for the first year of an annual subscription or 
                first month of a monthly subscription when purchased on our website. 
                Offer cannot be applied to enterprise plans or bulk purchases.
              </Text>
            </Section>

            {/* Social Media Icons */}
            <Section className="px-10 pt-10">
              <Row>
                <Column align="center">
                  <Row className="table-cell">
                    <Column style={{ paddingRight: '8px' }}>
                      <Link href="https://facebook.com/shopstyle">
                        <Img
                          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=28&h=28&fit=crop"
                          width={28}
                          height={28}
                          alt="Facebook"
                          style={{ borderRadius: '4px' }}
                        />
                      </Link>
                    </Column>
                    <Column style={{ paddingRight: '8px' }}>
                      <Link href="https://twitter.com/shopstyle">
                        <Img
                          src="https://images.unsplash.com/photo-1611605698335-8b1569810432?w=28&h=28&fit=crop"
                          width={28}
                          height={28}
                          alt="Twitter"
                          style={{ borderRadius: '4px' }}
                        />
                      </Link>
                    </Column>
                    <Column style={{ paddingRight: '8px' }}>
                      <Link href="https://instagram.com/shopstyle">
                        <Img
                          src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=28&h=28&fit=crop"
                          width={28}
                          height={28}
                          alt="Instagram"
                          style={{ borderRadius: '4px' }}
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="https://linkedin.com/company/shopstyle">
                        <Img
                          src="https://images.unsplash.com/photo-1611944212129-29977ae9a909?w=28&h=28&fit=crop"
                          width={28}
                          height={28}
                          alt="LinkedIn"
                          style={{ borderRadius: '4px' }}
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Contact Info */}
            <Section className="pt-[30px]">
              <Row>
                <Column align="center">
                  <Row className="table-cell">
                    <Column style={{ paddingRight: '16px' }}>
                      <Link className="text-sm text-black no-underline" href="https://shopstyle.com">
                        www.shopstyle.com
                      </Link>
                    </Column>
                    <Column style={{ paddingRight: '16px' }}>
                      <Link className="text-sm text-black no-underline" href="mailto:hello@shopstyle.com">
                        hello@shopstyle.com
                      </Link>
                    </Column>
                    <Column>
                      <Link className="text-sm text-black no-underline" href="tel:+18777202040">
                        +1.877.720.2040
                      </Link>
                    </Column>
                  </Row>
                  <Row className="text-center">
                    <Column>
                      <Text className="m-0 mt-2 text-[13px] text-gray-600">
                        221 Main Street, Suite 1550 San Francisco, CA 94105
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Footer Links */}
            <Section className="pb-12 pt-[10px]">
              <Row>
                <Column align="center">
                  <Row className="table-cell">
                    <Column style={{ paddingRight: '24px' }}>
                      <Link
                        className="text-[13px] font-bold text-black no-underline"
                        href="https://shopstyle.com/unsubscribe"
                      >
                        Unsubscribe
                      </Link>
                    </Column>
                    <Column style={{ paddingRight: '24px' }}>
                      <Link
                        className="text-[13px] font-bold text-black no-underline"
                        href="https://shopstyle.com/preferences"
                      >
                        Manage Preferences
                      </Link>
                    </Column>
                    <Column>
                      <Link
                        className="text-[13px] font-bold text-black no-underline"
                        href="https://shopstyle.com/privacy"
                      >
                        Privacy Policy
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default DiscountPromoEmail`,

  // SYSTEM PROMPT
  system: `# E-COMMERCE DISCOUNT EMAIL DESIGN SYSTEM

You are generating content for a promotional discount email using a proven DocuSign-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, professional, conversion-focused
**Mood:** Urgent, exciting, value-driven
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Blue (#0369ff) for CTAs and links
- Background: Light gray (#f6f8fa) for contrast
- Content Areas: White (#ffffff) for readability
- Text: Black for maximum contrast and urgency

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│ [LOGO]              #1 Platform   SAVE 20%  │ ← Header with tagline
├─────────────────────────────────────────────┤
│                                             │
│         [HERO IMAGE - Full Width]          │ ← Promotional image
│              600x400px                      │
│                                             │
├─────────────────────────────────────────────┤
│  This is the first time we've offered      │
│  20% off monthly and annual plans.         │ ← Value proposition
│  Use promo code HELLO20 at checkout.       │
│  Offer ends Friday, Sept 17, 2023.         │
├─────────────────────────────────────────────┤
│              [ SAVE 20% ]                   │ ← Primary CTA button
├─────────────────────────────────────────────┤
│  * Disclaimer text with offer details      │ ← Legal fine print
│  and expiration date                        │
├─────────────────────────────────────────────┤
│  [F] [T] [I] [L]                           │ ← Social media icons
├─────────────────────────────────────────────┤
│  www.site.com | email | phone              │ ← Contact info
│  Street Address, City, State Zip           │
├─────────────────────────────────────────────┤
│  Unsubscribe | Preferences | Privacy       │ ← Footer links
└─────────────────────────────────────────────┘

## CONTENT GUIDELINES

### Header Section
- **Logo**: Company logo (114x25px recommended)
- **Tagline**: Short value prop (e.g., "#1 E-Commerce Platform")
- **Promo Badge**: Bold, attention-grabbing (e.g., "SAVE 20%")
- Link the badge to the sale landing page

### Hero Image
- **Dimensions**: 600x400px (or similar aspect ratio)
- **Content**: Product imagery, shopping scene, or promotional graphic
- **Style**: High-energy, celebratory, clear discount messaging
- **Alt text**: Descriptive with discount amount and context
- **REQUIRED**: style={{ width: '100%', height: 'auto' }}

### Main Message
- **Length**: 2-4 sentences maximum
- **Tone**: Exciting but clear, urgent but not desperate
- **Structure**:
  1. Hook: "This is the first time..." or "Exclusive offer..."
  2. Offer details: Discount amount, what it applies to
  3. Promo code: Bold, easy to copy (e.g., **HELLO20**)
  4. Urgency: Expiration date creates deadline

**Examples:**
✅ "This is the first time we've offered 20% off monthly and annual plans."
✅ "For 48 hours only, save 30% on your entire purchase."
✅ "Exclusive for our VIP members: 25% off everything in store."

❌ "We have a sale going on." (too vague)
❌ "Check out our amazing deals!!!" (too salesy)

### Promo Code
- **Format**: All caps, easy to read (HELLO20, SAVE30, FLASH25)
- **Presentation**: Bold within the text using <span className="font-bold">
- **Context**: "Use promo code **HELLO20** at checkout"

### CTA Button
- **Text**: 2-4 words, action-oriented
- **Examples**:
  ✅ "Save 20%"
  ✅ "Shop Now"
  ✅ "Claim Discount"
  ✅ "Redeem Offer"
  ❌ "Click Here"
  ❌ "Learn More"
- **Style**: Prominent, high contrast, rounded corners
- **Color**: Primary brand color (default: #0369ff blue)
- **Padding**: MINIMUM 16px 36px for touch targets

### Disclaimer
- **Required elements**:
  - Promo code name and expiration date
  - What the discount applies to
  - Any exclusions (enterprise plans, bulk orders, etc.)
- **Format**: Small text (12px), center-aligned
- **Tone**: Legal but not intimidating
- **Start with**: "* [PROMO CODE] offer expires..."

### Social Media Icons
- **Size**: 28x28px
- **Spacing**: 8px between icons
- **Style**: Consistent design with border-radius
- **Links**: Active social media profiles

### Contact Information
- **Include**: Website, email, phone (all clickable)
- **Format**: Horizontal layout, separated by spacing
- **Below**: Physical address (required for CAN-SPAM compliance)
- **Size**: Small text (13-14px)

### Footer Links
- **Required**: Unsubscribe, Manage Preferences, Privacy Policy
- **Style**: Bold text, inline layout
- **Spacing**: Consistent padding between links

## COLOR PALETTE

### Primary Colors
- **CTA Button**: #0369ff (bright blue)
- **Background**: #f6f8fa (light gray)
- **Content Sections**: #ffffff (white)
- **Text**: #000000 (black for maximum contrast)

### Usage Rules
- Use white backgrounds for content sections (readability)
- Use light gray for overall page background (depth)
- Use bright blue for CTAs (attention, action)
- Use black text (urgency, clarity)

## TYPOGRAPHY

### Font Setup
Use React Email's Font component in <Head>:
\`\`\`tsx
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
\`\`\`

### Text Hierarchy
- **Main message**: 16px (text-base), regular weight
- **Bold emphasis**: font-bold class on key phrases
- **Disclaimer**: 12px (text-xs), regular weight
- **Contact info**: 13-14px (text-sm), regular weight
- **Footer links**: 13px (text-[13px]), bold weight

### Emphasis
- Use \`<span className="font-bold">\` for:
  - Discount percentages
  - Promo codes
  - Key words (monthly, annual, exclusive)
  - Expiration dates

## TAILWIND CLASSES

This template uses Tailwind CSS classes inside <Tailwind> wrapper.

### Spacing
- \`px-10\` = padding horizontal 40px
- \`py-4\` = padding vertical 16px
- \`mt-3\` = margin top 12px

### Layout
- \`text-center\` = center-aligned text
- \`text-right\` = right-aligned text
- \`w-[40%]\` = width 40%
- \`table-cell\` = display as table cell

### Colors
- \`bg-white\` = white background
- \`bg-[#0369ff]\` = custom blue background
- \`text-black\` = black text
- \`text-gray-600\` = muted gray text

### Typography
- \`text-sm\` = 14px
- \`text-base\` = 16px
- \`text-xs\` = 12px
- \`font-bold\` = bold weight

## CONVERSION OPTIMIZATION

### What Makes This Template Convert

1. **Visual Hierarchy**
   - Logo establishes brand trust
   - Hero image creates excitement
   - Clear message explains offer
   - Prominent CTA drives action

2. **Urgency Elements**
   - Expiration date creates deadline
   - "First time ever" creates exclusivity
   - "Limited time" drives immediate action

3. **Trust Signals**
   - Professional design
   - Clear terms and conditions
   - Complete contact information
   - Easy unsubscribe option

4. **Friction Reduction**
   - Promo code clearly stated
   - Single, prominent CTA
   - Mobile-responsive design

## TONE AND VOICE

**Overall Tone:** Exciting, urgent, professional, trustworthy

**Do:**
- Create urgency with deadlines
- Use specific numbers (20%, 30%, 50%)
- Be clear about what's included/excluded
- Make the promo code easy to find and copy
- Use bold for key information

**Don't:**
- Be overly salesy or desperate
- Use all caps everywhere (just promo codes and CTAs)
- Hide the expiration date
- Make the disclaimer too complex
- Use vague language ("amazing deal", "incredible savings")

## ANTI-PATTERNS

❌ **Don't bury the promo code** - Make it bold and prominent
❌ **Don't use multiple CTAs** - One primary action only
❌ **Don't forget the expiration date** - Creates urgency and legal clarity
❌ **Don't skip the disclaimer** - Required for legal compliance
❌ **Don't use weak CTAs** - "Save 20%" beats "Click Here"
❌ **Don't overdesign** - Clean and simple converts better

## 🔧 REACT EMAIL REQUIREMENTS

### CRITICAL RULES

1. **USE Tailwind className** - Wrap entire email in \`<Tailwind>\` component
2. **Tailwind for basics** - Colors, typography, spacing: \`className="p-6 bg-white text-gray-900"\`
3. **Inline styles for custom** - Brand colors, gaps: \`style={{ backgroundColor: '#your-color' }}\`
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
  Preview
} from '@react-email/components';
\`\`\`

### Structure
\`\`\`tsx
<Html>
  <Head>
    <Font ... />
  </Head>
  <Preview>20% Off - Limited Time</Preview>
  <Tailwind>
    <Body className="bg-[#f6f8fa]">
      <Container className="mx-auto max-w-[600px]">
        {/* Content */}
      </Container>
    </Body>
  </Tailwind>
</Html>
\`\`\`

---

**Follow the example email structure exactly, adapting discount amounts, promo codes, and expiration dates to match the user's promotional campaign.**`
};

export default EcommerceDiscountDesignSystem;

