/**
 * FASHION CAMPAIGN EMAIL DESIGN SYSTEM
 * Based on Adidas Y-3 Fall/Winter collection campaign
 *
 * Use cases:
 * - Seasonal collection launches
 * - Fashion brand campaigns
 * - Luxury product unveilings
 * - Editorial-style announcements
 * - Designer collaborations
 * - Lookbook releases
 * - Member-exclusive previews
 * - High-end retail campaigns
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const FashionCampaignDesignSystem: DesignSystem = {
  id: 'fashion-campaign',
  name: 'Fashion Campaign & Editorial',
  description:
    'Editorial-style fashion campaign email with member status bar, large hero imagery, bold typography, and repeating image-headline-CTA pattern. Perfect for luxury brands and seasonal collection launches.',

  // KEYWORD TRIGGERS
  triggers: [
    'collection',
    'campaign',
    'fashion',
    'lookbook',
    'seasonal',
    'fall winter',
    'spring summer',
    'new arrival',
    'designer',
    'collaboration',
    'exclusive',
    'limited edition',
    'luxury',
    'editorial',
    'unveiling',
    'preview',
    'runway',
    'style',
    'trend',
    'fashion week',
    'capsule collection',
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['fashion', 'model', 'runway', 'editorial', 'lifestyle'],
    feature: ['apparel', 'clothing', 'outfit', 'style', 'look'],
    product: ['designer', 'luxury', 'fashion shoot', 'campaign'],
    background: ['urban', 'minimal', 'black and white', 'monochrome'],
    people: ['fashion model', 'editorial model', 'lifestyle', 'street style'],
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
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
import * as React from 'react'

export const FashionCampaignEmail = () => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Noto Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Adidas Y-3 Fall/Winter 2024 Collection</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans text-black antialiased">
          <Container className="mx-auto bg-white">
            
            {/* Pre-Header Links */}
            <Section className="my-1">
              <Row>
                <Column>
                  <Link href="https://example.com/story" className="text-sm text-[#767677] underline">
                    2 Unique individuals - 1 iconic city
                  </Link>
                </Column>
                <Column align="right">
                  <Link href="https://example.com/view-online" className="text-sm text-[#767677] underline">
                    View this email online
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Logo */}
            <Section className="my-6">
              <Row>
                <Column align="center">
                  <Img
                    src="https://via.placeholder.com/38x24/000000/ffffff?text=Y-3"
                    className="h-[24px] w-[38px]"
                    alt="Y-3 Logo"
                  />
                </Column>
              </Row>
            </Section>

            {/* Member Status Bar */}
            <Section className="border-b border-t border-solid border-[#C6C6C6] pb-[13px] pt-4">
              <Row className="table-cell w-0 whitespace-nowrap">
                <Column className="pl-4">
                  <Text className="m-0 text-base font-bold leading-[22px]">
                    LEVEL 2
                  </Text>
                </Column>
              </Row>
              <Row className="table-cell pl-6">
                <Column>
                  <Img
                    src="https://via.placeholder.com/17x17/FFD700/000000?text=★"
                    className="h-[17px] w-[17px]"
                    alt="Points icon"
                  />
                </Column>
                <Column className="pl-3">
                  <Text className="m-0 text-base font-bold leading-[22px]">
                    1551
                  </Text>
                </Column>
                <Column className="pl-6">
                  <Text className="m-0 text-base leading-[22px]">
                    Points to spend
                  </Text>
                </Column>
              </Row>
              <Row className="table-cell whitespace-nowrap">
                <Column>
                  <Text className="m-0 text-base leading-[22px]">JOHN DOE</Text>
                </Column>
              </Row>
            </Section>

            {/* Hero Image 1 */}
            <Section className="mt-10">
              <Row>
                <Img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=426&fit=crop"
                  className="h-[426px] w-full"
                  alt="Fashion models in Y-3 Fall/Winter collection on New York City street"
                />
              </Row>
            </Section>

            {/* Editorial Section 1 */}
            <Section className="mt-10">
              <Row>
                <Text className="m-0 text-[38px] leading-[38px] tracking-[1px] text-[#111111]">
                  UNDENIABLY Y-3
                </Text>
              </Row>
              <Row>
                <Text className="mb-0 mt-10 text-base leading-[22px] text-[#111111]">
                  Unveiling the incomparable A$AP Nast and the uncompromising
                  Gabbriette as the faces of Y-3's Fall/Winter 2024 Campaign.
                </Text>
                <Text className="m-0 text-base leading-[22px] text-[#111111]">
                  Shot by legendary photographer Max Vadukul on the streets of
                  New York City.
                </Text>
              </Row>
              <Row className="mt-10">
                <Column>
                  <Button href="https://example.com/collection" className="bg-[#111111] px-5 py-[14px]">
                    <Row>
                      <Column>
                        <Text className="table-cell text-sm font-bold uppercase tracking-[2px] text-white">
                          Explore the collection
                        </Text>
                      </Column>
                      <Column>
                        <Img
                          src="https://via.placeholder.com/16x16/ffffff/000000?text=→"
                          className="table-cell pl-3"
                          alt="Arrow icon"
                        />
                      </Column>
                    </Row>
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Hero Image 2 */}
            <Section className="mt-10">
              <Row>
                <Img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=426&fit=crop"
                  className="h-[426px] w-full"
                  alt="Model showcasing Y-3 women's collection in urban setting"
                />
              </Row>
            </Section>

            {/* Editorial Section 2 */}
            <Section className="mt-10">
              <Row>
                <Text className="m-0 text-[38px] leading-[38px] tracking-[1px] text-[#111111]">
                  FASHION IS MUSIC, MUSIC IS FASHION
                </Text>
              </Row>
              <Row>
                <Text className="mb-0 mt-10 text-base leading-[22px] text-[#111111]">
                  Y-3's latest collection is a bold exploration of daring
                  contrasts and evocative juxtapositions.
                </Text>
              </Row>
              <Row className="mt-10">
                <Column>
                  <Button href="https://example.com/women" className="bg-[#111111] px-5 py-[14px]">
                    <Row>
                      <Column>
                        <Text className="table-cell text-sm font-bold uppercase tracking-[2px] text-white">
                          Shop women
                        </Text>
                      </Column>
                      <Column>
                        <Img
                          src="https://via.placeholder.com/16x16/ffffff/000000?text=→"
                          className="table-cell pl-3"
                          alt="Arrow icon"
                        />
                      </Column>
                    </Row>
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Hero Image 3 */}
            <Section className="mt-10">
              <Row>
                <Img
                  src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=426&fit=crop"
                  className="h-[426px] w-full"
                  alt="Model wearing Y-3 men's collection against urban backdrop"
                />
              </Row>
            </Section>

            {/* Editorial Section 3 */}
            <Section className="mt-10">
              <Row>
                <Text className="m-0 text-[38px] leading-[38px] tracking-[1px] text-[#111111]">
                  A LOVE LETTER TO NEW YORK
                </Text>
              </Row>
              <Row>
                <Text className="mb-0 mt-10 text-base leading-[22px] text-[#111111]">
                  Playing with themes of uniformity, scale, and movement,
                  highlighted through adidas' iconic three stripes; Y-3's latest
                  collection is a defiant expression of the brand's DNA.
                </Text>
              </Row>
              <Row className="mt-10">
                <Column>
                  <Button href="https://example.com/men" className="bg-[#111111] px-5 py-[14px]">
                    <Row>
                      <Column>
                        <Text className="table-cell text-sm font-bold uppercase tracking-[2px] text-white">
                          Shop men
                        </Text>
                      </Column>
                      <Column>
                        <Img
                          src="https://via.placeholder.com/16x16/ffffff/000000?text=→"
                          className="table-cell pl-3"
                          alt="Arrow icon"
                        />
                      </Column>
                    </Row>
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Brand Tagline Section */}
            <Section className="mt-11 border-b border-t border-solid border-[#C6C6C6]">
              <Row className="pb-[13px] pt-4">
                <Column align="center">
                  <Link
                    href="https://example.com/about"
                    className="m-0 text-sm font-bold uppercase leading-[22px] tracking-[2px] text-[#111111]"
                  >
                    Stories, styles and sportswear at adidas, since 1949
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Footer Links */}
            <Section className="my-10">
              <Row className="table-cell w-0 whitespace-nowrap">
                <Column align="left">
                  <Link className="text-sm text-black no-underline" href="https://example.com/account">
                    My Account
                  </Link>
                </Column>
              </Row>
              <Row className="table-cell w-0 whitespace-nowrap pl-4">
                <Column align="left">
                  <Link className="text-sm text-black no-underline" href="https://example.com/privacy">
                    Privacy Statement
                  </Link>
                </Column>
              </Row>
              <Row className="table-cell w-0 whitespace-nowrap pl-4">
                <Column align="left">
                  <Link className="text-sm text-black no-underline" href="https://example.com/support">
                    Support
                  </Link>
                </Column>
              </Row>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default FashionCampaignEmail`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# FASHION CAMPAIGN EMAIL DESIGN SYSTEM

You are generating content for a fashion campaign email using a proven Adidas Y-3-inspired editorial template structure.

## VISUAL AESTHETIC

**Style:** Editorial, high-fashion, minimalist, luxury
**Mood:** Bold, confident, artistic, sophisticated
**Typography:** Noto Sans font family (or similar modern sans-serif)
**Color Palette:**
- Primary: Black (#111111) for text and CTAs
- Secondary: Medium gray (#767677) for secondary links
- Accent: Border gray (#C6C6C6) for dividers
- Background: White (#ffffff) for clean, gallery-like feel
- Member indicators: Gold/yellow for points/status icons

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│  Story link              View online →      │ ← Pre-header (gray)
├─────────────────────────────────────────────┤
│              [LOGO - centered]              │
├═════════════════════════════════════════════┤ ← Border
│  LEVEL 2  ★ 1551 Points  JOHN DOE        │ ← Member status bar
├═════════════════════════════════════════════┤
│                                             │
│         [HERO IMAGE - 600x426]             │
│                                             │
├─────────────────────────────────────────────┤
│  BOLD HEADLINE (38px)                      │
│                                             │
│  Editorial description paragraph...         │
│  Second paragraph...                        │
│                                             │
│  [ EXPLORE THE COLLECTION → ]              │ ← Black CTA
├─────────────────────────────────────────────┤
│                                             │
│         [HERO IMAGE 2]                     │
│                                             │
│  SECOND HEADLINE                           │
│  Description...                            │
│  [ SHOP WOMEN → ]                          │
├─────────────────────────────────────────────┤
│         [HERO IMAGE 3]                     │
│  THIRD HEADLINE                            │
│  Description...                            │
│  [ SHOP MEN → ]                            │
├═════════════════════════════════════════════┤
│  BRAND TAGLINE (centered, uppercase)       │
├═════════════════════════════════════════════┤
│  My Account | Privacy | Support            │
└─────────────────────────────────────────────┘

## DISTINCTIVE FEATURES

### Member Status Bar
**Structure**: Level | Points Icon + Count + Label | Name + Profile Icon
**Layout**: Inline horizontal with borders (top and bottom 1px #C6C6C6)
**Styling**: Bold for level and points count, regular for labels

**Example**:
\`\`\`
LEVEL 2 | ★ 1551 Points to spend | JOHN DOE
\`\`\`

**Components**:
- **Level**: All caps, bold (e.g., "LEVEL 2", "PLATINUM", "VIP")
- **Points**: Icon + number (bold) + label (regular)
- **Name**: All caps, regular weight

### Repeating Pattern
**Structure**: Image → Headline → Description → CTA

**Repeat 3 times** with variations:
1. Overview/campaign intro
2. Women's collection
3. Men's collection

### Editorial Headlines
- **Font size**: 38px
- **Line height**: 38px (tight, 1:1 ratio)
- **Letter spacing**: 1px
- **Color**: Near-black (#111111)
- **Style**: All caps, bold statements
- **Length**: 2-6 words

**Examples**:
✅ "UNDENIABLY Y-3"
✅ "FASHION IS MUSIC, MUSIC IS FASHION"
✅ "A LOVE LETTER TO NEW YORK"
✅ "THE FUTURE OF SPORTSWEAR"
✅ "URBAN EVOLUTION"

### CTA Buttons with Icon
**Visual**:
- Background: Black (#111111)
- Text: White, 14px, bold, all caps, 2px letter-spacing
- Padding: 14px 20px
- Arrow icon on right (white, 16x16px)
- Layout: Text and icon in Row with Columns

**Text Examples**:
✅ "EXPLORE THE COLLECTION"
✅ "SHOP WOMEN"
✅ "SHOP MEN"
✅ "DISCOVER NOW"
✅ "VIEW LOOKBOOK"

## CONTENT GUIDELINES

### Pre-Header Links
- **Left link**: Campaign story/teaser (e.g., "2 Unique individuals - 1 iconic city")
- **Right link**: "View this email online"
- **Style**: Small (14px), gray (#767677), underlined

### Hero Images
- **Dimensions**: 600x426px (approximately 3:2 aspect ratio)
- **Style**: High-fashion editorial photography
- **Content**: Models in collection, urban settings, artistic shots
- **Mood**: Bold, confident, artistic
- **Alt text**: Descriptive with collection and setting

### Editorial Description
- **Length**: 1-2 paragraphs (30-60 words total)
- **Tone**: Artistic, confident, evocative
- **Structure**:
  - First paragraph: Campaign introduction or concept
  - Second paragraph: Additional context (photographer, location, inspiration)
- **Font**: 16px, line-height 22px

**Writing Style**:
- Use evocative language: "unveiling", "bold exploration", "defiant expression"
- Include artistic details: photographer name, location, creative direction
- Reference brand DNA and heritage
- Be concise but impactful

**Examples**:
✅ "Unveiling the incomparable A$AP Nast and the uncompromising Gabbriette as the faces of Y-3's Fall/Winter 2024 Campaign. Shot by legendary photographer Max Vadukul on the streets of New York City."

✅ "A bold exploration of daring contrasts and evocative juxtapositions. Captured through the lens of innovation and street culture, merging high fashion with athletic performance."

### Brand Tagline Section
- **Position**: Between last editorial section and footer
- **Border**: Top and bottom 1px #C6C6C6
- **Padding**: 13px bottom, 16px top
- **Text**: All caps, 14px, bold, 2px letter-spacing, centered
- **Content**: Brand heritage or philosophy
- **Example**: "STORIES, STYLES AND SPORTSWEAR AT ADIDAS, SINCE 1949"

### Footer Links
- **Layout**: Inline horizontal (table-cell)
- **Links**: My Account, Privacy Statement, Support
- **Spacing**: 16px between links (pl-4 class)
- **Style**: 14px, black, no underline
- **Alignment**: Left

## TYPOGRAPHY

### Font Setup
\`\`\`tsx
<Font
  fontFamily="Noto Sans"
  fallbackFontFamily="Helvetica"
  webFont={{
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap',
    format: 'woff2',
  }}
  fontWeight={400}
  fontStyle="normal"
/>
\`\`\`

### Text Hierarchy
- **Main headlines**: 38px, line-height 38px, tracking 1px, all caps
- **Body text**: 16px, line-height 22px, regular
- **CTA text**: 14px, bold, all caps, tracking 2px
- **Pre-header**: 14px, regular, gray
- **Member bar**: 16px, bold (level/points), regular (labels)
- **Brand tagline**: 14px, bold, all caps, tracking 2px
- **Footer links**: 14px, regular

## TAILWIND CLASSES

Key patterns used:

### Layout
- \`mx-auto\` = center horizontally
- \`table-cell\` = inline horizontal layout
- \`w-0\` = minimal width (for inline layouts)
- \`whitespace-nowrap\` = prevent text wrapping

### Spacing
- \`my-1\` = margin vertical 4px
- \`my-6\` = margin vertical 24px
- \`my-10\` = margin vertical 40px
- \`mt-10\` = margin top 40px
- \`mt-11\` = margin top 44px
- \`pl-3\`, \`pl-4\`, \`pl-6\` = padding left (12px, 16px, 24px)
- \`pb-[13px]\`, \`pt-4\` = padding bottom 13px, top 16px
- \`px-5\`, \`py-[14px]\` = padding horizontal 20px, vertical 14px

### Colors
- \`bg-white\` = white background
- \`bg-[#111111]\` = black background (CTA)
- \`text-black\` = black text
- \`text-[#111111]\` = near-black text
- \`text-[#767677]\` = gray text (pre-header)
- \`text-white\` = white text (CTA)
- \`border-[#C6C6C6]\` = gray border

### Typography
- \`text-sm\` = 14px
- \`text-base\` = 16px
- \`text-[38px]\` = 38px (headlines)
- \`font-bold\` = bold weight
- \`uppercase\` = all caps
- \`tracking-[1px]\` / \`tracking-[2px]\` = letter spacing
- \`leading-[22px]\` / \`leading-[38px]\` = line height
- \`no-underline\` = remove underline
- \`underline\` = add underline

### Borders
- \`border-b\` = bottom border
- \`border-t\` = top border
- \`border-solid\` = solid border style

## TONE AND VOICE

**Overall Tone:** Bold, confident, artistic, editorial

**Do:**
- Use evocative, artistic language
- Reference photographers, locations, creative direction
- Speak to brand DNA and heritage
- Be concise but impactful
- Use all-caps headlines for drama
- Include cultural references (music, art, cities)
- Show confidence without arrogance

**Don't:**
- Be overly wordy or flowery
- Use generic marketing language
- Skip the artistic context
- Forget the brand story
- Be too salesy or transactional
- Use exclamation points

## MEMBER STATUS BAR VARIATIONS

### VIP/Loyalty Tiers
- **LEVEL 1**: Entry tier
- **LEVEL 2**: Mid tier
- **LEVEL 3**: High tier
- **PLATINUM**: Premium tier
- **VIP**: Top tier

### Points Display
Format: [Icon] [Number] [Label]
- "★ 1551 Points to spend"
- "💎 2500 Rewards points"
- "🎯 850 Credits available"

### Profile Display
Format: [Name]
- "JOHN DOE"
- All caps for name consistency

## CAMPAIGN HEADLINE FORMULAS

### Statement Headlines
- "[Brand Attribute] [Product/Collection]"
- Examples: "UNDENIABLY Y-3", "PURELY ATHLETIC", "DEFINITIVELY MODERN"

### Philosophical Headlines
- "[Concept] IS [Concept], [Concept] IS [Concept]"
- Examples: "FASHION IS MUSIC, MUSIC IS FASHION", "SPORT IS LIFE, LIFE IS SPORT"

### Location-Based Headlines
- "A [EMOTION] LETTER TO [PLACE]"
- Examples: "A LOVE LETTER TO NEW YORK", "AN ODE TO TOKYO", "A TRIBUTE TO LONDON"

### Evolution Headlines
- "THE [DESCRIPTOR] OF [CATEGORY]"
- Examples: "THE FUTURE OF SPORTSWEAR", "THE EVOLUTION OF STYLE", "THE NEXT CHAPTER"

## ANTI-PATTERNS

❌ **Don't use small images** - Hero images must be impactful (600x426px minimum)
❌ **Don't crowd with text** - Editorial style needs breathing room
❌ **Don't skip member status** - Loyalty integration is key
❌ **Don't use colored CTAs** - Black buttons are signature
❌ **Don't forget arrow icons** - CTAs need directional arrows
❌ **Don't use lowercase headlines** - All caps for impact
❌ **Don't skip photographer credit** - Artistic context matters
❌ **Don't mix fonts** - Stick to Noto Sans throughout

## EXAMPLE CONTENT SETS

### Fall/Winter Campaign
- Pre-header: "Urban evolution meets athletic performance"
- Headline 1: "THE NEW UNIFORM"
- Headline 2: "REDEFINING ELEGANCE"
- Headline 3: "WINTER ESSENTIALS REIMAGINED"
- Tagline: "INNOVATION IN MOTION SINCE 1949"

### Collaboration Launch
- Pre-header: "Two visionaries - One groundbreaking collection"
- Headline 1: "WHEN FASHION MEETS INNOVATION"
- Headline 2: "EXPLORE THE COLLABORATION"
- Headline 3: "LIMITED EDITION EXCLUSIVES"
- Tagline: "PUSHING BOUNDARIES, BREAKING RULES"

### Spring/Summer Campaign
- Pre-header: "Light meets movement in our latest collection"
- Headline 1: "SUMMER STATE OF MIND"
- Headline 2: "BREATHE INNOVATION"
- Headline 3: "PERFORMANCE ELEVATED"
- Tagline: "WHERE SPORT BECOMES ART"

---

**Follow the example email structure exactly, including the member status bar, repeating image-headline-CTA pattern (3x), and bold editorial typography with all-caps headlines.**`,
};

export default FashionCampaignDesignSystem;

