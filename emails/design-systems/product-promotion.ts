/**
 * PRODUCT PROMOTION EMAIL DESIGN SYSTEM
 * Based on Abercrombie & Fitch's denim category campaign
 * 
 * Use cases:
 * - Product category promotions (denim, outerwear, shoes)
 * - New collection launches
 * - Seasonal product drops
 * - Tiered discount offers
 * - Category-specific sales
 * - Featured product campaigns
 */

export const ProductPromotionDesignSystem = {
  id: 'product-promotion',
  name: 'Product Category Promotion',
  description: 'Product-focused promotional email with hero imagery, tiered discount offers, dual CTAs (men\'s/women\'s), and extensive brand navigation. Perfect for category launches and seasonal collections.',

  // KEYWORD TRIGGERS
  triggers: [
    'product launch',
    'new collection',
    'new arrival',
    'collection',
    'category',
    'denim',
    'jeans',
    'outerwear',
    'shoes',
    'accessories',
    'seasonal',
    'fall collection',
    'winter collection',
    'spring collection',
    'summer collection',
    'featured',
    'curate',
    'rotation',
    'wardrobe',
    'capsule',
    'shop women',
    'shop men',
    'tiered discount',
    'spend and save',
    'fashion',
    'apparel',
    'clothing'
  ],

  // IMAGE KEYWORDS
  imageKeywords: {
    hero: ['fashion', 'apparel', 'lifestyle', 'model', 'clothing'],
    feature: ['product', 'collection', 'merchandise', 'display'],
    product: ['jeans', 'denim', 'outfit', 'style', 'wardrobe'],
    background: ['texture', 'fabric', 'minimal', 'pattern'],
    people: ['model', 'fashion model', 'lifestyle', 'wearing']
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

export default function ProductPromotionEmail() {
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
      <Preview>Your rotation is about to get a serious upgrade</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[600px] bg-white">
            
            {/* Top Pre-Header Banner */}
            <Link href="https://stylecraft.com">
              <Section className="py-2 px-2">
                <Text className="text-center text-[10px] text-black m-0">
                  Your rotation is about to get a serious upgrade
                </Text>
              </Section>
            </Link>

            {/* Logo Section */}
            <Section className="text-center">
              <Link href="https://stylecraft.com">
                <Img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=270&h=27&fit=crop"
                  width={270}
                  height={27}
                  alt="StyleCraft Logo"
                  style={{ margin: '50px auto 30px auto', width: '270px', height: 'auto' }}
                />
              </Link>
            </Section>

            {/* Dark Promotional Banner */}
            <Section style={{ backgroundColor: '#253746' }} className="py-2 px-5">
              <Text className="text-center text-white text-[13px] m-0">
                Online Only, myStyleCraft Members Earn 2x Points on All Denim{' '}
                <Link href="https://stylecraft.com/denim" className="text-white underline">
                  SHOP NOW
                </Link>
              </Text>
            </Section>

            {/* Hero Product Image */}
            <Section>
              <Link href="https://stylecraft.com/denim">
                <Img 
                  src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=740&fit=crop"
                  width={600}
                  height={740}
                  alt="Model wearing premium denim jeans and casual top in modern lifestyle setting"
                  style={{ width: '100%', height: 'auto' }}
                />
              </Link>
            </Section>

            {/* Product Message */}
            <Section className="mt-6 px-5">
              <Text className="text-center text-lg m-0" style={{ color: '#253746' }}>
                It's only you + StyleCraft denim from here on out.
              </Text>
            </Section>

            {/* Primary CTA Button */}
            <Section className="text-center mt-6">
              <Button 
                href="https://stylecraft.com/shop"
                style={{
                  backgroundColor: '#ffffff',
                  padding: '16px 60px',
                  color: '#253746',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: '1px solid #000000',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                SHOP NOW
              </Button>
            </Section>

            {/* Secondary Product Image */}
            <Section className="mt-12 text-center">
              <Link href="https://stylecraft.com/collection">
                <Img 
                  src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&h=684&fit=crop"
                  width={500}
                  height={684}
                  alt="Denim collection flatlay with various jeans styles and accessories"
                  style={{ width: '500px', maxWidth: '100%', height: 'auto', margin: '0 auto' }}
                />
              </Link>
            </Section>

            {/* Dual Category CTAs (Women's / Men's) */}
            <Section className="px-12 mt-6">
              <Row>
                <Column style={{ width: '50%', paddingRight: '10px' }}>
                  <Button 
                    href="https://stylecraft.com/womens"
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '16px 0',
                      color: '#253746',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      border: '1px solid #000000',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    SHOP WOMEN'S
                  </Button>
                </Column>
                <Column style={{ width: '50%', paddingLeft: '10px' }}>
                  <Button 
                    href="https://stylecraft.com/mens"
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '16px 0',
                      color: '#253746',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      border: '1px solid #000000',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    SHOP MEN'S
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Tiered Discount Offer Box */}
            <Section className="mt-12 px-12">
              <Section style={{ backgroundColor: '#d1d2ce', padding: '40px 32px' }}>
                {/* Offer Headline */}
                <Text className="text-center m-0" style={{ fontSize: '32px', fontStyle: 'italic', color: '#213142', lineHeight: '35px' }}>
                  Curate Your Capsule
                </Text>
                
                {/* Primary Discount */}
                <Text className="text-center m-0" style={{ fontSize: '60px', color: '#213142' }}>
                  $50 off
                </Text>
                
                {/* Offer Details */}
                <Text className="text-center m-0" style={{ fontSize: '30px', color: '#213142', lineHeight: '35px' }}>
                  purchases of $150+
                </Text>
                <Text className="text-center m-0 font-bold" style={{ fontSize: '15px', color: '#213142', lineHeight: '35px' }}>
                  OR $25 OFF PURCHASES OF $100*
                </Text>
                
                {/* Dual Shop Links */}
                <Section className="mt-4 text-center">
                  <Link href="https://stylecraft.com/womens" style={{ marginRight: '45px' }}>
                    <Text className="inline font-bold underline" style={{ fontSize: '15px', color: '#213142' }}>
                      SHOP WOMEN'S
                    </Text>
                  </Link>
                  <Link href="https://stylecraft.com/mens">
                    <Text className="inline font-bold underline" style={{ fontSize: '15px', color: '#213142' }}>
                      SHOP MEN'S
                    </Text>
                  </Link>
                </Section>
              </Section>
            </Section>

            {/* Brand Navigation Section */}
            <Section className="mt-12 px-12">
              <Section style={{ backgroundColor: '#f6f6f6', padding: '0 65px' }}>
                {/* Main Brand Link */}
                <Link href="https://stylecraft.com">
                  <Section style={{ borderBottom: '1px solid #253746', padding: '30px 0' }}>
                    <Text className="text-center m-0" style={{ color: '#253746' }}>
                      StyleCraft
                    </Text>
                  </Section>
                </Link>
                
                {/* Sub-Brand Link */}
                <Link href="https://stylecraft.com/kids">
                  <Section style={{ borderBottom: '1px solid #253746', padding: '30px 0' }}>
                    <Text className="text-center m-0" style={{ color: '#253746' }}>
                      stylecraft kids
                    </Text>
                  </Section>
                </Link>
                
                {/* Rewards Program Link */}
                <Link href="https://stylecraft.com/rewards">
                  <Section style={{ borderBottom: '1px solid #253746', padding: '30px 0' }}>
                    <Text className="text-center m-0 italic" style={{ color: '#253746' }}>
                      myRewards
                    </Text>
                  </Section>
                </Link>

                {/* Download App Section */}
                <Section className="mt-8 text-center">
                  <Text className="m-0" style={{ color: '#253746' }}>
                    Download the App
                  </Text>
                </Section>
                
                {/* App Store Badges */}
                <Section className="mt-4">
                  <Row>
                    <Column style={{ width: '50%', paddingRight: '15px', textAlign: 'right' }}>
                      <Link href="https://apps.apple.com">
                        <Img 
                          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=170&h=40&fit=crop"
                          width={170}
                          height={40}
                          alt="Download on the App Store"
                          style={{ borderRadius: '4px' }}
                        />
                      </Link>
                    </Column>
                    <Column style={{ width: '50%', paddingLeft: '15px' }}>
                      <Link href="https://play.google.com">
                        <Img 
                          src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=170&h=40&fit=crop"
                          width={170}
                          height={40}
                          alt="Get it on Google Play"
                          style={{ borderRadius: '4px' }}
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
                
                {/* Social Media Icons */}
                <Section className="mt-8 text-center">
                  <Link href="https://instagram.com/stylecraft" style={{ marginRight: '30px' }}>
                    <Img 
                      src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=47&h=47&fit=crop"
                      width={47}
                      height={47}
                      alt="Instagram"
                      style={{ borderRadius: '4px', display: 'inline-block' }}
                    />
                  </Link>
                  <Link href="https://tiktok.com/@stylecraft">
                    <Img 
                      src="https://images.unsplash.com/photo-1611605698335-8b1569810432?w=47&h=47&fit=crop"
                      width={47}
                      height={47}
                      alt="TikTok"
                      style={{ borderRadius: '4px', display: 'inline-block' }}
                    />
                  </Link>
                </Section>
                
                {/* Legal / Disclaimer Text */}
                <Section className="py-4">
                  <Text className="text-center m-0" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    *Offer valid in stores and online July 28, 2025 to August 4, 2025 in US/CA. Excludes clearance and gift cards. Discount applied to subtotal before tax and shipping/handling at checkout.
                  </Text>
                  <Text className="text-center m-0 mt-2" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    <Link href="https://stylecraft.com/terms" style={{ color: '#a3a3a3', textDecoration: 'underline' }}>
                      SEE ALL OFFER DETAILS
                    </Link>
                  </Text>
                  <Text className="text-center m-0 mt-4" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    To ensure delivery to your inbox, add{' '}
                    <Link href="mailto:hello@stylecraft.com" style={{ color: '#a3a3a3', textDecoration: 'underline' }}>
                      hello@stylecraft.com
                    </Link>{' '}
                    to your address book.
                  </Text>
                  <Text className="text-center m-0 mt-4" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    You have received this email since you submitted your email address to our list of subscribers. To unsubscribe, please{' '}
                    <Link href="https://stylecraft.com/unsubscribe" style={{ color: '#a3a3a3', textDecoration: 'underline' }}>
                      click here
                    </Link>.
                  </Text>
                  <Text className="text-center m-0 mt-4" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    Please see our{' '}
                    <Link href="https://stylecraft.com/terms" style={{ color: '#a3a3a3' }}>Terms of Use</Link>
                    , and to know how we use your personal data, please see our{' '}
                    <Link href="https://stylecraft.com/privacy" style={{ color: '#a3a3a3' }}>Privacy Policy</Link>.
                  </Text>
                  <Text className="text-center m-0 mt-4" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    StyleCraft, 200 Fashion Avenue, New York, NY 10001
                  </Text>
                  <Text className="text-center m-0" style={{ fontSize: '8px', color: '#a3a3a3', lineHeight: '12px' }}>
                    <Link href="https://stylecraft.com" style={{ color: '#a3a3a3', textDecoration: 'underline' }}>
                      www.StyleCraft.com
                    </Link>
                  </Text>
                </Section>
              </Section>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}`,

  // SYSTEM PROMPT
  system: `# PRODUCT PROMOTION EMAIL DESIGN SYSTEM

You are generating content for a product category promotional email using a proven Abercrombie & Fitch-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, editorial, product-focused, modern retail
**Mood:** Aspirational, lifestyle-driven, fashion-forward
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Dark blue-gray (#253746) for text and CTAs
- Accent: Beige/gray (#d1d2ce) for offer boxes
- Background: White (#ffffff) for main content, light gray (#f6f6f6) for footer
- Text: Black for pre-header, light gray (#a3a3a3) for legal text

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│  Pre-header text (10px, center)            │ ← Clickable banner
├─────────────────────────────────────────────┤
│              [LOGO - 270px]                 │ ← Large centered logo
├─────────────────────────────────────────────┤
│  Dark banner: Promotional message + link   │ ← #253746 background
├─────────────────────────────────────────────┤
│         [HERO IMAGE - 600x740]             │ ← Full-width product photo
├─────────────────────────────────────────────┤
│  Product message text (18px, center)       │
│              [ SHOP NOW ]                   │ ← White CTA with border
├─────────────────────────────────────────────┤
│      [Secondary Image - 500x684]           │ ← Product collage/flatlay
├─────────────────────────────────────────────┤
│  [ SHOP WOMEN'S ]  [ SHOP MEN'S ]         │ ← Dual CTAs side-by-side
├─────────────────────────────────────────────┤
│  ╔════════════════════════════════╗        │
│  ║  Curate Your Capsule           ║        │
│  ║  $50 off                       ║        │ ← Beige offer box
│  ║  purchases of $150+            ║        │
│  ║  OR $25 OFF $100*              ║        │
│  ║  SHOP WOMEN'S | SHOP MEN'S     ║        │
│  ╚════════════════════════════════╝        │
├─────────────────────────────────────────────┤
│  Brand Navigation                          │
│  ─────────────────                         │ ← Gray navigation section
│  StyleCraft | Kids | myRewards            │
│  Download the App                          │
│  [App Store]  [Google Play]               │
│  [IG]  [TikTok]                           │
│  Legal disclaimers...                      │
└─────────────────────────────────────────────┘

## CONTENT GUIDELINES

### Pre-Header Text
- **Length**: 5-10 words
- **Tone**: Teasing, anticipatory
- **Examples**:
  ✅ "Your rotation is about to get a serious upgrade"
  ✅ "The collection you've been waiting for"

### Dark Promotional Banner
- **Background**: Dark (#253746)
- **Text color**: White
- **Content**: Member benefit or urgency message
- **Include**: Inline "SHOP NOW" link with underline

### Product Message
- **Length**: 8-15 words
- **Tone**: Confident, exclusive, conversational
- **Font size**: 18px

### CTA Buttons
**Primary CTA:**
- Style: White background, black border (1px), bold text
- Padding: 16px 60px
- Text: "SHOP NOW", "SHOP COLLECTION"

**Dual CTAs (Side-by-Side):**
- Layout: 50/50 split with gap
- Style: Same as primary, full width
- Text: "SHOP WOMEN'S" / "SHOP MEN'S"

### Tiered Discount Offer Box
**Container:**
- Background: Beige/gray (#d1d2ce)
- Padding: 40px 32px

**Content Structure:**
1. **Headline** (italic, 32px): "Curate Your Capsule"
2. **Primary Discount** (60px): "$50 off"
3. **Purchase Threshold** (30px): "purchases of $150+"
4. **Secondary Offer** (15px, bold): "OR $25 OFF PURCHASES OF $100*"
5. **Dual Links** (15px, bold, underlined): "SHOP WOMEN'S | SHOP MEN'S"

### Brand Navigation Section
**Structure:**
- Background: Light gray (#f6f6f6)
- Border: Bottom border on each link
- Links: Main brand, sub-brands, rewards program

### App Download & Social
- Two app store badges (170x40px)
- Social icons: Instagram, TikTok
- Centered layout

### Legal/Disclaimer Text
- Font size: 8px
- Color: Light gray (#a3a3a3)
- Include: Offer terms, unsubscribe, privacy, address

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
  <Preview>Your rotation is about to get a serious upgrade</Preview>
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

❌ **Don't skip the pre-header** - Sets the tone
❌ **Don't use colored CTA backgrounds** - White with border is the style
❌ **Don't forget dual CTAs** - Women's/Men's split is essential
❌ **Don't skip the offer box** - Tiered discounts drive AOV
❌ **Don't forget brand navigation** - Drives cross-category traffic
❌ **Don't skip extensive legal** - Required for compliance

---

**Follow the example email structure exactly, including the tiered offer box, dual CTAs, brand navigation, and extensive legal disclaimer section.**`
};

export default ProductPromotionDesignSystem;

