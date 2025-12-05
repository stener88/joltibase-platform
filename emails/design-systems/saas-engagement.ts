/**
 * SAAS ENGAGEMENT & SUGGESTION EMAIL DESIGN SYSTEM
 * Based on Canva's "Your next design" activation template
 *
 * Use cases:
 * - Next action suggestions
 * - Feature discovery emails
 * - Post-completion engagement
 * - Template/resource recommendations
 * - Re-engagement after inactivity
 * - Upsell to premium features
 * - Content creation prompts
 * - Onboarding continuation
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const SaasEngagementDesignSystem: DesignSystem = {
  id: 'saas-engagement',
  name: 'SaaS Engagement & Next Action',
  description:
    'Clean SaaS engagement email with dual-button header, large hero image, and suggested next actions. Features rounded white card on gray background and platform download links. Perfect for feature discovery and user activation.',

  // KEYWORD TRIGGERS
  triggers: [
    'next',
    'suggestion',
    'try',
    'explore',
    'discover',
    'your next',
    'recommendation',
    'you might like',
    'continue',
    'keep going',
    'check out',
    'new feature',
    'did you know',
    "here's what's new",
    'get started',
    'ready to',
    'take it further',
    'unlock',
    'upgrade',
    'enhancement',
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['template', 'interface', 'dashboard', 'preview', 'mockup'],
    feature: ['product', 'tool', 'feature', 'capability', 'function'],
    product: ['software', 'app', 'platform', 'service'],
    background: ['gradient', 'clean', 'minimal', 'soft'],
    people: ['user', 'creator', 'professional', 'working'],
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
  exampleEmail: `import React from 'react'
import { Body, Button, Column, Container, Font, Head, Html, Img, Link, Preview, Row, Section, Text } from '@react-email/components'

export default function SaasEngagementEmail() {
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
      <Preview>Your next design: Presentation</Preview>
      <Body style={{ backgroundColor: "#EEF0F2" }}>
        <Container style={{ maxWidth: "600px", backgroundColor: "#EEF0F2" }}>
          
          {/* Main Content Card */}
          <Section style={{
            padding: "52px 48px 0px 48px",
            backgroundColor: "#ffffff",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px"
          }}>
            <Row>
              <Column align="left" style={{
                width: "100%",
                paddingLeft: "0",
                paddingRight: "0",
                verticalAlign: "top"
              }}>
                {/* Header with Logo and Action Button */}
                <Section>
                  <Row>
                    <Column align="left" style={{
                      width: "50%",
                      paddingLeft: "0",
                      paddingRight: "10px",
                      verticalAlign: "middle"
                    }}>
                      <Section>
                        <Row>
                          <Column align="left">
                            <Link href="https://example.com">
                              <Img 
                                src="https://via.placeholder.com/80x28/8b3eff/ffffff?text=Canva" 
                                style={{
                                  borderRadius: "4px",
                                  width: "80px",
                                  height: "28px"
                                }}
                                alt="Canva Logo"
                              />
                            </Link>
                          </Column>
                        </Row>
                      </Section>
                    </Column>
                    <Column align="right" style={{
                      width: "50%",
                      paddingLeft: "10px",
                      paddingRight: "0",
                      verticalAlign: "middle"
                    }}>
                      <Button 
                        href="https://example.com/design" 
                        style={{
                          backgroundColor: "#f2f3f5",
                          padding: "9px 16px 9px 16px",
                          color: "#2f3337",
                          borderRadius: "4px",
                          fontSize: "14px",
                          lineHeight: "24px",
                          fontWeight: "bold"
                        }}
                      >
                        Design in Canva
                      </Button>
                    </Column>
                  </Row>
                </Section>

                {/* Main Headline */}
                <Section style={{
                  borderRadius: "0px",
                  margin: "68px 0 0px 0"
                }}>
                  <Row>
                    <Column style={{ padding: "0px 0px 0px 0px" }}>
                      <Text style={{ lineHeight: "36px", fontSize: "42px" }}>
                        Your next design:
                      </Text>
                      <Text style={{ lineHeight: "36px", fontSize: "42px" }}>
                        Presentation
                      </Text>
                    </Column>
                  </Row>
                </Section>

                {/* Description */}
                <Section style={{
                  borderRadius: "0px",
                  margin: "24px 0 0px 0"
                }}>
                  <Row>
                    <Column style={{ padding: "0px 0px 0px 0px" }}>
                      <Text style={{ lineHeight: "20px", fontSize: "14px" }}>
                        You finished your design a while ago. Want to start creating something new? Explore hundreds of presentation templates and easily customize them in Canva.
                      </Text>
                    </Column>
                  </Row>
                </Section>

                {/* Primary CTA */}
                <Button 
                  href="https://example.com/templates" 
                  style={{
                    backgroundColor: "#8b3eff",
                    padding: "9px 16px 9px 16px",
                    color: "#ffffff",
                    borderRadius: "4px",
                    fontSize: "14px",
                    lineHeight: "24px",
                    margin: "24px 0 24px 0",
                    fontWeight: "bold"
                  }}
                >
                  Explore the templates
                </Button>
              </Column>
            </Row>
          </Section>

          {/* Hero Image */}
          <Section>
            <Row>
              <Column align="left">
                <Link href="https://example.com/templates">
                  <Img 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=337&fit=crop" 
                    style={{
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "0px",
                      borderBottomRightRadius: "8px",
                      borderBottomLeftRadius: "8px",
                      width: "600px",
                      height: "337px",
                      padding: "0px 0px 0px 0px"
                    }}
                    alt="Grid of colorful presentation templates showcasing various designs and layouts"
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Account Notice */}
          <Section style={{
            borderRadius: "0px",
            margin: "0px 0 0px 0"
          }}>
            <Row>
              <Column style={{ padding: "24px 20px 24px 20px" }}>
                <Text style={{ textAlign: "center", color: "#515559", fontSize: "14px" }}>
                  You received this email because you have a Canva Account.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Platform Download Links with Pipe Separators */}
          <Section style={{
            padding: "24px 0px 24px 0px",
            borderTop: "1px solid #dde1e3",
            borderBottom: "1px solid #dde1e3"
          }}>
            <Row>
              <Column align="center">
                <Row style={{ display: "table-cell" }}>
                  <Column>
                    <Link href="https://example.com/iphone">
                      <Text style={{ color: "#2c3135", fontSize: "14px", textDecoration: "underline" }}>
                        iPhone
                      </Text>
                    </Link>
                  </Column>
                  <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                    <Text style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>
                      |
                    </Text>
                  </Column>
                  <Column>
                    <Link href="https://example.com/ipad">
                      <Text style={{ color: "#2c3135", fontSize: "14px", textDecoration: "underline" }}>
                        iPad
                      </Text>
                    </Link>
                  </Column>
                  <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                    <Text style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>
                      |
                    </Text>
                  </Column>
                  <Column>
                    <Link href="https://example.com/android">
                      <Text style={{ color: "#2c3135", fontSize: "14px", textDecoration: "underline" }}>
                        Android
                      </Text>
                    </Link>
                  </Column>
                  <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                    <Text style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>
                      |
                    </Text>
                  </Column>
                  <Column>
                    <Link href="https://example.com/mac">
                      <Text style={{ color: "#2c3135", fontSize: "14px", textDecoration: "underline" }}>
                        Mac
                      </Text>
                    </Link>
                  </Column>
                  <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                    <Text style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>
                      |
                    </Text>
                  </Column>
                  <Column>
                    <Link href="https://example.com/windows">
                      <Text style={{ color: "#2c3135", fontSize: "14px", textDecoration: "underline" }}>
                        Windows
                      </Text>
                    </Link>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>

          {/* Footer Information */}
          <Section style={{
            borderRadius: "0px",
            margin: "0px 0 0px 0"
          }}>
            <Row>
              <Column style={{ padding: "24px 20px 24px 20px" }}>
                <Text style={{ textAlign: "center", lineHeight: "24px", color: "#515559", fontSize: "14px" }}>
                  For you, from Canva
                </Text>
                <Text style={{ textAlign: "center", lineHeight: "24px", color: "#515559", fontSize: "14px" }}>
                  Pty Ltd, 110 Kippax St, Sydney, NSW 2010, Australia. ABN 80 158 929 938.
                </Text>
                <Text style={{ textAlign: "center", lineHeight: "24px", color: "#515559", fontSize: "14px" }}>
                  If you need help, please contact us through our Help Center.
                </Text>
                <Text style={{ textAlign: "center", lineHeight: "24px", color: "#515559", fontSize: "14px" }}>
                  <Link href="https://canva.com" style={{ color: "#515559", textDecoration: "underline" }}>Visit canva.com</Link> &nbsp; &nbsp; <Link href="https://example.com/cancel" style={{ color: "#515559", textDecoration: "underline" }}>Cancel subscription</Link>
                </Text>
                <Text style={{ textAlign: "center", lineHeight: "24px", color: "#515559", fontSize: "14px" }}>
                  <Link href="https://example.com/notifications" style={{ color: "#515559", textDecoration: "underline" }}>Notifications</Link>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Social Media Icons */}
          <Section style={{ padding: "0px 0px 64px 0px" }}>
            <Row>
              <Column align="center">
                <Row style={{ display: "table-cell" }}>
                  <Column style={{ paddingRight: "16px" }}>
                    <Link href="https://facebook.com/canva">
                      <Img 
                        src="https://via.placeholder.com/24x24/8b3eff/ffffff?text=F" 
                        style={{
                          borderRadius: "4px",
                          width: "24px",
                          height: "24px"
                        }}
                        alt="Facebook"
                      />
                    </Link>
                  </Column>
                  <Column style={{ paddingRight: "16px" }}>
                    <Link href="https://twitter.com/canva">
                      <Img 
                        src="https://via.placeholder.com/24x24/8b3eff/ffffff?text=T" 
                        style={{
                          borderRadius: "4px",
                          width: "24px",
                          height: "24px"
                        }}
                        alt="Twitter"
                      />
                    </Link>
                  </Column>
                  <Column style={{ paddingRight: "16px" }}>
                    <Link href="https://instagram.com/canva">
                      <Img 
                        src="https://via.placeholder.com/24x24/8b3eff/ffffff?text=I" 
                        style={{
                          borderRadius: "4px",
                          width: "24px",
                          height: "24px"
                        }}
                        alt="Instagram"
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://youtube.com/canva">
                      <Img 
                        src="https://via.placeholder.com/24x24/8b3eff/ffffff?text=Y" 
                        style={{
                          borderRadius: "4px",
                          width: "24px",
                          height: "24px"
                        }}
                        alt="YouTube"
                      />
                    </Link>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# SAAS ENGAGEMENT EMAIL DESIGN SYSTEM

