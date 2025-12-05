/**
 * EVENT ANNOUNCEMENT EMAIL DESIGN SYSTEM
 * Based on Apple Developer's multi-event announcement template
 *
 * Use cases:
 * - Developer conferences and workshops
 * - Webinar series announcements
 * - Training session calendars
 * - Educational event roundups
 * - Multi-day event schedules
 * - Tech talks and meetups
 * - Virtual/hybrid event announcements
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const EventAnnouncementDesignSystem: DesignSystem = {
  id: 'event-announcement',
  name: 'Event Announcement & Calendar',
  description:
    'Clean, minimalist multi-event announcement template with card-based layout, icons, and multiple signup options (in-person/online). Perfect for developer events, webinars, and training sessions.',

  // KEYWORD TRIGGERS
  triggers: [
    'event',
    'events',
    'conference',
    'webinar',
    'workshop',
    'training',
    'session',
    'meetup',
    'seminar',
    'talk',
    'developer',
    'tech talk',
    'virtual event',
    'online event',
    'in person',
    'hybrid event',
    'register',
    'sign up',
    'RSVP',
    'save the date',
    'calendar',
    'schedule',
    'activities',
    'meet with',
    'join us',
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['event', 'conference', 'presentation', 'audience', 'venue'],
    feature: ['workshop', 'collaboration', 'meeting', 'team'],
    product: ['technology', 'innovation', 'code', 'development'],
    background: ['abstract', 'pattern', 'minimal', 'gradient'],
    people: ['developer', 'professional', 'audience', 'speaker'],
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
  exampleEmail: `import React from 'react'
import { Body, Column, Container, Font, Head, Html, Img, Link, Preview, Row, Section, Text } from '@react-email/components'

export default function EventAnnouncementEmail() {
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
      <Preview>New developer activities around the world</Preview>
      <Body style={{ backgroundColor: "#ffffff" }}>
        <Container style={{ maxWidth: "600px", backgroundColor: "#ffffff" }}>
          
          {/* Hero Image */}
          <Section>
            <Row>
              <Column align="left">
                <Link href="https://example.com/events">
                  <Img 
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop" 
                    style={{
                      borderRadius: "4px",
                      width: "600px",
                      height: "400px"
                    }}
                    alt="Developer conference auditorium with attendees and large presentation screen"
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Main Content Section */}
          <Section style={{
            padding: "36px 40px 32px 40px",
            backgroundColor: "#f5f5f7"
          }}>
            <Row>
              <Column align="left" style={{
                width: "100%",
                paddingLeft: "0",
                paddingRight: "0",
                verticalAlign: "top"
              }}>
                <Section style={{
                  padding: "0px 0px 0px 0px",
                  backgroundColor: "#f5f5f7"
                }}>
                  <Row>
                    <Column align="center" style={{
                      width: "100%",
                      paddingLeft: "0",
                      paddingRight: "0",
                      verticalAlign: "top"
                    }}>
                      {/* Eyebrow Text */}
                      <Section style={{ margin: "0px 0 12px 0" }}>
                        <Row>
                          <Column style={{ padding: "0 0 0 0" }}>
                            <Text style={{ textAlign: "center", color: "#86868b", fontWeight: "bold" }}>
                              MEET WITH APPLE
                            </Text>
                          </Column>
                        </Row>
                      </Section>

                      {/* Main Headline */}
                      <Section style={{ margin: "0px 0 0px 0" }}>
                        <Row>
                          <Column style={{ padding: "0 0 0 0" }}>
                            <Text style={{ textAlign: "center", lineHeight: "44px", fontSize: "40px", fontWeight: "bold" }}>
                              New activities
                            </Text>
                            <Text style={{ textAlign: "center", lineHeight: "44px", fontSize: "40px", fontWeight: "bold" }}>
                              around the world
                            </Text>
                          </Column>
                        </Row>
                      </Section>

                      {/* Browse All Link */}
                      <Link href="https://example.com/events/all">
                        <Section style={{ margin: "0 0 0 0" }}>
                          <Row>
                            <Column style={{ padding: "12px 0px 0px 0px" }}>
                              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                                Browse all developer activities
                              </Text>
                            </Column>
                          </Row>
                        </Section>
                      </Link>

                      {/* Event Grid - Row 1 */}
                      <Section style={{
                        padding: "32px 0px 0px 0px",
                        backgroundColor: "#f5f5f7"
                      }}>
                        <Row>
                          {/* Event Card 1 */}
                          <Column align="left" style={{
                            width: "50%",
                            paddingLeft: "0",
                            paddingRight: "6px",
                            verticalAlign: "top"
                          }}>
                            <Section style={{
                              padding: "40px 30px 40px 30px",
                              backgroundColor: "#ffffff",
                              borderRadius: "16px"
                            }}>
                              <Row>
                                <Column align="left" style={{
                                  width: "100%",
                                  paddingLeft: "0",
                                  paddingRight: "0",
                                  verticalAlign: "top"
                                }}>
                                  {/* Event Icon */}
                                  <Section>
                                    <Row>
                                      <Column align="left">
                                        <Link href="https://example.com/event1">
                                          <Img 
                                            src="https://via.placeholder.com/44x44/0066cc/ffffff?text=📱" 
                                            style={{
                                              borderRadius: "4px",
                                              width: "44px",
                                              height: "44px"
                                            }}
                                            alt="Foundation Models icon"
                                          />
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  {/* Event Title */}
                                  <Section style={{ margin: "16px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "25px", color: "#1d1d1f", fontSize: "21px", fontWeight: "bold" }}>
                                          Code along with the Foundation Models framework
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  {/* Event Description */}
                                  <Section style={{ margin: "8px 0 0 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "20px", color: "#1d1d1f", fontSize: "14px" }}>
                                          Get hands-on experience using the Foundation Models framework to access Apple's on-device LLM. In this session, you can code along with us as we build generative AI features into a sample app live in Xcode.
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  {/* Event Details */}
                                  <Section style={{ margin: "20px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0px 0px 0px 0px" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>September 25</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Online</Text>
                                        <Link href="https://example.com/event1/signup">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>
                                </Column>
                              </Row>
                            </Section>
                          </Column>

                          {/* Event Card 2 */}
                          <Column align="left" style={{
                            width: "50%",
                            paddingLeft: "6px",
                            paddingRight: "0",
                            verticalAlign: "top"
                          }}>
                            <Section style={{
                              padding: "40px 30px 35px 30px",
                              backgroundColor: "#ffffff",
                              borderRadius: "16px"
                            }}>
                              <Row>
                                <Column align="left" style={{
                                  width: "100%",
                                  paddingLeft: "0",
                                  paddingRight: "0",
                                  verticalAlign: "top"
                                }}>
                                  <Section>
                                    <Row>
                                      <Column align="left">
                                        <Link href="https://example.com/event2">
                                          <Img 
                                            src="https://via.placeholder.com/44x44/34c759/ffffff?text=⚡" 
                                            style={{
                                              borderRadius: "4px",
                                              width: "44px",
                                              height: "44px"
                                            }}
                                            alt="Performance optimization icon"
                                          />
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "16px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "25px", color: "#1d1d1f", fontSize: "21px", fontWeight: "bold" }}>
                                          Optimize your app's speed and efficiency
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "8px 0 0 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "20px", color: "#1d1d1f", fontSize: "14px" }}>
                                          Back by popular demand! Join us to discover how you can maximize your app's performance and resolve inefficiencies.
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  {/* Multiple Event Options */}
                                  <Section style={{ margin: "20px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0px 0px 0px 0px" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>October 30</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>In person (Cupertino)</Text>
                                        <Link href="https://example.com/event2/in-person">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "20px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0px 0px 0px 0px" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>October 30</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Online</Text>
                                        <Link href="https://example.com/event2/online">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>
                                </Column>
                              </Row>
                            </Section>
                          </Column>
                        </Row>
                      </Section>

                      {/* Event Grid - Row 2 */}
                      <Section style={{
                        padding: "12px 0px 0px 0px",
                        backgroundColor: "#f5f5f7"
                      }}>
                        <Row>
                          {/* Event Card 3 */}
                          <Column align="left" style={{
                            width: "50%",
                            paddingLeft: "0",
                            paddingRight: "6px",
                            verticalAlign: "top"
                          }}>
                            <Section style={{
                              padding: "40px 30px 40px 30px",
                              backgroundColor: "#ffffff",
                              borderRadius: "16px"
                            }}>
                              <Row>
                                <Column align="left" style={{
                                  width: "100%",
                                  paddingLeft: "0",
                                  paddingRight: "0",
                                  verticalAlign: "top"
                                }}>
                                  <Section>
                                    <Row>
                                      <Column align="left">
                                        <Link href="https://example.com/event3">
                                          <Img 
                                            src="https://via.placeholder.com/44x44/ff375f/ffffff?text=🥽" 
                                            style={{
                                              borderRadius: "4px",
                                              width: "44px",
                                              height: "44px"
                                            }}
                                            alt="VisionOS icon"
                                          />
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "16px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "25px", color: "#1d1d1f", fontSize: "21px", fontWeight: "bold" }}>
                                          Creative immersive media experiences for visionOS
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "8px 0 0 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "20px", color: "#1d1d1f", fontSize: "14px" }}>
                                          Learn how to create compelling interactive experiences for visionOS and capture immersive video in this multi-day activity held in person and online.
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "20px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0px 0px 16px 0px" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>October 21-23</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>In person (Cupertino)</Text>
                                        <Link href="https://example.com/event3/in-person">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "20px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0px 0px 0px 0px" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>October 21-22</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Online</Text>
                                        <Link href="https://example.com/event3/online">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>
                                </Column>
                              </Row>
                            </Section>
                          </Column>

                          {/* Event Card 4 */}
                          <Column align="left" style={{
                            width: "50%",
                            paddingLeft: "6px",
                            paddingRight: "0",
                            verticalAlign: "top"
                          }}>
                            <Section style={{
                              padding: "40px 30px 156px 30px",
                              backgroundColor: "#ffffff",
                              borderRadius: "16px"
                            }}>
                              <Row>
                                <Column align="left" style={{
                                  width: "100%",
                                  paddingLeft: "0",
                                  paddingRight: "0",
                                  verticalAlign: "top"
                                }}>
                                  <Section>
                                    <Row>
                                      <Column align="left">
                                        <Link href="https://example.com/event4">
                                          <Img 
                                            src="https://via.placeholder.com/44x44/5856d6/ffffff?text=📡" 
                                            style={{
                                              borderRadius: "4px",
                                              width: "44px",
                                              height: "44px"
                                            }}
                                            alt="HLS streaming icon"
                                          />
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "16px 0 0px 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "25px", color: "#1d1d1f", fontSize: "21px", fontWeight: "bold" }}>
                                          IETF HLS Interest Day 2025
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "8px 0 0 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ lineHeight: "20px", color: "#1d1d1f", fontSize: "14px" }}>
                                          Learn about the latest updates to HTTP Live Streaming (HLS), Apple Immersive Video, Spatial Audio, and more.
                                        </Text>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "8px 0 0 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>October 23</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>In person (Cupertino)</Text>
                                        <Link href="https://example.com/event4/in-person">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>

                                  <Section style={{ margin: "8px 0 0 0" }}>
                                    <Row>
                                      <Column style={{ padding: "0 0 0 0" }}>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>October 23</Text>
                                        <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Online</Text>
                                        <Link href="https://example.com/event4/online">
                                          <Text style={{ color: "#0066cc", fontSize: "14px" }}>Sign up now</Text>
                                        </Link>
                                      </Column>
                                    </Row>
                                  </Section>
                                </Column>
                              </Row>
                            </Section>
                          </Column>
                        </Row>
                      </Section>

                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Footer Copyright */}
          <Section style={{
            margin: "20px 0 0px 0",
            backgroundColor: "#ffffff"
          }}>
            <Row>
              <Column align="left" style={{
                width: "100%",
                paddingLeft: "0",
                paddingRight: "0",
                verticalAlign: "top"
              }}>
                <Section style={{
                  borderRadius: "0px",
                  margin: "0px 0 0px 0"
                }}>
                  <Row>
                    <Column style={{ padding: "0px 40px 0px 40px" }}>
                      <Text style={{ textAlign: "center", color: "#6e6e73", fontSize: "12px" }}>
                        Copyright Apple 2025 Inc. One Apple Park Way, MS 923-4DEV, Cupertino, CA 95014
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Footer Links */}
          <Section style={{ margin: "6px 0 0px 0" }}>
            <Row>
              <Column align="center">
                <Row style={{ display: "table-cell" }}>
                  <Column style={{ paddingRight: "16px" }}>
                    <Link href="https://example.com/rights">
                      <Text style={{ color: "#424245", fontSize: "12px" }}>All Rights Reserved</Text>
                    </Link>
                  </Column>
                  <Column style={{ paddingRight: "16px" }}>
                    <Link href="https://example.com/privacy">
                      <Text style={{ color: "#424245", fontSize: "12px" }}>Privacy Policy</Text>
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://example.com/account">
                      <Text style={{ color: "#424245", fontSize: "12px" }}>Account</Text>
                    </Link>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>

          {/* Preferences/Unsubscribe */}
          <Section style={{
            borderRadius: "0px",
            margin: "6px 0 0px 0"
          }}>
            <Row>
              <Column style={{ padding: "0px 40px 0px 40px" }}>
                <Text style={{ textAlign: "center", color: "#6e6e73", fontSize: "12px" }}>
                  You can <Link href="https://example.com/preferences" style={{ color: "#86868b" }}>update your Apple Developer email preferences</Link> or <Link href="https://example.com/unsubscribe" style={{ color: "#86868b" }}>unsubscribe</Link>.
                </Text>
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# EVENT ANNOUNCEMENT EMAIL DESIGN SYSTEM

You are generating content for a multi-event announcement email using a proven Apple Developer-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, minimalist, card-based, Apple-inspired
**Mood:** Professional, informative, organized, accessible
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Background: Light gray (#f5f5f7) for main section
- Cards: White (#ffffff) with rounded corners
- Text: Near-black (#1d1d1f) for headings and body
- Accent: Gray (#86868b) for eyebrow text
- Links: Blue (#0066cc) for CTAs
- Footer: Medium gray (#6e6e73, #424245) for legal text

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐
│         [HERO IMAGE - 600x400]             │
├─────────────────────────────────────────────┤
│              EYEBROW TEXT                   │
│                                             │
│         Main Headline (40px)               │
│         Second Line Headline               │
│                                             │
│         Browse all activities →            │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐         │
│  │ 📱 Icon     │  │ ⚡ Icon     │         │
│  │ Event Title │  │ Event Title │         │
│  │ Description │  │ Description │         │
│  │ Sept 25     │  │ Oct 30      │         │ ← Row 1
│  │ Online      │  │ In person   │         │
│  │ Sign up →   │  │ Online      │         │
│  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐         │
│  │ 🥽 Icon     │  │ 📡 Icon     │         │
│  │ Event Title │  │ Event Title │         │
│  │ Description │  │ Description │         │
│  │ Oct 21-23   │  │ Oct 23      │         │ ← Row 2
│  │ In person   │  │ In person   │         │
│  │ Online      │  │ Online      │         │
│  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────┤
│  Copyright © 2025 Company Name             │
│  All Rights Reserved | Privacy | Account   │
│  Update preferences or unsubscribe         │
└─────────────────────────────────────────────┘

## CONTENT GUIDELINES

### Hero Image
- **Dimensions**: 600x400px (3:2 aspect ratio)
- **Content**: Conference venue, audience, presentation, or branded event graphic
- **Style**: Professional, aspirational, on-brand
- **Alt text**: Include "conference" or "event" with context

### Eyebrow Text
- **Format**: ALL CAPS, bold, gray color
- **Length**: 2-4 words
- **Examples**:
  ✅ "MEET WITH APPLE"
  ✅ "UPCOMING EVENTS"
  ✅ "DEVELOPER WORKSHOPS"
  ✅ "TRAINING SERIES"
  ❌ "Check out our events" (too long, not caps)

### Main Headline
- **Format**: Multi-line (usually 2 lines), large (40px), bold
- **Tone**: Exciting, clear, benefit-focused
- **Line height**: 44px (tight but readable)
- **Examples**:
  ✅ "New activities / around the world"
  ✅ "Join us for / developer workshops"
  ✅ "Learn from experts / this quarter"
  ❌ "We have some events coming up" (too wordy)

### Browse All Link
- **Text**: "Browse all [events/activities]"
- **Style**: Bold, black text, clickable
- **Placement**: Below headline, above event cards

### Event Cards

**Structure:**
Each card contains:
1. Icon (44x44px)
2. Title (21px, bold, 2-3 lines)
3. Description (14px, 2-4 sentences)
4. Date/location/signup details (14px)

**Icon:**
- Size: 44x44px
- Style: Rounded corners (4px)
- Content: Simple, recognizable symbol or logo
- Color: Brand colors or thematic

**Title:**
- Length: 5-10 words
- Font: 21px, bold
- Line height: 25px
- Color: Near-black (#1d1d1f)
- Examples:
  ✅ "Code along with the Foundation Models framework"
  ✅ "Optimize your app's speed and efficiency"
  ✅ "Creative immersive media experiences for visionOS"

**Description:**
- Length: 20-40 words (2-4 sentences)
- Font: 14px, regular
- Line height: 20px
- Tone: Informative, benefit-focused
- Include: What attendees will learn/do

**Event Details:**
Format as separate lines:
1. **Date** (bold): "September 25" or "October 21-23"
2. **Location** (bold): "Online" or "In person (City)"
3. **CTA link** (blue, #0066cc): "Sign up now"

**Multiple Options:**
If event has both in-person and online options, show both with spacing:

October 30
In person (Cupertino)
Sign up now

[20px margin]

October 30
Online
Sign up now

### Card Grid Layout

**Structure**: 2x2 grid (4 events total)
- **Columns**: 50% width each with 12px gap
- **Rows**: 32px gap for first row, 12px gap for second row
- **Background**: White cards on gray background (#f5f5f7)
- **Border radius**: 16px (rounded corners)
- **Padding**: 40px 30px (top/bottom, left/right)

**Card Height Variation:**
Cards can have different heights based on content:
- Single event option: Standard padding
- Multiple event options: Add 20px margin between each option
- Adjust bottom padding to align visually (may use 156px for shorter content)

### Footer

**Copyright Line:**
- Font: 12px, gray (#6e6e73)
- Format: "Copyright [Company] 2025 Inc. [Address]"
- Center-aligned

**Legal Links:**
- Font: 12px, medium gray (#424245)
- Links: All Rights Reserved, Privacy Policy, Account
- Layout: Inline with 16px spacing
- Center-aligned

**Preferences Line:**
- Font: 12px, gray (#6e6e73)
- Text: "You can update your [Company] email preferences or unsubscribe."
- Links: Slightly lighter gray (#86868b)
- Center-aligned

## COLOR SYSTEM

### Main Colors
- **Background Gray (#f5f5f7)**: Main content area
- **White (#ffffff)**: Event cards, body background
- **Near-Black (#1d1d1f)**: Headings, body text
- **Medium Gray (#86868b)**: Eyebrow text, footer links
- **Light Gray (#6e6e73, #424245)**: Footer text
- **Blue (#0066cc)**: CTA links ("Sign up now")

### Icon Colors (Examples)
Use brand-appropriate colors for icons:
- Blue (#0066cc): Technology/code topics
- Green (#34c759): Performance/optimization
- Red/Pink (#ff375f): Design/creative topics
- Purple (#5856d6): Streaming/media topics

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
- **Eyebrow**: 12px, bold, all caps, gray
- **Main headline**: 40px, bold, line-height 44px
- **Browse link**: 14px, bold, black
- **Card title**: 21px, bold, line-height 25px
- **Card description**: 14px, regular, line-height 20px
- **Event details**: 14px, bold (date/location), blue (link)
- **Footer text**: 12px, regular, gray

## TONE AND VOICE

**Overall Tone:** Professional, informative, welcoming, organized

**Do:**
- Use benefit-focused language ("Learn how to...", "Discover...")
- Be specific about what attendees will gain
- Include clear date and location information
- Provide multiple signup options when available
- Use simple, direct language
- Focus on educational value

**Don't:**
- Be overly salesy or pushy
- Use marketing hyperbole
- Skip important details (date, location, format)
- Make it hard to sign up
- Use technical jargon without context
- Forget accessibility

## EVENT CARD BEST PRACTICES

### Title Writing
- Start with strong verbs: "Code along", "Optimize", "Learn", "Discover"
- Be specific: Not "AI workshop" but "Code along with the Foundation Models framework"
- Keep to 2-3 lines maximum

### Description Writing
- First sentence: What attendees will do/learn
- Second sentence: Additional context or benefit
- Length: 20-40 words
- Examples:
  ✅ "Get hands-on experience using the Foundation Models framework to access Apple's on-device LLM. In this session, you can code along with us as we build generative AI features into a sample app live in Xcode."
  ✅ "Back by popular demand! Join us to discover how you can maximize your app's performance and resolve inefficiencies."

### Event Details Formatting
Always include in this order:
1. Date (bold)
2. Format/Location (bold)
3. CTA link (blue, "Sign up now")

For multiple options, separate with 20px margin.

## ANTI-PATTERNS

❌ **Don't use vague event titles** - Be specific about the topic
❌ **Don't skip event descriptions** - Always explain what attendees will learn
❌ **Don't forget signup links** - Every event needs a clear CTA
❌ **Don't mix card heights poorly** - Align visually with padding
❌ **Don't use tiny icons** - 44x44px minimum
❌ **Don't overcrowd cards** - White space is important
❌ **Don't forget multiple format options** - Show in-person AND online when applicable

## EXAMPLE CONTENT SETS

### Developer Conference
- Eyebrow: "MEET WITH [COMPANY]"
- Headline: "New developer sessions / this quarter"
- Events: Technical workshops, code-alongs, Q&As

### Training Series
- Eyebrow: "UPCOMING WORKSHOPS"
- Headline: "Learn from experts / in person and online"
- Events: Multi-day trainings, certification courses

### Product Launch Events
- Eyebrow: "PRODUCT ANNOUNCEMENTS"
- Headline: "See what's new / around the world"
- Events: Launch demos, hands-on sessions, Q&As

### Community Meetups
- Eyebrow: "JOIN THE COMMUNITY"
- Headline: "Connect with developers / in your area"
- Events: Local meetups, networking, talks

---

**Follow the example email structure exactly, including the 2x2 card grid, rounded white cards on gray background, and clean Apple-inspired minimalist design.**`,
};

export default EventAnnouncementDesignSystem;

