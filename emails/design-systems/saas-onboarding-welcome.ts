/**
 * SAAS ONBOARDING WELCOME EMAIL DESIGN SYSTEM
 * Based on Loom's welcome email template
 *
 * Use cases:
 * - New user welcome and onboarding
 * - Product introduction emails
 * - Getting started guides
 * - First-time user activation
 * - Trial welcome emails
 * - Account creation confirmation
 * - Onboarding sequence starters
 * - Free tier welcome
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const SaasOnboardingWelcomeDesignSystem: DesignSystem = {
  id: 'saas-onboarding-welcome',
  name: 'SaaS Onboarding & Welcome',
  description:
    'Clean text-focused welcome email with colored top border, emoji section headers, inline resource links, and personal founder signature. Features white content box on gray background. Perfect for SaaS product onboarding.',

  // KEYWORD TRIGGERS
  triggers: [
    'welcome',
    'get started',
    'onboarding',
    'hello',
    'hi there',
    "glad you're here",
    "happy you're here",
    'thanks for signing up',
    'account created',
    'new account',
    'getting started',
    'first steps',
    'how to use',
    'download',
    'install',
    'setup',
    'activate',
    'begin',
    'introduction',
    'tutorial',
  ],

  // IMAGE KEYWORDS (MUST MATCH INTERFACE)
  imageKeywords: {
    hero: ['logo', 'brand', 'welcome banner', 'onboarding'],
    feature: ['product', 'interface', 'dashboard', 'app'],
    product: ['software', 'platform', 'tool', 'application'],
    background: ['clean', 'minimal', 'simple', 'gradient'],
    people: ['team', 'founder', 'ceo', 'user'],
  },

  // COMPLETE EXAMPLE EMAIL WITH REAL CONTENT (NO PLACEHOLDERS)
  exampleEmail: `import {
  Body,
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

export const SaasOnboardingWelcomeEmail = () => {
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
      <Preview>Welcome to Loom - Get started with video messaging</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-gray-50 pt-6 font-sans antialiased">
          
          {/* Main Content Container with Colored Top Border */}
          <Container className="mx-auto mb-[20px] mt-[40px] border border-t-[12px] border-solid border-gray-900 border-t-blue-600 bg-white px-8 pb-8">
            
            {/* Logo Section */}
            <Section className="py-8">
              <Row>
                <Column>
                  <Img
                    src="https://via.placeholder.com/160x49/625DF5/ffffff?text=Loom"
                    width="160"
                    height="49"
                    alt="Loom Logo"
                  />
                </Column>
              </Row>
            </Section>

            {/* Greeting and Welcome */}
            <Section>
              <Row>
                <Text className="text-[16px] leading-[26px] text-black">
                  Hi Jake,
                </Text>
                <Text className="text-[16px] leading-[26px] text-black">
                  Welcome to our growing community of more than 12 million
                  professionals who use Loom to share updates, feedback, and
                  ideas through video messages. I'm happy you're here!
                </Text>
              </Row>
            </Section>

            {/* Section 1: Download Recorder */}
            <Section>
              <Row>
                <Text className="text-[16px] font-semibold leading-[26px] text-black">
                  💻 Get started by downloading a recorder
                </Text>
              </Row>
              <Row>
                <Text className="text-[16px] leading-[26px] text-black">
                  To get started, you'll need a recorder. Download Loom's{' '}
                  <Link href="https://example.com/desktop" className="underline">
                    desktop app
                  </Link>{' '}
                  for HD recordings and the{' '}
                  <Link href="https://example.com/chrome" className="underline">
                    Chrome extension
                  </Link>{' '}
                  to use Loom directly in Gmail, Jira, Github, and more of your
                  favorite platforms. You can also download Loom for{' '}
                  <Link href="https://example.com/ios" className="underline">
                    iOS
                  </Link>{' '}
                  or{' '}
                  <Link href="https://example.com/android" className="underline">
                    Android
                  </Link>{' '}
                  to record on the go.
                </Text>
              </Row>
            </Section>

            {/* Section 2: Use Cases */}
            <Section>
              <Row>
                <Text className="text-[16px] font-semibold leading-[26px] text-black">
                  📕 See how other professionals use Loom
                </Text>
              </Row>
              <Row>
                <Text className="text-[16px] leading-[26px] text-black">
                  Loom is versatile: Use it to send a message to a coworker or a
                  video to thousands of customers. Click through our{' '}
                  <Link href="https://example.com/use-cases" className="underline">
                    use cases
                  </Link>{' '}
                  or{' '}
                  <Link href="https://example.com/stories" className="underline">
                    customer stories
                  </Link>{' '}
                  if you need ideas on how to get the most out of video
                  messaging. And if you're at school, check out{' '}
                  <Link href="https://example.com/education" className="underline">
                    ways
                  </Link>{' '}
                  educators are using Loom in the classroom.
                </Text>
              </Row>
            </Section>

            {/* Section 3: Help and Support */}
            <Section>
              <Row>
                <Text className="text-[16px] font-semibold leading-[26px] text-black">
                  🔍 Need help getting started?
                </Text>
              </Row>
              <Row>
                <Text className="text-[16px] leading-[26px] text-black">
                  We've got you covered. Take a look at our{' '}
                  <Link href="https://example.com/getting-started" className="underline">
                    Getting Started
                  </Link>{' '}
                  video series on the basics, and explore the rest of our{' '}
                  <Link href="https://example.com/help" className="underline">
                    help center
                  </Link>{' '}
                  for more answers to your questions.
                </Text>
              </Row>
            </Section>

            {/* Closing */}
            <Section>
              <Row>
                <Text className="text-[16px] leading-[26px] text-black">
                  Happy recording!
                </Text>
              </Row>
            </Section>

            {/* Signature */}
            <Section>
              <Row>
                <Text className="text-[16px] leading-[26px] text-black">
                  Joe
                  <br />
                  Co-founder and CEO
                </Text>
              </Row>
            </Section>

          </Container>

          {/* Footer */}
          <Container className="mx-auto px-8 pb-8">
            <Section>
              <Row>
                <Column>
                  <Text className="mb-1 text-sm text-gray-600">
                    Loom, Inc.
                    <br />
                    140 2nd Street Floor 3
                    <br />
                    San Francisco, CA 94105
                  </Text>
                  <Link href="https://example.com/unsubscribe" className="text-sm text-gray-600 underline">
                    Unsubscribe from our emails
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