You are generating content for a SaaS engagement email using a proven Canva-inspired next-action suggestion template.

## VISUAL AESTHETIC

**Style:** Clean, friendly, product-focused, modern SaaS
**Mood:** Helpful, encouraging, non-pushy
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Purple (#8b3eff) for main CTA
- Secondary: Light gray (#f2f3f5) for secondary button
- Background: Light gray (#EEF0F2) for page, white (#ffffff) for content card
- Text: Dark gray (#2f3337, #515559, #2c3135) for various text elements
- Borders: Light gray (#dde1e3, #e2e5e9)

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐ Gray background
│ ┌─────────────────────────────────────────┐ │
│ │ [Logo]           [Design in Canva] │ │
│ │                                           │ │
│ │ Your next design: (42px)                 │ │
│ │ Presentation                             │ │
│ │                                           │ │ White card
│ │ Description text...                      │ │ (rounded top)
│ │                                           │ │
│ │ [Explore the templates]                  │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │    [HERO IMAGE - 600x337]               │ │ Rounded bottom
│ └─────────────────────────────────────────┘ │
│                                             │
│ You received this email because...         │
├═════════════════════════════════════════════┤ Border
│ iPhone | iPad | Android | Mac | Windows    │
├═════════════════════════════════════════════┤
│ Company info, Help Center                  │
│ Links: Visit site | Cancel | Notifications│
│ [Social Icons: F T I Y]                   │
└─────────────────────────────────────────────┘

## DISTINCTIVE FEATURES

### Dual-Button Header
**Structure**: Logo (left) | Action Button (right)
**Layout**: 50/50 split, vertically centered

**Left (Logo)**:
- Size: ~80x28px
- Clickable, links to homepage
- Vertically centered (middle alignment)

**Right (Secondary CTA)**:
- Background: Light gray (#f2f3f5)
- Text: Dark gray (#2f3337)
- Padding: 9px 16px
- Font: 14px, bold
- Border radius: 4px
- Text examples: "Design in Canva", "Open Dashboard", "Go to App"

### White Card on Gray Background
**Card specs**:
- Background: White (#ffffff)
- Padding: 52px 48px 0px 48px (top/right/bottom/left)
- Border radius: 8px top corners, 0px bottom (connects to image)
- Contains: Header, headline, description, CTA

**Page background**: Light gray (#EEF0F2)

### Large Headline (42px)
- **Format**: Multi-line, natural break
- **Line 1**: Context ("Your next design:")
- **Line 2**: Specific suggestion ("Presentation")
- **Font size**: 42px
- **Line height**: 36px

**Examples**:
✅ "Your next design: / Presentation"
✅ "Try this next: / Social Media Post"
✅ "Ready to create: / Marketing Materials"
✅ "Explore: / Video Templates"

### Hero Image Below Card
- **Dimensions**: 600x337px (16:9 aspect ratio)
- **Border radius**: 0px top, 8px bottom corners
- **Content**: Product preview, templates, feature showcase
- **Clickable**: Links to same destination as primary CTA
- **Alt text**: Descriptive of what's shown

### Platform Links with Pipe Separators
**Structure**: Link | Separator | Link | Separator | ...

**Example**:
\`\`\`
iPhone | iPad | Android | Mac | Windows
\`\`\`

**Implementation**:
- Layout: table-cell inline
- Links: 14px, underlined, dark gray (#2c3135)
- Separators: Pipe character "|", light gray (#e2e5e9)
- Spacing: 8px left and right of each separator
- Border: Top and bottom 1px solid #dde1e3

**Platforms to include**:
- Mobile: iPhone, iPad, Android
- Desktop: Mac, Windows, Linux
- Web: Browser (if applicable)

## CONTENT GUIDELINES

### Secondary Button (Header)
- **Text**: 1-3 words
- **Tone**: Action-oriented but secondary
- **Examples**:
  ✅ "Design in Canva"
  ✅ "Open Dashboard"
  ✅ "Go to App"
  ✅ "Create Now"
  ❌ "Click here" (too generic)

### Main Headline
**Format**: "[Context]: / [Specific Suggestion]"

**Context phrases**:
- "Your next design"
- "Try this next"
- "Ready to create"
- "Explore"
- "Discover"
- "Continue with"

**Specific suggestions**:
- Product/feature names: "Presentation", "Social Media Post", "Video"
- Category names: "Marketing Materials", "Brand Assets"
- Action-based: "Team Collaboration", "Advanced Features"

### Description Text
- **Length**: 2-3 sentences (40-60 words)
- **Font**: 14px, line-height 20px
- **Tone**: Helpful, friendly, specific
- **Structure**:
  1. Context (what they just did or their current state)
  2. Suggestion (what they could do next)
  3. Benefit (why they should do it)

**Examples**:
✅ "You finished your design a while ago. Want to start creating something new? Explore hundreds of presentation templates and easily customize them in Canva."

✅ "Great work on your social posts! Ready to try video content? We've added new video templates that are perfect for beginners."

✅ "You've been using basic features. Unlock advanced capabilities to save time and create professional designs faster."

### Primary CTA Button
- **Background**: Brand purple (#8b3eff)
- **Text**: White
- **Padding**: 9px 16px
- **Font**: 14px, bold
- **Border radius**: 4px
- **Text**: 2-4 words, action-oriented

**Examples**:
✅ "Explore the templates"
✅ "Try it now"
✅ "Get started"
✅ "See what's new"
✅ "Unlock features"
❌ "Click here"
❌ "Learn more" (too passive)

### Account Notice
- **Text**: "You received this email because [reason]."
- **Style**: 14px, gray (#515559), centered
- **Padding**: 24px 20px
- **Examples**:
  ✅ "You received this email because you have a Canva Account."
  ✅ "You're receiving this because you're subscribed to product updates."

### Footer Information
**Include**:
1. Company tagline ("For you, from Canva")
2. Legal entity and address
3. Help/support text with link
4. Important links (Visit site, Cancel subscription, Notifications)
5. Social media icons

**Format**:
- Font: 14px
- Line height: 24px
- Color: Gray (#515559)
- Text align: Center
- Links: Underlined, same color as text

## COLOR SYSTEM

### Primary Colors
- **Purple (#8b3eff)**: Primary CTA, brand accent
- **White (#ffffff)**: Content card background
- **Light Gray (#EEF0F2)**: Page background
- **Very Light Gray (#f2f3f5)**: Secondary button background

### Text Colors
- **Dark Gray (#2f3337)**: Secondary button text, headlines
- **Medium Gray (#515559)**: Body text, footer text
- **Charcoal (#2c3135)**: Platform links

### Border Colors
- **Light Border (#dde1e3)**: Section dividers
- **Very Light (#e2e5e9)**: Pipe separators

### Usage Rules
- Purple for primary actions only
- Gray backgrounds for secondary actions
- White card "floats" on gray page background
- Consistent gray tones for non-primary elements

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
- **Main headline**: 42px, line-height 36px
- **Body text**: 14px, line-height 20px (description)
- **Body text**: 14px, line-height 24px (footer)
- **Buttons**: 14px, bold, line-height 24px
- **Platform links**: 14px, underlined

## TONE AND VOICE

**Overall Tone:** Helpful, friendly, encouraging, non-pushy

**Do:**
- Acknowledge what they've done
- Suggest next logical steps
- Be specific about what they'll find
- Use "you" and "your" (personal)
- Make it feel optional, not mandatory
- Focus on benefits and ease
- Be conversational

**Don't:**
- Be pushy or aggressive
- Use guilt ("You haven't...")
- Make vague suggestions
- Oversell features
- Use lots of exclamation points
- Ignore their progress/context
- Be too corporate or stiff

## ENGAGEMENT STRATEGIES

### Post-Completion
**Context**: User just finished something
**Approach**: Congratulate, then suggest related next action
**Example**: "You finished your design a while ago. Want to start creating something new?"

### Feature Discovery
**Context**: User hasn't tried a feature
**Approach**: Show what they're missing, explain ease
**Example**: "You've been using basic features. Unlock advanced capabilities that save time."

### Re-engagement
**Context**: User inactive for a period
**Approach**: Gentle reminder of value, easy return path
**Example**: "It's been a while! We've added new templates you might love."

### Upsell to Premium
**Context**: Free user hitting limits
**Approach**: Show premium value, clear benefit
**Example**: "Ready for unlimited designs? Upgrade to Pro for advanced features."

## ANTI-PATTERNS

❌ **Don't use small headlines** - 42px minimum for main headline
❌ **Don't skip the secondary button** - Dual-button header is signature
❌ **Don't forget the hero image** - Visual preview is crucial
❌ **Don't use multiple CTAs** - One primary action only
❌ **Don't skip platform links** - Multi-platform availability is key
❌ **Don't forget rounded corners** - 8px on card, 4px on buttons
❌ **Don't use dark backgrounds** - White card on light gray is signature
❌ **Don't be pushy** - Helpful suggestions, not demands

## EXAMPLE CONTENT SETS

### Design Tool (Canva-style)
- Headline: "Your next design: / Presentation"
- Description: "You finished your design a while ago. Want to start creating something new? Explore hundreds of presentation templates and easily customize them in Canva."
- Primary CTA: "Explore the templates"
- Secondary CTA: "Design in Canva"

### Project Management Tool
- Headline: "Try this next: / Team Collaboration"
- Description: "You've mastered solo projects. Ready to invite your team? Collaborate in real-time with shared workspaces and comments."
- Primary CTA: "Invite your team"
- Secondary CTA: "Open Dashboard"

### Content Creation Platform
- Headline: "Ready to create: / Video Content"
- Description: "Your blog posts are great! Want to reach a wider audience? Create engaging videos with our new easy-to-use templates."
- Primary CTA: "Try video templates"
- Secondary CTA: "Start Creating"

### Analytics Platform
- Headline: "Discover: / Advanced Reports"
- Description: "You've been using basic analytics. Unlock deeper insights with custom reports, forecasting, and team dashboards."
- Primary CTA: "See what's new"
- Secondary CTA: "View Dashboard"

---

**Follow the example email structure exactly, including the white rounded card on gray background, dual-button header, 42px headline, hero image below card, and platform links with pipe separators.**`,
};

export default SaasEngagementDesignSystem;

