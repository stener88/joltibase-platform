/**
 * TRAVEL & BOOKING EMAIL DESIGN SYSTEM
 * Based on TripAdvisor's destination-focused email template
 * 
 * Use cases:
 * - Destination inspiration emails
 * - Booking confirmations
 * - Travel planning guides
 * - Seasonal travel promotions
 * - Activity recommendations
 */

export const TravelBookingDesignSystem = {
  id: 'travel-booking',
  name: 'Travel & Booking',
  description: 'Destination-focused email template with hero imagery, featured destinations, and booking CTAs. Perfect for travel platforms, booking sites, and tourism brands.',

  // KEYWORD TRIGGERS
  triggers: [
    'travel',
    'trip',
    'destination',
    'booking',
    'hotel',
    'flight',
    'vacation',
    'explore',
    'visit',
    'reserve',
    'things to do',
    'restaurant',
    'itinerary',
    'tourism',
    'getaway',
    'adventure',
    'plan your trip',
    'discover',
    'experience',
    'activities',
    'cruise',
    'resort',
    'tour'
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['destination', 'travel', 'landmark', 'cityscape', 'scenic'],
    feature: ['activity', 'experience', 'restaurant', 'adventure', 'tourism'],
    product: ['hotel', 'resort', 'accommodation', 'booking', 'room'],
    background: ['passport', 'map', 'luggage', 'plane', 'airport'],
    people: ['tourist', 'traveler', 'vacation', 'family', 'couple']
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
  exampleEmail: `import React from 'react'
import { Body, Button, Column, Container, Head, Html, Img, Link, Preview, Row, Section, Text, Heading } from '@react-email/components'

export default function TravelBookingEmail() {
  return (
    <Html>
      <Head />
      <Preview>Discover the best destinations for your next adventure</Preview>
      <Body style={{ backgroundColor: "#ffffff" }}>
        <Container style={{ maxWidth: "600px", backgroundColor: "#ffffff" }}>
          
          {/* Logo Header */}
          <Section style={{ padding: "16px 32px 16px 32px", backgroundColor: "#ffffff" }}>
            <Row>
              <Column align="left" style={{ width: "100%", paddingLeft: "0", paddingRight: "0", verticalAlign: "top" }}>
                <Section>
                  <Row>
                    <Column align="center">
                      <Link href="https://example.com">
                        <Img 
                          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=220&h=56&fit=crop" 
                          style={{ width: "220px", height: "56px" }} 
                          alt="TravelCo Logo"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Navigation Menu */}
          <Section style={{ padding: "16px 0px 16px 0px", margin: "16px 0 16px 0" }}>
            <Row>
              <Column align="center">
                <Row style={{ display: "table-cell" }}>
                  <Column style={{ paddingRight: "72px" }}>
                    <Link href="https://example.com/hotels">
                      <Text style={{ color: "#002b11", fontWeight: "bold" }}>
                        Hotels
                      </Text>
                    </Link>
                  </Column>
                  <Column style={{ paddingRight: "72px" }}>
                    <Link href="https://example.com/activities">
                      <Text style={{ color: "#002b11", fontWeight: "bold" }}>
                        Things to do
                      </Text>
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://example.com/restaurants">
                      <Text style={{ color: "#002b11", fontWeight: "bold" }}>
                        Restaurants
                      </Text>
                    </Link>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>

          {/* Main Headline */}
          <Section style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", margin: "24px 0 0px 0" }}>
            <Row>
              <Column style={{ padding: "0px 40px 0px 40px" }}>
                <Heading style={{ textAlign: "center", lineHeight: "40px", color: "#002b11", fontSize: "50px", fontWeight: "bold" }}>
                  Book the best part of your trip
                </Heading>
              </Column>
            </Row>
          </Section>

          {/* Hero Image */}
          <Section>
            <Row>
              <Column align="left">
                <Link href="https://example.com/explore">
                  <Img 
                    src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop" 
                    style={{
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      borderTop: "0px solid #000000",
                      borderRight: "0px solid #000000",
                      borderBottom: "0px solid #000000",
                      borderLeft: "0px solid #000000",
                      width: "100%",
                      height: "400px",
                      objectFit: "contain",
                      margin: "24px 0 0px 0"
                    }} 
                    alt="Aerial view of Paris with Eiffel Tower at sunset"
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Description */}
          <Section style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", margin: "32px 0 0px 0" }}>
            <Row>
              <Column style={{ padding: "0px 32px 0px 32px" }}>
                <Text style={{ textAlign: "center", lineHeight: "28px", fontSize: "24px" }}>
                  The best part of any trip? The fun things you can do on it. With over 400,000 things to do, you can find anything you like whether it's underwater adventures or tours of art museums.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Primary CTA Button */}
          <Section style={{ margin: "32px 0 0px 0", padding: "0px 24px 0px 24px", backgroundColor: "#ffffff" }}>
            <Row>
              <Column align="center" style={{ width: "100%", paddingLeft: "0", paddingRight: "0", verticalAlign: "top" }}>
                <Button 
                  href="https://example.com/explore" 
                  style={{
                    backgroundColor: "#002b11",
                    padding: "17px 24px 17px 24px",
                    color: "#ffffff",
                    borderTopLeftRadius: "50px",
                    borderTopRightRadius: "50px",
                    borderBottomRightRadius: "50px",
                    borderBottomLeftRadius: "50px",
                    fontSize: "18px",
                    lineHeight: "normal",
                    margin: "0px 0 0px 0",
                    fontWeight: "bold",
                    display: "block",
                    textAlign: "center"
                  }}
                >
                  Explore things to do
                </Button>
              </Column>
            </Row>
          </Section>

          {/* Featured Destination Section */}
          <Section style={{ margin: "24px 0 0px 0", padding: "0px 24px 0px 24px", backgroundColor: "#ffffff" }}>
            <Row>
              <Column align="left" style={{ width: "100%", paddingLeft: "0", paddingRight: "0", verticalAlign: "top" }}>
                <Section>
                  <Row>
                    <Column align="center">
                      <Link href="https://example.com/road-trips">
                        <Img 
                          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=250&fit=crop" 
                          style={{
                            borderTopLeftRadius: "16px",
                            borderTopRightRadius: "16px",
                            borderBottomRightRadius: "16px",
                            borderBottomLeftRadius: "16px",
                            width: "100%",
                            height: "250px",
                            objectFit: "normal"
                          }} 
                          alt="Scenic coastal road winding through mountains at golden hour"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ margin: "16px 0 0px 0" }}>
                  <Row>
                    <Column style={{ padding: "0 0 0 0" }}>
                      <Heading style={{ textAlign: "left", lineHeight: "32px", color: "#000002", fontSize: "32px", fontWeight: "bold" }}>
                        Check off an iconic road trip
                      </Heading>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ margin: "16px 0 0 0" }}>
                  <Row>
                    <Column style={{ padding: "0 0 0 0" }}>
                      <Text style={{ textAlign: "left" }}>
                        From Australia's Great Ocean Road to Iceland's Ring Road, these are can't-miss routes around the world with key stops and scenic detours included.
                      </Text>
                    </Column>
                  </Row>
                </Section>
                <Button 
                  href="https://example.com/road-trips" 
                  style={{
                    backgroundColor: "#002b11",
                    padding: "17px 24px 17px 24px",
                    color: "#ffffff",
                    borderTopLeftRadius: "32px",
                    borderTopRightRadius: "32px",
                    borderBottomRightRadius: "32px",
                    borderBottomLeftRadius: "32px",
                    fontSize: "16px",
                    lineHeight: "normal",
                    margin: "16px 0 0 0",
                    fontWeight: "bold"
                  }}
                >
                  Explore
                </Button>
              </Column>
            </Row>
          </Section>

          {/* Section Title */}
          <Section style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", margin: "16px 0 0px 0" }}>
            <Row>
              <Column style={{ padding: "0px 24px 0px 24px" }}>
                <Heading style={{ color: "#000002", fontSize: "32px", fontWeight: "bold" }}>
                  European summer has arrived
                </Heading>
              </Column>
            </Row>
          </Section>

          {/* Two Column Destination Grid */}
          <Section style={{ padding: "16px 24px 0px 24px", backgroundColor: "#ffffff", borderTop: "0px solid #E5E7EB", borderRight: "0px solid #E5E7EB", borderBottom: "0px solid #E5E7EB", borderLeft: "0px solid #E5E7EB" }}>
            <Row>
              {/* Destination 1 - London */}
              <Column align="center" style={{ width: "50%", paddingLeft: "0", paddingRight: "8px", verticalAlign: "top" }}>
                <Section style={{ padding: "0px 0px 0px 0px", backgroundColor: "transparent" }}>
                  <Row>
                    <Column align="left" style={{ width: "100%", paddingLeft: "0", paddingRight: "0", verticalAlign: "top" }}>
                      <Section>
                        <Row>
                          <Column align="left">
                            <Link href="https://example.com/london">
                              <Img 
                                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=275&h=243&fit=crop" 
                                style={{
                                  borderTopLeftRadius: "8px",
                                  borderTopRightRadius: "8px",
                                  borderBottomRightRadius: "8px",
                                  borderBottomLeftRadius: "8px",
                                  width: "100%",
                                  height: "243px",
                                  objectFit: "cover"
                                }} 
                                alt="London skyline featuring Big Ben and Westminster Bridge at dusk"
                              />
                            </Link>
                          </Column>
                        </Row>
                      </Section>
                      <Section style={{ margin: "16px 0 0 0" }}>
                        <Row>
                          <Column style={{ padding: "0 0 0 0" }}>
                            <Text style={{ textAlign: "left", color: "#000002", fontSize: "24px", fontWeight: "bold" }}>
                              London
                            </Text>
                          </Column>
                        </Row>
                      </Section>
                      <Button 
                        href="https://example.com/london" 
                        style={{
                          backgroundColor: "#002b11",
                          padding: "17px 24px 17px 24px",
                          color: "#ffffff",
                          borderTopLeftRadius: "32px",
                          borderTopRightRadius: "32px",
                          borderBottomRightRadius: "32px",
                          borderBottomLeftRadius: "32px",
                          fontSize: "16px",
                          lineHeight: "normal",
                          margin: "16px 0 0 0",
                          fontWeight: "bold"
                        }}
                      >
                        Start planning
                      </Button>
                    </Column>
                  </Row>
                </Section>
              </Column>

              {/* Destination 2 - Paris */}
              <Column align="center" style={{ width: "50%", paddingLeft: "8px", paddingRight: "0", verticalAlign: "top" }}>
                <Section style={{ padding: "0px 0px 0px 0px", backgroundColor: "transparent" }}>
                  <Row>
                    <Column align="left" style={{ width: "100%", paddingLeft: "0", paddingRight: "0", verticalAlign: "top" }}>
                      <Section>
                        <Row>
                          <Column align="left">
                            <Link href="https://example.com/paris">
                              <Img 
                                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=275&h=243&fit=crop" 
                                style={{
                                  borderTopLeftRadius: "8px",
                                  borderTopRightRadius: "8px",
                                  borderBottomRightRadius: "8px",
                                  borderBottomLeftRadius: "8px",
                                  width: "100%",
                                  height: "243px",
                                  objectFit: "cover"
                                }} 
                                alt="Paris cityscape with Eiffel Tower illuminated at twilight"
                              />
                            </Link>
                          </Column>
                        </Row>
                      </Section>
                      <Section style={{ margin: "16px 0 0 0" }}>
                        <Row>
                          <Column style={{ padding: "0 0 0 0" }}>
                            <Text style={{ textAlign: "left", color: "#000002", fontSize: "24px", fontWeight: "bold" }}>
                              Paris
                            </Text>
                          </Column>
                        </Row>
                      </Section>
                      <Button 
                        href="https://example.com/paris" 
                        style={{
                          backgroundColor: "#002b11",
                          padding: "17px 24px 17px 24px",
                          color: "#ffffff",
                          borderTopLeftRadius: "32px",
                          borderTopRightRadius: "32px",
                          borderBottomRightRadius: "32px",
                          borderBottomLeftRadius: "32px",
                          fontSize: "16px",
                          lineHeight: "normal",
                          margin: "16px 0 0 0",
                          fontWeight: "bold"
                        }}
                      >
                        Start planning
                      </Button>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* App Download Banner */}
          <Section style={{ margin: "24px 0 0px 0", padding: "0px 0px 0px 24px", backgroundColor: "#feff59", borderTop: "0px solid #c2c9cd", borderRight: "0px solid #c2c9cd", borderBottom: "0px solid #c2c9cd", borderLeft: "0px solid #c2c9cd", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" }}>
            <Row>
              <Column align="left" style={{ width: "50%", paddingLeft: "0", paddingRight: "12px", verticalAlign: "middle" }}>
                <Section style={{ margin: "0 0 0 0" }}>
                  <Row>
                    <Column style={{ padding: "0 0 0 0" }}>
                      <Text style={{ lineHeight: "28px", fontSize: "24px", fontWeight: "bold" }}>
                        Get the app to find the best places near you on the go
                      </Text>
                    </Column>
                  </Row>
                </Section>
                <Button 
                  href="https://example.com/app" 
                  style={{
                    backgroundColor: "#002b11",
                    padding: "17px 24px 17px 24px",
                    color: "#ffffff",
                    borderTopLeftRadius: "32px",
                    borderTopRightRadius: "32px",
                    borderBottomRightRadius: "32px",
                    borderBottomLeftRadius: "32px",
                    fontSize: "16px",
                    lineHeight: "normal",
                    margin: "16px 0 0 0",
                    fontWeight: "bold"
                  }}
                >
                  Get the app
                </Button>
              </Column>
              <Column align="left" style={{ width: "50%", paddingLeft: "12px", paddingRight: "0", verticalAlign: "top" }}>
                <Section>
                  <Row>
                    <Column align="right">
                      <Link href="https://example.com/app">
                        <Img 
                          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=275&h=274&fit=crop" 
                          style={{
                            width: "275px",
                            height: "274px",
                            objectFit: "cover"
                          }} 
                          alt="TravelCo mobile app interface showing destination search"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={{ padding: "48px 24px 48px 24px", backgroundColor: "#ffffff" }}>
            <Row>
              <Column align="left" style={{ width: "100%", paddingLeft: "0", paddingRight: "0", verticalAlign: "top" }}>
                <Section>
                  <Row>
                    <Column align="left">
                      <Link href="https://example.com">
                        <Img 
                          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=171&h=33&fit=crop" 
                          style={{
                            borderTopLeftRadius: "4px",
                            borderTopRightRadius: "4px",
                            borderBottomRightRadius: "4px",
                            borderBottomLeftRadius: "4px",
                            width: "171px",
                            height: "33px"
                          }} 
                          alt="TravelCo Logo"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", margin: "0px 0 0px 0" }}>
                  <Row>
                    <Column style={{ padding: "16px 0px 0px 0px" }}>
                      <Text style={{ lineHeight: "12px", fontSize: "12px" }}>
                        Please do not reply directly to this email. This message was sent from an address that does not accept replies. If you have more questions or need help, visit our Help Center.
                      </Text>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", margin: "0px 0 0px 0" }}>
                  <Row>
                    <Column style={{ padding: "16px 0px 0px 0px" }}>
                      <Text style={{ lineHeight: "12px", fontSize: "12px" }}>
                        TravelCo LLC, 400 First Avenue, San Francisco, CA 94105, United States
                      </Text>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", margin: "0px 0 0px 0" }}>
                  <Row>
                    <Column style={{ padding: "16px 0px 0px 0px" }}>
                      <Text style={{ lineHeight: "12px", fontSize: "12px" }}>
                        © 2025 TravelCo LLC. All rights reserved. TravelCo and the TravelCo logo are registered trademarks of TravelCo LLC in the U.S. and other countries.
                      </Text>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ margin: "16px 0 0px 0" }}>
                  <Row>
                    <Column align="left">
                      <Row style={{ display: "table-cell" }}>
                        <Column style={{ paddingRight: "16px" }}>
                          <Link href="https://example.com">
                            <Text style={{ color: "#002b11", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                              Go to TravelCo
                            </Text>
                          </Link>
                        </Column>
                        <Column>
                          <Link href="https://example.com/unsubscribe">
                            <Text style={{ color: "#002b11", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                              Unsubscribe
                            </Text>
                          </Link>
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                </Section>
                <Section style={{ margin: "16px 0 0px 0" }}>
                  <Row>
                    <Column align="left">
                      <Row style={{ display: "table-cell" }}>
                        <Column style={{ paddingRight: "16px" }}>
                          <Link href="https://example.com/privacy">
                            <Text style={{ color: "#002b11", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                              Privacy and cookie policy
                            </Text>
                          </Link>
                        </Column>
                        <Column>
                          <Link href="https://example.com/contact">
                            <Text style={{ color: "#002b11", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                              Contact us
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

        </Container>
      </Body>
    </Html>
  )
}`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# TRAVEL & BOOKING EMAIL DESIGN SYSTEM

You are generating content for a travel and booking email using a proven TripAdvisor-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, aspirational, destination-focused
**Mood:** Inviting, adventurous, inspiring
**Typography:** Inter font family (modern, readable)
**Color Palette:** 
- Primary: Dark green (#002b11) for trust and nature
- Accent: Bright yellow (#feff59) for energy and highlights
- Text: Near-black (#000002) for readability
- Background: Clean white (#ffffff) for airiness

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│ [LOGO]          HOTELS  ACTIVITIES  FOOD    │ ← Header with navigation
├─────────────────────────────────────────────┤
│                                             │
│         [MAIN HEADLINE - 50px]             │ ← Bold, inspiring headline
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│         [HERO IMAGE - 600x400]             │ ← Full-width destination photo
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│         [Description Text - 24px]          │ ← Benefits-focused copy
│                                             │
├─────────────────────────────────────────────┤
│              [ PRIMARY CTA ]                │ ← Main action button
├─────────────────────────────────────────────┤
│         [Feature Image - 600x250]          │
│         Feature Headline                    │
│         Feature Description                 │ ← Featured destination/activity
│         [ EXPLORE CTA ]                     │
├─────────────────────────────────────────────┤
│         Section Title                       │
├─────────────────────────────────────────────┤
│  [Dest 1 Img]      [Dest 2 Img]           │
│  City Name         City Name               │ ← Two-column grid
│  [ CTA ]           [ CTA ]                 │
├─────────────────────────────────────────────┤
│  [App Banner: Text + Image]                │ ← Optional app promotion
├─────────────────────────────────────────────┤
│  Logo                                       │
│  Disclaimer text                            │
│  Company address                            │ ← Footer with legal
│  Copyright                                  │
│  [Links: Website | Unsubscribe]           │
│  [Links: Privacy | Contact]               │
└─────────────────────────────────────────────┘

## CONTENT GUIDELINES

### Headlines
- Length: 40-60 characters
- Tone: Inspirational, action-oriented
- Format: Sentence case with strong verbs
- Examples:
  ✅ "Book the best part of your trip"
  ✅ "Discover hidden gems in Europe"
  ✅ "Your next adventure starts here"
  ❌ "Check out our destinations" (too bland)
  ❌ "CLICK HERE TO TRAVEL NOW" (too aggressive)

### Description Text
- Length: 100-150 words (2-3 sentences)
- Focus: Benefits, not features
- Tone: Warm, conversational, inviting
- Include: Social proof or numbers when possible
- Example: "The best part of any trip? The fun things you can do on it. With over 400,000 activities worldwide, you can find anything from underwater adventures to art museum tours."

### CTAs
- Length: 2-4 words
- Use: Strong action verbs
- Examples:
  ✅ "Explore destinations"
  ✅ "Start planning"
  ✅ "Book now"
  ✅ "Find activities"
  ❌ "Click here"
  ❌ "Learn more"

### Image Requirements
- Hero: 600x400px, landscape destination shots
- Feature: 600x250px, horizontal activity/location images
- Grid: 275x243px, square city/landmark images
- All images: High quality, vibrant, aspirational
- Alt text: Descriptive, 10-15 words including location name

## COLOR AND BRAND INTEGRATION

- Primary color (#002b11): Headers, CTAs, navigation links, footer links
- Accent color (#feff59): App banner background, highlights
- Text: #000002 (near-black) for maximum readability
- Background: White (#ffffff) for clean look

## TONE AND VOICE

**Overall Tone:** Warm, inspiring, adventurous, trustworthy

**Do:**
- Use conversational language ("you", "your trip")
- Focus on experiences, not transactions
- Create excitement with specific details and imagery
- Build trust with specific numbers and facts

**Don't:**
- Be overly salesy or pushy
- Use corporate jargon
- Make unrealistic promises
- Be generic ("amazing", "incredible" without specifics)

## ANTI-PATTERNS

❌ **Don't use stock "business travel" imagery** - No briefcases, airports
❌ **Don't overload with text** - Let images breathe
❌ **Don't use weak CTAs** - Avoid "Click here", "Learn more"
❌ **Don't forget mobile responsiveness** - Two-column grid stacks
❌ **Don't use dark backgrounds** - Keep light and airy
❌ **Don't forget alt text** - Every image needs description

## EXAMPLE CONTENT SETS

### European Summer
- Headline: "European summer has arrived"
- Description: "From sun-drenched beaches of Greece to historic streets of Prague"
- Destinations: Barcelona, Santorini

### Adventure Travel
- Headline: "Book the adventure of a lifetime"
- Description: "Diving with sharks, hiking ancient trails, zip-lining through rainforests"
- Destinations: Patagonia, New Zealand

### City Breaks
- Headline: "Discover your next city escape"
- Description: "Perfect for long weekends - world-class dining, culture, experiences"
- Destinations: Tokyo, Amsterdam

---

**Follow the example email structure exactly, adapting content to match the user's travel theme and brand colors.**`
};

