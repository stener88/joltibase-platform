/**
 * DESTINATION CONTENT EMAIL DESIGN SYSTEM
 * Based on Skyscanner's destination highlight template
 *
 * Use cases:
 * - Destination guides and highlights
 * - Travel content marketing
 * - Location-specific recommendations
 * - Tourism board campaigns
 * - Travel inspiration emails
 * - Activity and attraction highlights
 * - Seasonal travel suggestions
 * - Regional content series
 */

import type { DesignSystem } from '../lib/design-system-selector';

// Simple icon placeholders for email compatibility (short URLs for AI)
const ICONS = {
  // Travel icons - Blue
  flights: 'https://via.placeholder.com/24x20/0062e3/ffffff?text=F',
  hotel: 'https://via.placeholder.com/24x20/0062e3/ffffff?text=H',
  car: 'https://via.placeholder.com/24x20/0062e3/ffffff?text=C',
  
  // Activity icons - Blue  
  mountain: 'https://via.placeholder.com/19x19/0062e3/ffffff?text=M',
  island: 'https://via.placeholder.com/19x19/0062e3/ffffff?text=I',
  dining: 'https://via.placeholder.com/19x19/0062e3/ffffff?text=D',
  
  // Arrow - Gray
  arrow: 'https://via.placeholder.com/6x10/666666/ffffff?text=>',
  
  // Footer icons - White
  flightsWhite: 'https://via.placeholder.com/24x16/ffffff/05203C?text=F',
  hotelWhite: 'https://via.placeholder.com/24x16/ffffff/05203C?text=H',
  carWhite: 'https://via.placeholder.com/24x16/ffffff/05203C?text=C',
  
  // Logos
  logo: 'https://via.placeholder.com/170x44/0062e3/ffffff?text=Logo',
  logoWhite: 'https://via.placeholder.com/142x25/ffffff/05203C?text=Logo',
};