export default SaasOnboardingWelcomeEmail`,

  // SYSTEM PROMPT (INLINE STRING, NOT A FUNCTION)
  system: `# SAAS ONBOARDING WELCOME EMAIL DESIGN SYSTEM

You are generating content for a SaaS onboarding welcome email using a proven Loom-inspired template structure.

## VISUAL AESTHETIC

**Style:** Clean, minimal, text-focused, professional
**Mood:** Welcoming, helpful, informative, personal
**Typography:** Inter font family with Helvetica fallback
**Color Palette:**
- Primary: Blue (#2563eb, blue-600) for top border
- Border: Gray-900 (#111827) for side/bottom borders
- Background: Light gray (gray-50, #f9fafb) for page
- Content: White (#ffffff) for main container
- Text: Black for body, gray-600 for footer
- Links: Black text with underline (default)

## LAYOUT STRUCTURE

┌─────────────────────────────────────────────┐ Gray background
│ ╔═══════════════════════════════════════╗ │
│ ║                                         ║ │ ← Blue top border (12px)
│ ├─────────────────────────────────────────┤ │
│ │ [LOGO]                                  │ │
│ │                                         │ │
│ │ Hi Jake,                               │ │
│ │                                         │ │
│ │ Welcome to our growing community...    │ │
│ │                                         │ │
│ │ 💻 Get started by downloading          │ │ ← Emoji header
│ │ To get started, you'll need...         │ │ ← Inline links
│ │                                         │ │
│ │ 📕 See how other professionals use     │ │
│ │ Loom is versatile: Use it to...       │ │
│ │                                         │ │
│ │ 🔍 Need help getting started?          │ │
│ │ We've got you covered...               │ │
│ │                                         │ │
│ │ Happy recording!                       │ │
│ │                                         │ │
│ │ Joe                                    │ │ ← Signature
│ │ Co-founder and CEO                     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Company Name                                │ Footer
│ Address                                     │
│ Unsubscribe from our emails                │
└─────────────────────────────────────────────┘

## DISTINCTIVE FEATURES

### Colored Top Border (12px)
**The signature element of this template**

**Structure**:
- Border width: 12px top, 1px sides/bottom
- Top color: Brand primary (blue-600 #2563eb)
- Other borders: Dark gray (gray-900 #111827)
- Creates a "branded letter" appearance

**Tailwind classes**:
\`\`\`tsx
className="border border-t-[12px] border-solid border-gray-900 border-t-blue-600"
\`\`\`

**Color variations**:
- Blue: border-t-blue-600 (Loom style)
- Purple: border-t-purple-600
- Green: border-t-green-600
- Red: border-t-red-600
- Orange: border-t-orange-600

### Emoji Section Headers
**Visual hierarchy without heavy formatting**

**Format**: [Emoji] [Bold text]

**Examples**:
✅ "💻 Get started by downloading a recorder"
✅ "📕 See how other professionals use [Product]"
✅ "🔍 Need help getting started?"
✅ "🎯 Set up your first project"
✅ "🚀 Launch your account"

**Emoji selection guidelines**:
- 💻 = Technical/download
- 📕 = Learning/resources
- 🔍 = Help/support
- 🎯 = Goals/objectives
- 🚀 = Launch/getting started
- 📹 = Video/recording
- 🎨 = Design/creativity
- 💡 = Tips/ideas
- 👥 = Team/collaboration
- ⚙️ = Settings/configuration

**Styling**:
- Font: 16px (text-[16px])
- Weight: Semibold (font-semibold)
- Line height: 26px (leading-[26px])
- Color: Black

### Text-Heavy with Inline Links
**Content-first approach**

**Body text**:
- Font: 16px (text-[16px])
- Line height: 26px (leading-[26px])
- Color: Black
- Weight: Regular

**Inline links**:
- Color: Black (matches body text)
- Decoration: Underline (className="underline")
- Hover: Maintains underline
- Format: Embedded naturally in sentences

**Link text examples**:
✅ "Download Loom's desktop app for HD recordings"
✅ "Click through our use cases or customer stories"
✅ "Take a look at our Getting Started video series"

**Link placement**: 
- Naturally embedded in sentences
- Multiple links per paragraph acceptable
- Descriptive link text (not "click here")

### Personal Signature
**Founder/CEO signature adds authenticity**

**Format**:
\`\`\`
[Closing phrase]

[Name]
[Title]
\`\`\`

**Example**:
\`\`\`
Happy recording!

Joe
Co-founder and CEO
\`\`\`

**Closing phrase variations**:
- "Happy recording!"
- "Welcome aboard!"
- "Let's get started!"
- "Excited to have you!"
- "Looking forward to working together!"

**Title formats**:
- "Co-founder and CEO"
- "Founder"
- "CEO"
- "Head of Customer Success"
- "[Name], [Product] Team"

### White Box on Gray Background
**Visual containment**

**Page background**: gray-50 (#f9fafb)
**Container background**: white (#ffffff)
**Container spacing**: 
- Margin top: 40px (mt-[40px])
- Margin bottom: 20px (mb-[20px])
- Padding: 32px horizontal (px-8), 32px bottom (pb-8)

**Footer**: Same gray as page background, separate container

## CONTENT GUIDELINES

### Greeting
**Format**: "Hi [Name]," or "Hello [Name],"

**Personalization**:
- Use first name only
- Comma after name
- Warm but professional

### Welcome Paragraph
**Length**: 2-3 sentences (40-60 words)
**Content**:
1. Welcome to community/product
2. Social proof (number of users, companies, etc.)
3. Personal note ("I'm happy you're here")

**Example**:
"Welcome to our growing community of more than 12 million professionals who use Loom to share updates, feedback, and ideas through video messages. I'm happy you're here!"

**Social proof variations**:
- "Join 12 million professionals..."
- "Used by teams at Google, Netflix, and thousands more..."
- "Trusted by 50,000+ companies..."
- "Part of a community of 5 million creators..."

### Section Structure (3 sections typical)

**Section 1: Initial Setup/Download**
- **Title**: Getting started action
- **Content**: What to download/install, where to find it
- **Links**: Direct links to downloads

**Section 2: Use Cases/Inspiration**
- **Title**: How others use the product
- **Content**: Versatility, examples, stories
- **Links**: Use cases, customer stories, examples

**Section 3: Help/Support**
- **Title**: Getting help question
- **Content**: Available resources
- **Links**: Tutorials, help center, documentation

### Section Content Guidelines

**Each section**:
- Title: Emoji + bold text (1 line)
- Body: 2-4 sentences (40-80 words)
- Links: 2-5 inline links embedded naturally
- Spacing: Auto-separated by Section components

**Writing style**:
- Direct and helpful
- Focus on benefits
- Clear next steps
- Lots of resources
- Conversational but professional

### Closing and Signature

**Closing phrases**:
- Keep it short (1-3 words)
- Match product tone
- Encouraging

**Signature**:
- Name only (no "Sincerely" or "Best")
- Title on separate line
- No email address or photo needed

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
- **Body text**: 16px (text-[16px]), line-height 26px (leading-[26px])
- **Section headers**: 16px (text-[16px]), semibold (font-semibold), line-height 26px
- **Footer text**: 14px (text-sm), gray-600
- **All text**: Black for body, gray-600 for footer

### No Visual Hierarchy Needed
- No large headlines
- No bold paragraphs
- Only section headers are bold
- Emoji provides visual breaks

## TAILWIND CLASSES

Key patterns:

### Borders
- \`border\` = 1px border all sides
- \`border-t-[12px]\` = 12px top border
- \`border-solid\` = solid border style
- \`border-gray-900\` = dark gray border color (sides/bottom)
- \`border-t-blue-600\` = blue top border color

### Backgrounds
- \`bg-gray-50\` = page background
- \`bg-white\` = container background

### Spacing
- \`pt-6\` = padding top 24px (page)
- \`mt-[40px]\`, \`mb-[20px]\` = margin top/bottom (container)
- \`px-8\` = padding horizontal 32px
- \`pb-8\`, \`py-8\` = padding bottom/vertical 32px

### Typography
- \`text-[16px]\` = 16px font size
- \`text-sm\` = 14px font size
- \`leading-[26px]\` = 26px line height
- \`font-semibold\` = semibold weight
- \`text-black\` = black text
- \`text-gray-600\` = gray text (footer)
- \`underline\` = underlined links

### Utilities
- \`antialiased\` = smooth text rendering
- \`mx-auto\` = center horizontally
- \`my-auto\` = center vertically

## TONE AND VOICE

**Overall Tone:** Welcoming, helpful, informative, personal

**Do:**
- Be warm and welcoming
- Use "I" and "you" (personal)
- Provide clear next steps
- Link to lots of resources
- Keep it conversational
- Make it helpful, not salesy
- Sign with real name and title

**Don't:**
- Be too formal or corporate
- Overwhelm with too much information
- Use marketing jargon
- Forget the personal signature
- Make it all about features
- Skip the social proof
- Use generic closings ("Sincerely")

## CONTENT STRUCTURE VARIATIONS

### For Video/Recording Tools
- Section 1: Download recorders (desktop, mobile, browser)
- Section 2: Use cases and examples
- Section 3: Tutorials and help

### For Design/Creative Tools
- Section 1: Install apps or access platform
- Section 2: Browse templates or examples
- Section 3: Tutorials and community

### For Productivity Tools
- Section 1: Set up workspace or integrations
- Section 2: Learn workflows and best practices
- Section 3: Help center and support

### For Collaboration Tools
- Section 1: Invite team and set permissions
- Section 2: See how other teams use it
- Section 3: Getting started guides

## ANTI-PATTERNS

❌ **Don't skip the colored top border** - It's the signature element
❌ **Don't use buttons instead of inline links** - Text-first approach
❌ **Don't skip emojis in section headers** - They provide visual hierarchy
❌ **Don't forget personal signature** - CEO/founder signature adds trust
❌ **Don't make paragraphs too long** - 2-4 sentences max per section
❌ **Don't use images beyond logo** - Text-focused template
❌ **Don't skip social proof** - Community size/user count in welcome
❌ **Don't be too formal** - Conversational but professional

## EXAMPLE CONTENT SETS

### Video Recording Tool (Loom-style)
- Welcome: "12 million professionals use Loom..."
- Section 1: Download desktop app, Chrome extension, mobile
- Section 2: Use cases, customer stories
- Section 3: Getting started video series, help center
- Closing: "Happy recording!"

### Design Platform (Figma-style)
- Welcome: "Join thousands of design teams..."
- Section 1: Download desktop app, install fonts
- Section 2: Browse community files, design systems
- Section 3: Tutorial videos, keyboard shortcuts
- Closing: "Happy designing!"

### Project Management (Asana-style)
- Welcome: "Trusted by teams at 100,000+ companies..."
- Section 1: Create first project, invite team
- Section 2: See how other teams organize work
- Section 3: Getting started guide, templates
- Closing: "Let's get organized!"

### Communication Tool (Slack-style)
- Welcome: "Join millions of teams collaborating..."
- Section 1: Download apps, set up workspace
- Section 2: Browse integrations, see use cases
- Section 3: Tips and tricks, help center
- Closing: "Happy collaborating!"

---

**Follow the example email structure exactly, including the 12px colored top border, emoji section headers, text-heavy content with inline links, personal signature from founder/CEO, and simple footer on gray background.**`,
};

export default SaasOnboardingWelcomeDesignSystem;