export const DestinationContentDesignSystem: DesignSystem = {
  id: 'destination-content',
  name: 'Destination Content & Guides',
  description:
    "Editorial travel content email with large blue headline, icon-based activity list, two-column tips layout, and three-card planning section. Features rounded imagery and dark navy footer. Perfect for destination highlights and travel inspiration.",

  // KEYWORD TRIGGERS
  triggers: [
    'destination',
    'travel guide',
    'featured',
    'explore',
    'visit',
    'discover',
    'things to do',
    'attractions',
    'activities',
    'travel tips',
    'where to go',
    'best places',
    'highlights',
    'city guide',
    'country guide',
    'travel inspiration',
    'vacation ideas',
    'tourist spots',
    'local experiences',
    'must see',
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['destination', 'landscape', 'scenic', 'aerial view', 'landmark'],
    feature: ['attraction', 'activity', 'beach', 'city', 'architecture'],
    product: ['hotel', 'resort', 'accommodation', 'travel'],
    background: ['travel', 'tourism', 'vacation', 'scenic'],
    people: ['tourist', 'traveler', 'vacation', 'exploring'],
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
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
import * as React from 'react'

export const DestinationContentEmail = () => {
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
      </Head>
      <Preview>Featured Crete - Your complete guide to Greece's largest island</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#F1F2F8] font-sans text-black antialiased">
          <Container className="mx-auto max-w-[660px] bg-white">
            
            {/* Top Navigation */}
            <Section className="px-6 pb-8 pt-4">
              <Row className="table-cell w-[33%]">
                <Column>
                  <Img
                    src="${ICONS.flights}"
                    className="h-[20px] w-[24px]"
                    alt="Flights icon"
                  />
                </Column>
                <Column align="left">
                  <Link className="text-[#05203c] no-underline" href="https://example.com/flights">
                    Flights
                  </Link>
                </Column>
              </Row>
              <Row className="table-cell w-[33%]">
                <Column>
                  <Img
                    src="${ICONS.hotel}"
                    className="h-[20px] w-[24px]"
                    alt="Hotels icon"
                  />
                </Column>
                <Column align="left">
                  <Link className="text-[#05203c] no-underline" href="https://example.com/hotels">
                    Hotels
                  </Link>
                </Column>
              </Row>
              <Row className="table-cell w-[33%]">
                <Column>
                  <Img
                    src="${ICONS.car}"
                    className="h-[20px] w-[24px]"
                    alt="Car rental icon"
                  />
                </Column>
                <Column align="left">
                  <Link className="text-[#05203c] no-underline" href="https://example.com/cars">
                    Rent a car
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Logo */}
            <Section className="mt-2 px-6">
              <Row>
                <Img
                  src="${ICONS.logo}"
                  className="h-[44px] w-[170px] object-cover"
                  alt="Company Logo"
                />
              </Row>
            </Section>

            {/* Main Headline - Large Blue 64px */}
            <Section className="mt-6 px-6">
              <Row>
                <Text className="text-[64px] font-bold leading-[64px] tracking-tight text-[#0362E3]">
                  Featured Crete
                </Text>
              </Row>
            </Section>

            {/* Hero Image + Content Card */}
            <Section className="mt-8 px-6">
              <Row>
                <Img
                  src="https://images.unsplash.com/photo-1565967511849-76a60a516170?w=660&h=268&fit=crop"
                  className="h-[268px] w-full rounded-t-xl"
                  alt="Aerial view of Crete's stunning coastline with turquoise waters and beaches"
                />
              </Row>
              <Section className="rounded-b-xl border border-solid border-gray-200 p-[30px]">
                {/* Destination Introduction */}
                <Row>
                  <Text className="m-0 text-base leading-5 text-[#545860]">
                    Crete, the largest of the Greek islands, has been a major
                    tourist destination thanks to its idyllic beaches, history,
                    coastal villages and charming ancient cities, not to mention
                    water sports, sailing, gastronomy and much more.
                  </Text>
                  <Text className="m-0 mt-4 text-base leading-5 text-[#545860]">
                    As there is so much to do, we have selected just a few
                    activities and adventures from the many that this lively and
                    fascinating island has to offer.
                  </Text>
                </Row>

                {/* Activity 1 - Icon + Title + Description */}
                <Row className="mt-8">
                  <Column className="align-baseline">
                    <Img
                      src="${ICONS.mountain}"
                      width="19"
                      height="19"
                      className="mt-1 pr-2"
                      alt="Mountain icon"
                    />
                  </Column>
                  <Column className="w-[95%]">
                    <Text className="m-0 text-xl font-bold text-gray-900">
                      Samaria Gorge Tour
                    </Text>
                    <Text className="m-0 mt-2 text-base leading-5 text-[#545860]">
                      Hike in the shadow of the White Mountains of Crete in the
                      Samaria Gorge National Park. Walk trails, take a dive in
                      its crystal-clear waters and relax in traditional mountain
                      villages.
                    </Text>
                  </Column>
                </Row>

                {/* Activity 2 */}
                <Row className="mt-6">
                  <Column className="align-baseline">
                    <Img
                      src="${ICONS.island}"
                      width="19"
                      height="19"
                      className="mt-1 pr-2"
                      alt="Island icon"
                    />
                  </Column>
                  <Column className="w-[95%]">
                    <Text className="m-0 text-xl font-bold text-gray-900">
                      Visit the abandoned island of Spinalonga
                    </Text>
                    <Text className="m-0 mt-2 text-base leading-5 text-[#545860]">
                      A boat will take you from Agios Nikolaos to this small
                      island steeped in history, from the Arab raids, the
                      Venetian conquest and the Ottoman occupation to its last
                      use as a leper colony that ended in 1957.
                    </Text>
                  </Column>
                </Row>

                {/* Activity 3 */}
                <Row className="mt-6">
                  <Column className="align-baseline">
                    <Img
                      src="${ICONS.dining}"
                      width="19"
                      height="19"
                      className="mt-1 pr-2"
                      alt="Cooking icon"
                    />
                  </Column>
                  <Column className="w-[95%]">
                    <Text className="m-0 text-xl font-bold text-[#161616]">
                      Learn to cook Cretan style
                    </Text>
                    <Text className="m-0 mt-2 text-base leading-5 text-[#545860]">
                      Would you like to learn Cretan cuisine? There are many
                      courses available! Take advantage of the entire day and
                      shop for fresh ingredients to prepare a delicious
                      farm-to-table feast.
                    </Text>
                  </Column>
                </Row>

                {/* Primary CTA */}
                <Row>
                  <Button
                    href="https://example.com/flights/crete"
                    className="mt-6 block max-w-full rounded-lg bg-[#05203C] py-[11px] text-center text-lg font-bold leading-[18px] text-white"
                  >
                    Find flights
                  </Button>
                </Row>
              </Section>
            </Section>

            {/* Travel Tips Section */}
            <Section className="mt-14 px-6">
              <Row>
                <Text className="m-0 text-[30px] font-bold text-[#161616]">
                  Find out before
                </Text>
              </Row>

              {/* Two-Column Tips Layout */}
              <Row className="mt-6">
                <Column colSpan={1} className="w-[50%] pr-2">
                  <Img
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&h=310&fit=crop"
                    className="w-full rounded-lg object-cover"
                    height="310"
                    alt="Beautiful September beach scene in Crete"
                  />
                  <Text className="m-0 mt-6 text-xl font-bold leading-6 text-[#161616]">
                    Visit in September
                  </Text>
                  <Text className="mb-0 mt-2 text-base leading-5 text-[#6B7280]">
                    If you want sun, warm seas and few people, go to Crete in
                    September. There are still long, warm days, but with cheaper
                    prices at many hotels and less competition for Crete's most
                    popular attractions.
                  </Text>
                  <Link
                    href="https://example.com/flights/crete/september"
                    className="m-0 mt-1 text-base font-bold text-[#0062e3]"
                  >
                    Find flights
                  </Link>
                </Column>
                <Column colSpan={1} className="w-[50%] pl-2">
                  <Img
                    src="https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=300&h=310&fit=crop"
                    className="w-full rounded-lg object-cover"
                    height="310"
                    alt="Picturesque Chania harbor with Venetian buildings"
                  />
                  <Text className="m-0 mt-6 text-xl font-bold leading-6 text-[#161616]">
                    Stay in Chania
                  </Text>
                  <Text className="mb-0 mt-2 text-base leading-5 text-[#6B7280]">
                    If you are looking for the best beaches, the west coast is a
                    great option. One of the main cities is Chania, which in
                    addition to a beach, has a Venetian port, beautiful
                    buildings and plenty of bars and restaurants.
                  </Text>
                  <Link
                    href="https://example.com/hotels/chania"
                    className="m-0 mt-1 text-base font-bold text-[#0062e3]"
                  >
                    Find flights
                  </Link>
                </Column>
              </Row>

              {/* Full-Width Tip */}
              <Row>
                <Img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=660&h=265&fit=crop"
                  className="mt-8 w-full rounded-lg object-cover"
                  height="265"
                  alt="Scenic coastal road perfect for driving in Crete"
                />
                <Text className="m-0 mt-6 text-xl font-bold leading-6 text-[#161616]">
                  Travel tip: rent a car
                </Text>
                <Text className="mb-0 mt-2 text-base leading-5 text-[#6B7280]">
                  If you don't mind driving, it's a good idea to rent a car, at
                  least for part of your stay. This way you will make the most
                  of your time, because in Crete there are many things to see
                  and they are quite dispersed.
                </Text>
              </Row>
            </Section>

            {/* Horizontal Rule Divider */}
            <Hr className="mt-8 w-full border-[#e6e4eb]" />

            {/* Plan Your Trip Section */}
            <Section className="mt-8 px-6">
              <Row>
                <Text className="m-0 text-[30px] font-bold text-[#161616]">
                  Plan your trip
                </Text>
              </Row>

              {/* Three-Card Layout */}
              <Section className="mt-8">
                <Row>
                  <Column className="w-[33%] pr-2">
                    <Section className="rounded-xl border border-solid border-[#dddddd] p-4">
                      <Row>
                        <Img
                          src="${ICONS.flights}"
                          className="h-[40px] w-[40px]"
                          alt="Flights icon"
                        />
                      </Row>
                      <Row className="mt-7">
                        <Column>
                          <Link
                            href="https://example.com/flights"
                            className="m-0 text-base font-bold leading-5 text-[#161616]"
                          >
                            Flights
                          </Link>
                        </Column>
                        <Column align="right">
                          <Img
                            src="${ICONS.arrow}"
                            className="h-[10px] w-[6px]"
                            alt="Arrow"
                          />
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                  <Column className="w-[33%] px-2">
                    <Section className="rounded-xl border border-solid border-[#dddddd] p-4">
                      <Row>
                        <Img
                          src="${ICONS.hotel}"
                          className="h-[40px] w-[40px]"
                          alt="Hotels icon"
                        />
                      </Row>
                      <Row className="mt-7">
                        <Column>
                          <Link
                            href="https://example.com/hotels"
                            className="m-0 text-base font-bold leading-5 text-[#161616]"
                          >
                            Hotels
                          </Link>
                        </Column>
                        <Column align="right">
                          <Img
                            src="${ICONS.arrow}"
                            className="h-[10px] w-[6px]"
                            alt="Arrow"
                          />
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                  <Column className="w-[33%] pl-2">
                    <Section className="rounded-xl border border-solid border-[#dddddd] p-4">
                      <Row>
                        <Img
                          src="${ICONS.car}"
                          className="h-[40px] w-[40px]"
                          alt="Car rental icon"
                        />
                      </Row>
                      <Row className="mt-7">
                        <Column>
                          <Link
                            href="https://example.com/cars"
                            className="m-0 text-base font-bold leading-5 text-[#161616]"
                          >
                            Rent a car
                          </Link>
                        </Column>
                        <Column align="right">
                          <Img
                            src="${ICONS.arrow}"
                            className="h-[10px] w-[6px]"
                            alt="Arrow"
                          />
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Dark Footer */}
            <Section className="mt-[50px] bg-[#05203C] p-6">
              {/* Footer Navigation */}
              <Section className="pt-4">
                <Row className="table-cell w-[33%]">
                  <Column>
                    <Img
                      src="${ICONS.flightsWhite}"
                      className="h-[16px] w-[24px]"
                      alt="Flights icon"
                    />
                  </Column>
                  <Column align="left">
                    <Link className="text-white no-underline" href="https://example.com/flights">
                      Flights
                    </Link>
                  </Column>
                </Row>
                <Row className="table-cell w-[33%]">
                  <Column>
                    <Img
                      src="${ICONS.hotelWhite}"
                      className="h-[16px] w-[24px]"
                      alt="Hotels icon"
                    />
                  </Column>
                  <Column align="left">
                    <Link className="text-white no-underline" href="https://example.com/hotels">
                      Hotels
                    </Link>
                  </Column>
                </Row>
                <Row className="table-cell w-[33%]">
                  <Column>
                    <Img
                      src="${ICONS.carWhite}"
                      className="h-[16px] w-[24px]"
                      alt="Car rental icon"
                    />
                  </Column>
                  <Column align="left">
                    <Link className="text-white no-underline" href="https://example.com/cars">
                      Rent a car
                    </Link>
                  </Column>
                </Row>
              </Section>

              {/* Footer Text */}
              <Section>
                <Row>
                  <Text className="text-xs leading-4 text-white">
                    Based on your activity, we configured the Buenos Aires
                    Ministerio Pistarini airport as your airport of origin.{' '}
                    <Link href="https://example.com/change-airport" className="font-bold text-white underline">
                      Change your origin airport here.
                    </Link>
                  </Text>
                  <Text className="text-xs leading-4 text-white">
                    Registered office: Skyscanner Limited, Level 5, Ilona Rose
                    House, Manette Street, London W1D 4AL, United Kingdom. Tax
                    Identification Code (UK): 04217916; Tax identification
                    number: GB 208148618
                  </Text>
                  <Text className="text-xs leading-4 text-white">
                    <Link href="https://example.com/unsubscribe" className="font-bold text-white underline">
                      Delete subscription
                    </Link>{' '}
                    |{' '}
                    <Link href="https://example.com/preferences" className="font-bold text-white underline">
                      Edit my preferences
                    </Link>{' '}
                    |{' '}
                    <Link href="https://example.com/privacy" className="font-bold text-white underline">
                      Privacy policy
                    </Link>{' '}
                    |{' '}
                    <Link href="https://example.com/contact" className="font-bold text-white underline">
                      Contact us
                    </Link>
                  </Text>
                </Row>

                {/* Footer Logo */}
                <Row className="mt-8">
                  <Column align="right">
                    <Img
                      src="${ICONS.logoWhite}"
                      className="h-[25px] w-[142px]"
                      alt="Company Logo"
                    />
                  </Column>
                </Row>
              </Section>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default DestinationContentEmail`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# DESTINATION CONTENT EMAIL DESIGN SYSTEM

You are generating content for a destination highlight email using a proven Skyscanner-inspired editorial travel template.

## VISUAL AESTHETIC

**Style:** Editorial, informative, travel-focused, clean
**Mood:** Inspiring, helpful, informative, inviting
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Bright blue (#0362E3, #0062e3) for headline and links
- Dark navy: (#05203C) for buttons and footer background
- Text: Charcoal (#161616) for headlines, medium gray (#545860, #6B7280) for body
- Background: Very light gray (#F1F2F8) for page, white for content
- Borders: Light gray (#dddddd, #e6e4eb, gray-200)

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐ Light gray page
│ ✈ Flights | 🏨 Hotels | 🚗 Rent a car      │ ← Icon nav
│                                             │
│ [LOGO]                                      │
│                                             │
│ Featured Crete (64px blue)                 │ ← Large headline
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │   [HERO IMAGE - rounded top]            │ │
│ ├─────────────────────────────────────────┤ │
│ │ Introduction paragraphs...              │ │
│ │                                           │ │
│ │ ⛰ Activity Title                        │ │ Icon list
│ │   Description...                         │ │
│ │                                           │ │
│ │ 🏝 Activity Title                        │ │
│ │   Description...                         │ │
│ │                                           │ │
│ │ [ Find flights ]                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Find out before (30px)                     │
│ ┌──────────┐ ┌──────────┐                 │ Two-column
│ │ [Image]  │ │ [Image]  │                 │ tips layout
│ │ Title    │ │ Title    │                 │
│ │ Text...  │ │ Text...  │                 │
│ └──────────┘ └──────────┘                 │
│ ┌─────────────────────────────────────────┐ │
│ │ [Full-width image]                      │ │ Full-width tip
│ │ Title                                   │ │
│ └─────────────────────────────────────────┘ │
│ ─────────────────────────────────────────── │ HR divider
│                                             │
│ Plan your trip (30px)                      │
│ ┌─────┐ ┌─────┐ ┌─────┐                  │ Three-card
│ │ ✈   │ │ 🏨  │ │ 🚗  │                  │ layout
│ │Flig→│ │Hot→ │ │Car→ │                  │
│ └─────┘ └─────┘ └─────┘                  │
│                                             │
│ ╔═══════════════════════════════════════╗ │ Dark footer
│ ║ ✈ Flights | 🏨 Hotels | 🚗 Cars      ║ │
│ ║ Airport notice...                      ║ │
│ ║ Legal text...                          ║ │
│ ║ Links | Links | Links                  ║ │
│ ║                          [LOGO] ═══════║ │
│ ╚═══════════════════════════════════════╝ │
└─────────────────────────────────────────────┘

## DISTINCTIVE FEATURES

### Icon + Text Navigation (Header & Footer)
**Structure**: Icon | Text | Icon | Text | Icon | Text
**Layout**: Inline horizontal using table-cell, equal width columns (33% each)

**Header version**:
- Icon: 24x20px, color accent
- Text: Link, dark navy (#05203C), no underline
- Background: White
- Spacing: Compact

**Footer version**:
- Icon: 24x16px, white
- Text: Link, white, no underline
- Background: Dark navy (#05203C)
- Spacing: Compact

**Navigation items**: Flights, Hotels, Rent a car (consistent across header/footer)

### Large Blue Headline (64px)
**Visual**:
- Font size: 64px
- Line height: 64px (1:1 ratio)
- Font weight: Bold
- Color: Bright blue (#0362E3)
- Letter spacing: Tight (tracking-tight)
- Format: "Featured [Destination]"

**Examples**:
✅ "Featured Crete"
✅ "Featured Bali"
✅ "Discover Iceland"
✅ "Explore Tokyo"

This is the signature element of the template - massive, bold, blue.

### Hero Image + Content Card Pattern
**Hero image**:
- Dimensions: Full width, ~268px height
- Border radius: rounded-t-xl (top corners only)
- Content: Scenic destination photo

**Content card** (connected below image):
- Border: 1px solid gray-200
- Border radius: rounded-b-xl (bottom corners only)
- Padding: 30px
- Background: White
- Contains: Introduction + Activities + CTA

This creates a unified card with image on top, content below.

### Icon-Based Activity List
**Structure**: Icon (left) + Title + Description (right)

**Layout**:
- Icon: 19x19px, positioned at baseline, pr-2
- Content column: w-[95%]
- Spacing between items: mt-6 (24px)

**Title**:
- Font: 20px (text-xl), bold
- Color: Charcoal (#161616) or gray-900
- Examples: "Samaria Gorge Tour", "Visit the abandoned island"

**Description**:
- Font: 16px (text-base), line-height 20px
- Color: Medium gray (#545860)
- Length: 2-3 sentences

**Icon selection**: Match activity type (mountain, island, food, etc.)

### Two-Column Tips Layout
**Structure**: 50/50 split with padding

**Left column**: w-[50%] pr-2
**Right column**: w-[50%] pl-2

**Each tip includes**:
1. Image: Full width, 310px height, rounded-lg
2. Title: 20px (text-xl), bold, mt-6
3. Description: 16px, gray (#6B7280), mt-2
4. Link: 16px, bold, blue (#0062e3), mt-1

**Full-width tip** (third tip):
- Image: Full width, 265px height, rounded-lg, mt-8
- Same title/description format
- No link (optional)

### Three-Card Planning Section
**Structure**: Three equal cards (33% width each)

**Card specs**:
- Border: 1px solid #dddddd
- Border radius: rounded-xl
- Padding: 16px (p-4)
- Background: White

**Card content**:
1. Icon: 40x40px (top)
2. Title + Arrow: Text-base, bold (bottom, mt-7)
   - Title on left
   - Small arrow icon (6x10px) on right

**Cards**: Flights, Hotels, Rent a car (with respective icons)

### Dark Footer Section
**Background**: Dark navy (#05203C)
**Padding**: 24px (p-6)
**Text color**: White

**Contains**:
1. Navigation (icon + text)
2. Airport personalization notice
3. Company legal information
4. Footer links (pipe-separated)
5. Logo (bottom right)

All text is white, all links are bold + underlined.

## CONTENT GUIDELINES

### Main Headline
**Format**: "Featured [Destination]" or "Discover [Destination]"

**Keep it simple**:
✅ "Featured Crete"
✅ "Discover Bali"
✅ "Explore Tokyo"
✅ "Visit Iceland"
❌ "Your Ultimate Guide to Crete" (too wordy)

### Destination Introduction
- **Length**: 2 paragraphs (80-120 words total)
- **Paragraph 1**: What makes destination special, key attractions
- **Paragraph 2**: What you'll find in this guide

**Example**:
"Crete, the largest of the Greek islands, has been a major tourist destination thanks to its idyllic beaches, history, coastal villages and charming ancient cities, not to mention water sports, sailing, gastronomy and much more.

As there is so much to do, we have selected just a few activities and adventures from the many that this lively and fascinating island has to offer."

### Activity Titles
- **Length**: 3-8 words
- **Format**: Action-oriented or descriptive
- **Examples**:
  ✅ "Samaria Gorge Tour"
  ✅ "Visit the abandoned island of Spinalonga"
  ✅ "Learn to cook Cretan style"
  ✅ "Explore ancient ruins"
  ✅ "Sunset sailing adventure"

### Activity Descriptions
- **Length**: 2-3 sentences (40-60 words)
- **Content**: What to do, what to see, why it's special
- **Tone**: Informative but exciting

**Example**:
"Hike in the shadow of the White Mountains of Crete in the Samaria Gorge National Park. Walk trails, take a dive in its crystal-clear waters and relax in traditional mountain villages."

### Travel Tip Titles
- **Format**: Short, practical, specific
- **Examples**:
  ✅ "Visit in September"
  ✅ "Stay in Chania"
  ✅ "Travel tip: rent a car"
  ✅ "Best time to visit"
  ✅ "Where to stay"

### Travel Tip Descriptions
- **Length**: 2-4 sentences (50-80 words)
- **Content**: Practical advice, reasons, benefits
- **Tone**: Helpful, specific

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
- **Main headline**: 64px, line-height 64px, bold, blue (#0362E3)
- **Section headers**: 30px (text-[30px]), bold, charcoal (#161616)
- **Activity titles**: 20px (text-xl), bold, charcoal/gray-900
- **Tip titles**: 20px (text-xl), bold, charcoal (#161616), line-height 24px
- **Body text**: 16px (text-base), line-height 20px, medium gray (#545860, #6B7280)
- **Links**: 16px (text-base), bold, blue (#0062e3)
- **Footer text**: 12px (text-xs), line-height 16px, white

## TAILWIND CLASSES

Key patterns:

### Rounded Corners
- \`rounded-t-xl\` = top corners rounded (hero image)
- \`rounded-b-xl\` = bottom corners rounded (content card)
- \`rounded-lg\` = all corners (tips images)
- \`rounded-xl\` = all corners, more rounded (planning cards)

### Layout
- \`table-cell\` = inline horizontal layout
- \`w-[33%]\`, \`w-[50%]\`, \`w-[95%]\` = specific widths
- \`pr-2\`, \`pl-2\`, \`px-2\` = padding right/left/horizontal (8px)
- \`align-baseline\` = vertical alignment for icons

### Spacing
- \`mt-2\`, \`mt-6\`, \`mt-7\`, \`mt-8\`, \`mt-14\` = margin top (8px, 24px, 28px, 32px, 56px)
- \`px-6\` = padding horizontal 24px (main content)
- \`pb-8\`, \`pt-4\` = padding bottom/top
- \`p-4\` = padding 16px all sides
- \`p-[30px]\` = padding 30px all sides

### Colors
- \`bg-[#F1F2F8]\` = page background
- \`bg-white\` = content background
- \`bg-[#05203C]\` = dark navy (buttons, footer)
- \`text-[#0362E3]\` = bright blue (headline)
- \`text-[#0062e3]\` = blue (links)
- \`text-[#161616]\` = charcoal (titles)
- \`text-[#545860]\`, \`text-[#6B7280]\` = medium gray (body text)
- \`border-gray-200\`, \`border-[#dddddd]\`, \`border-[#e6e4eb]\` = border colors

## TONE AND VOICE

**Overall Tone:** Informative, inspiring, helpful, inviting

**Do:**
- Be specific about locations and activities
- Include practical details (timing, what to bring, difficulty)
- Use vivid, descriptive language
- Focus on unique experiences
- Provide actionable tips
- Be enthusiastic but not over-the-top
- Include local context and history

**Don't:**
- Be vague or generic
- Oversell or exaggerate
- Use too many superlatives
- Forget practical information
- Make it all about booking
- Use overly flowery language
- Skip the "why" (why visit, why this activity)

## CONTENT STRUCTURE BEST PRACTICES

### Number of Activities
**Include 3-5 activities**:
- Variety: Mix outdoor, cultural, culinary
- Different interests: Adventure, relaxation, culture
- Different price points: Free/low-cost and premium

### Travel Tips Structure
**Include 3 tips**:
1. **When to go**: Timing, season, weather
2. **Where to stay**: Best neighborhoods/areas
3. **Transportation**: Getting around, logistics

**Format**:
- Tips 1 & 2: Two-column layout (50/50)
- Tip 3: Full-width layout

### Planning Cards
**Always include**: Flights, Hotels, Rent a car
These are the core travel booking categories.

## ANTI-PATTERNS

❌ **Don't use small headline** - 64px blue headline is signature
❌ **Don't separate image from card** - They should be visually connected
❌ **Don't skip activity icons** - Icons add visual interest and category identification
❌ **Don't forget two-column tips** - Layout variety is important
❌ **Don't use light footer** - Dark navy footer is signature
❌ **Don't skip icon navigation** - Appears in both header and footer
❌ **Don't forget rounded corners** - Consistent rounded-xl, rounded-lg
❌ **Don't use multiple CTAs** - One primary CTA in main card

## EXAMPLE CONTENT SETS

### Beach Destination (Thailand)
- Headline: "Featured Phuket"
- Activities: Island hopping tour, Thai cooking class, Wat Chalong temple
- Tips: Visit in November, Stay in Kata Beach, Rent a scooter
- Planning: Flights, Hotels, Rent a car

### City Destination (Barcelona)
- Headline: "Discover Barcelona"
- Activities: Sagrada Familia tour, Gothic Quarter walk, Tapas tasting
- Tips: Visit in May, Stay in Eixample, Get a T-Casual pass
- Planning: Flights, Hotels, Rent a car

### Nature Destination (Iceland)
- Headline: "Explore Iceland"
- Activities: Golden Circle tour, Blue Lagoon, Northern Lights hunt
- Tips: Visit in September, Stay in Reykjavik, Rent a 4x4
- Planning: Flights, Hotels, Rent a car

### Cultural Destination (Kyoto)
- Headline: "Featured Kyoto"
- Activities: Fushimi Inari shrine, Tea ceremony, Bamboo grove walk
- Tips: Visit in April, Stay in Gion, Buy a bus pass
- Planning: Flights, Hotels, Rent a car

---

**Follow the example email structure exactly, including the 64px blue headline, icon-based activity list, two-column tips layout with full-width third tip, three-card planning section, and dark navy footer with icon navigation.**`,
};

export default DestinationContentDesignSystem;

