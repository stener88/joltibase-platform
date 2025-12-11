/**
 * PRODUCT HUNT LAUNCH EMAIL DESIGN SYSTEM
 * 
 * Specialized design for Product Hunt launch day announcements.
 * Features the iconic PH orange, upvote CTAs, and community engagement focus.
 *
 * Use cases:
 * - Product Hunt launch day announcements
 * - "We're Live on PH" emails
 * - Launch day support requests
 * - Upvote campaigns
 * - Launch milestone updates
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const ProductHuntLaunchDesignSystem: DesignSystem = {
  id: 'product-hunt-launch',
  name: 'Product Hunt Launch',
  description:
    'High-energy launch announcement with Product Hunt branding, upvote CTAs, and social sharing. Perfect for launch day momentum building.',

  // KEYWORD TRIGGERS
  triggers: [
    'product hunt',
    'producthunt',
    'launching on product hunt',
    "we're live on product hunt",
    'upvote',
    'launch on PH',
    'product hunt launch',
    'live on product hunt',
    'launching today',
    'hunter',
    'launch day',
    'support our launch',
    'vote for us',
    'PH launch',
    'product of the day',
  ],

  // IMAGE KEYWORDS
  imageKeywords: {
    hero: ['product', 'launch', 'celebration', 'rocket'],
    feature: ['app', 'dashboard', 'interface', 'screenshot'],
    product: ['laptop', 'mobile', 'device', 'mockup'],
    background: ['gradient', 'orange', 'vibrant', 'energy'],
    people: ['team', 'celebration', 'success', 'cheering'],
  },

  // COMPLETE DESIGN SYSTEM SPECIFICATION
  system: `
# PRODUCT HUNT LAUNCH EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: High energy, urgent, community-driven. Make upvoting feel like supporting a friend, not clicking an ad.

This design system prioritizes:
- **Urgency & Momentum**: Launch day is time-sensitive, create FOMO
- **Community Appeal**: Personal ask, not corporate announcement
- **Social Proof**: Show hunters, makers, early supporters
- **Clear CTA**: Giant orange upvote button impossible to miss
- **Authentic Voice**: Founder-level intimacy, not marketing speak

**Target Audience**: Existing users, newsletter subscribers, friends of founders, early supporters
**Goal**: Maximize upvotes in first 24 hours, reach #1 Product of the Day

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
Main Headline (Launch Announcement)
├─ Size: text-4xl (36px) or text-5xl (48px)
├─ Weight: font-extrabold (800)
├─ Line Height: 1.1 (tight)
├─ Color: text-gray-900 (#111827)
├─ Emoji: 🚀 (optional but encouraged)
├─ Margin: 0 0 16px 0
└─ Usage: "We're Live on Product Hunt! 🚀"

Subheadline (Personal Ask)
├─ Size: text-xl (20px) or text-2xl (24px)
├─ Weight: font-semibold (600)
├─ Line Height: 1.4
├─ Color: text-gray-700 (#374151)
├─ Margin: 0 0 24px 0
└─ Usage: "Your support today could make us #1"

Body Copy (Launch Story)
├─ Size: text-base (16px) or text-lg (18px)
├─ Weight: font-normal (400)
├─ Line Height: 1.7
├─ Color: text-gray-900 (#111827)
├─ Margin: 0 0 16px 0
└─ Usage: Paragraphs, story, context

Call-Out Text (Why Now Matters)
├─ Size: text-lg (18px)
├─ Weight: font-medium (500)
├─ Style: Italic
├─ Color: text-gray-700 (#374151)
├─ Background: bg-orange-50 (light orange tint)
├─ Padding: 16px
├─ Border: Left border 4px solid #FF6154
├─ Margin: 24px 0
└─ Usage: "Launch day votes matter 10x more than later votes"

Product Name
├─ Size: Inherit from context
├─ Weight: font-bold (700)
├─ Color: text-[#FF6154] (Product Hunt orange)
├─ Usage: Inline product name mentions

Signature/Footer
├─ Size: text-base (16px)
├─ Weight: font-normal (400)
├─ Color: text-gray-700 (#374151)
├─ Margin: 32px 0 0 0
└─ Usage: Founder name, team signature
\`\`\`

---

## 🎨 COLOR PALETTE

### Primary Colors (Product Hunt Brand)

\`\`\`
Product Hunt Orange: #FF6154 (rgb(255, 97, 84))
  - Use for: Primary CTAs, upvote buttons, product name, accents
  - Classes: bg-[#FF6154], text-[#FF6154]
  - Hover: #FF4E3D (darker)

PH Orange Light: #FFE5E2 or #FFF3F2
  - Use for: Background tints, call-out boxes
  - Classes: bg-orange-50, bg-orange-100

Dark Text: #111827 (gray-900)
  - Use for: Headlines, body text
  - Classes: text-gray-900

Medium Text: #374151 (gray-700)
  - Use for: Subheadlines, secondary text
  - Classes: text-gray-700

Light Gray: #6B7280 (gray-500)
  - Use for: Meta info, footer text
  - Classes: text-gray-500
\`\`\`

### Background Colors

\`\`\`
Page Background: bg-gray-50 (#F9FAFB)
  - Use for: <Body> background
  - Classes: bg-gray-50

Container Background: bg-white (#FFFFFF)
  - Use for: Main <Container> background
  - Classes: bg-white

Call-Out Background: bg-orange-50 (#FFF7ED or #FFE5E2)
  - Use for: Urgency messages, call-outs
  - Classes: bg-orange-50
\`\`\`

### Accent Colors

\`\`\`
Success Green: #10B981 (green-500)
  - Use for: "Already live" status, success indicators
  - Classes: bg-green-500, text-green-500

White: #FFFFFF
  - Use for: Button text on orange background
  - Classes: text-white
\`\`\`

---

## 🏗️ LAYOUT STRUCTURE

### Container System (React Email Components)

\`\`\`tsx
// STANDARD LAYOUT - Clean white card on subtle background
<Body className="mx-auto my-auto bg-gray-50 pt-6 font-sans antialiased">
  <Container className="mx-auto my-[40px] max-w-[600px] bg-white px-10 py-10">
    // All sections here
  </Container>
</Body>
\`\`\`

### Section Spacing Guidelines

\`\`\`
Top Badge/Label (Optional)
├─ Margin: 0 0 16px 0
├─ Padding: 8px 16px
├─ Background: bg-orange-50
├─ Border Radius: rounded-full
└─ Text: "🔥 Launch Day" or "⏰ Live Now"

Headline Section
├─ Margin: 0 0 16px 0
├─ Padding: 0
└─ Alignment: Center or left

Subheadline/Ask
├─ Margin: 0 0 24px 0
└─ Alignment: Match headline

Hero Image/Screenshot
├─ Margin: 0 0 32px 0
├─ Width: 100%
├─ Border Radius: rounded-lg (8px)
└─ Box Shadow: Optional subtle shadow

Primary CTA (Upvote Button)
├─ Margin: 0 0 32px 0
├─ Padding: 16px 32px
├─ Font Size: 18px
├─ Border Radius: rounded-lg (8px)
└─ Alignment: Center

Body Story/Context
├─ Margin: 0 0 24px 0
├─ Line Height: 1.7
└─ Paragraph Spacing: 16px between

Call-Out Box (Urgency)
├─ Margin: 24px 0
├─ Padding: 16px 20px
├─ Border: Left 4px solid #FF6154
├─ Background: bg-orange-50
└─ Font Style: italic

Social Sharing Section
├─ Margin: 32px 0
├─ Icon Size: 40px × 40px
├─ Spacing: 12px between icons
└─ Alignment: Center

Founder Signature
├─ Margin: 48px 0 0 0
├─ Includes: Name, title, photo (optional)
└─ Alignment: Left

Footer Meta
├─ Margin: 32px 0 0 0
├─ Border: Top 1px solid gray-200
├─ Padding: 24px 0 0 0
└─ Font Size: text-sm (14px)
\`\`\`

---

## 🔧 COMPONENT PATTERNS

### PATTERN 1: Launch Day Badge (Optional)
**When to use**: Top of email, creates immediate context
**Purpose**: Signal urgency and live status

\`\`\`tsx
<Section className="mb-4">
  <Row>
    <Column align="center">
      <div className="inline-block rounded-full bg-orange-50 px-4 py-2">
        <Text className="m-0 text-sm font-semibold text-[#FF6154]">
          🔥 Live Now on Product Hunt
        </Text>
      </div>
    </Column>
  </Row>
</Section>
\`\`\`

**Variations**:
- "⏰ Launch Day - First 24 Hours"
- "🚀 We're Live!"
- "🎉 Product Hunt Launch"

---

### PATTERN 2: Hero Headline
**When to use**: First major text element
**Purpose**: Announce launch, create excitement

\`\`\`tsx
<Section className="mb-6">
  <Row>
    <Column>
      <Text className="m-0 text-center text-4xl font-extrabold leading-tight text-gray-900">
        We're Live on <span className="text-[#FF6154]">Product Hunt</span>! 🚀
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Always include "Product Hunt" in orange
- Use emoji (🚀 🎉 🔥 most common)
- Keep to 8-12 words
- Center aligned for impact
- Can mention product name: "[Product] is Live on Product Hunt!"

**Examples**:
- ✅ "We're Live on Product Hunt! 🚀"
- ✅ "Today's the Day! We Launched on Product Hunt 🎉"
- ✅ "[Product Name] is Now Live on Product Hunt! 🔥"
- ❌ "Product Hunt Launch Announcement" (too formal)

---

### PATTERN 3: Personal Ask / Subheadline
**When to use**: Immediately after headline
**Purpose**: Make it personal, explain why their support matters

\`\`\`tsx
<Section className="mb-6">
  <Row>
    <Column>
      <Text className="m-0 text-center text-xl font-semibold text-gray-700">
        Your upvote today could help us reach #1 Product of the Day 🏆
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Make it personal: "Your support", "You can help", "We need you"
- Mention goal: "#1", "top spot", "feature"
- Conversational tone, not corporate
- Can include time constraint: "in the next 12 hours"

**Examples**:
- "Your support in the first 24 hours makes all the difference"
- "One click from you could change everything for our small team"
- "Help us show the world what we've been building"

---

### PATTERN 4: Product Screenshot / Hero Image
**When to use**: After headline, before CTA
**Purpose**: Show what you built, visual interest

\`\`\`tsx
<Section className="mb-8">
  <Row>
    <Column>
      <Link href="[PRODUCT_HUNT_URL]">
        <Img
          src="[PRODUCT_SCREENSHOT_URL]"
          alt="[Product Name] interface showing [key feature]"
          className="w-full rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Link>
    </Column>
  </Row>
</Section>
\`\`\`

**Image Specs**:
- Width: 600px (scales responsively)
- Format: PNG or JPG
- Content: Product screenshot, mockup, or hero image
- Border Radius: 8px (rounded-lg)
- Optional: Subtle shadow for depth

**Guidelines**:
- Show your best feature/screen
- Clean, professional screenshot
- Avoid text-heavy screens
- Link wraps image → clicks go to PH

---

### PATTERN 5: Primary CTA - Upvote Button
**When to use**: After image, most prominent element
**Purpose**: The single most important action

\`\`\`tsx
<Section className="mb-8">
  <Row>
    <Column align="center">
      <Button
        href="[PRODUCT_HUNT_URL]"
        className="rounded-lg bg-[#FF6154] px-8 py-4 text-center text-lg font-bold text-white no-underline"
        style={{
          backgroundColor: '#FF6154',
          color: '#ffffff',
          textDecoration: 'none'
        }}
      >
        🔺 Upvote [Product Name] on Product Hunt
      </Button>
    </Column>
  </Row>
</Section>
\`\`\`

**Button Specs**:
- Background: #FF6154 (PH orange)
- Text: White, bold, 18px
- Padding: 16px 32px (generous)
- Border Radius: 8px (rounded-lg)
- Emoji: 🔺 (upvote triangle) optional but recommended
- Hover State: Darker orange #FF4E3D

**CTA Copy Options**:
- "🔺 Upvote [Product] on Product Hunt"
- "🚀 Support Our Launch - Upvote Now"
- "👍 Give Us Your Upvote"
- "🔥 Upvote Us on Product Hunt"

**Guidelines**:
- NEVER say "Click here"
- Always include product name
- Emoji adds personality
- Keep under 6 words when possible

---

### PATTERN 6: Launch Story / Context
**When to use**: After primary CTA
**Purpose**: Explain what you built, why it matters

\`\`\`tsx
<Section className="mb-6">
  <Row>
    <Column>
      <Text className="m-0 mb-4 text-base leading-relaxed text-gray-900">
        After [X months/years] of building in public, we're finally ready to share 
        <span className="font-bold text-[#FF6154]"> [Product Name]</span> with the world.
      </Text>
      <Text className="m-0 mb-4 text-base leading-relaxed text-gray-900">
        [Product Name] helps [target audience] [solve problem] by [unique solution]. 
        We've already helped [social proof metric] and we're just getting started.
      </Text>
      <Text className="m-0 text-base leading-relaxed text-gray-900">
        Launching on Product Hunt today is a huge milestone for our small team, 
        and your support means everything to us.
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- 2-4 short paragraphs max
- Mix facts with emotion
- Include social proof (users, metrics)
- Personal pronouns: "we", "our", "us"
- Product name in orange when mentioned
- Keep conversational, not salesy

**Story Arc**:
1. **Context**: How long you've been building
2. **What**: What problem you solve
3. **Proof**: Early traction/validation
4. **Ask**: Why their support matters

---

### PATTERN 7: Urgency Call-Out Box
**When to use**: Mid-email, after story
**Purpose**: Explain why timing matters

\`\`\`tsx
<Section className="my-6">
  <Row>
    <Column>
      <div 
        className="rounded-lg bg-orange-50 p-4" 
        style={{ 
          borderLeft: '4px solid #FF6154',
          backgroundColor: '#FFF7ED'
        }}
      >
        <Text className="m-0 text-base italic text-gray-700">
          ⏰ <strong>Why launch day matters:</strong> Product Hunt's algorithm prioritizes 
          votes in the first 24 hours. Your early support gives us the momentum we need 
          to reach the top of the leaderboard and get discovered by thousands.
        </Text>
      </div>
    </Column>
  </Row>
</Section>
\`\`\`

**Variants**:
- Explain PH algorithm importance
- Mention time-sensitive nature (24 hours)
- Share milestone goal ("#1 Product of the Day")
- Thank early supporters

**Guidelines**:
- Light orange background (#FFF7ED or #FFE5E2)
- Left border 4px solid #FF6154
- Italic text for emphasis
- Include emoji (⏰ 🎯 💡)
- Keep to 2-3 sentences

---

### PATTERN 8: What You'll Get / Product Benefits
**When to use**: Optional, if space allows
**Purpose**: Quick feature highlights

\`\`\`tsx
<Section className="mb-8">
  <Row>
    <Column>
      <Text className="m-0 mb-4 text-xl font-bold text-gray-900">
        What makes [Product] different?
      </Text>
    </Column>
  </Row>
  <Row>
    <Column>
      <ul className="m-0 space-y-3 pl-5">
        <li>
          <Text className="m-0 text-base text-gray-900">
            <strong>Feature 1:</strong> Brief benefit description
          </Text>
        </li>
        <li>
          <Text className="m-0 text-base text-gray-900">
            <strong>Feature 2:</strong> Brief benefit description
          </Text>
        </li>
        <li>
          <Text className="m-0 text-base text-gray-900">
            <strong>Feature 3:</strong> Brief benefit description
          </Text>
        </li>
      </ul>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- 3-5 features max
- Bullet points for scannability
- Bold feature names
- Benefit-focused, not feature-focused
- Keep each to one line

---

### PATTERN 9: Social Sharing Section (Optional)
**When to use**: After main CTA, if encouraging shares
**Purpose**: Amplify reach beyond email

\`\`\`tsx
<Section className="my-8">
  <Row>
    <Column align="center">
      <Text className="m-0 mb-4 text-center text-base font-semibold text-gray-700">
        Help us spread the word:
      </Text>
      <Row className="inline-flex gap-3">
        <Column className="inline-block">
          <Link href="[TWITTER_SHARE_URL]">
            <Img
              src="https://cdn.simpleicons.org/x/000000"
              width="24"
              height="24"
              alt="Share on Twitter"
              className="rounded-full"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="inline-block">
          <Link href="[LINKEDIN_SHARE_URL]">
            <Img
              src="https://cdn.simpleicons.org/linkedin/0A66C2"
              width="24"
              height="24"
              alt="Share on LinkedIn"
              className="rounded-full"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="inline-block">
          <Link href="[FACEBOOK_SHARE_URL]">
            <Img
              src="https://cdn.simpleicons.org/facebook/1877F2"
              width="24"
              height="24"
              alt="Share on Facebook"
              className="rounded-full"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
      </Row>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Optional, but valuable for amplification
- 3-4 social networks max
- 24px × 24px icons (slightly smaller for in-content sharing)
- Pre-filled share URLs with launch message
- Simple icon row, not buttons

---

### PATTERN 10: Secondary CTA (Repeat)
**When to use**: Near end of email
**Purpose**: Give readers another chance to upvote

\`\`\`tsx
<Section className="my-8">
  <Row>
    <Column align="center">
      <Button
        href="[PRODUCT_HUNT_URL]"
        className="rounded-lg bg-[#FF6154] px-8 py-4 text-center text-lg font-bold text-white no-underline"
        style={{
          backgroundColor: '#FF6154',
          color: '#ffffff',
          textDecoration: 'none'
        }}
      >
        Upvote Now on Product Hunt 🚀
      </Button>
      <Text className="mt-4 text-center text-sm text-gray-500">
        It only takes 2 seconds (and means the world to us)
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Same styling as primary CTA
- Different copy (avoid repetition)
- Optional sub-text explaining ease ("2 seconds")
- Good for long emails

---

### PATTERN 11: Founder Signature / Personal Note
**When to use**: End of email, before footer
**Purpose**: Personal connection, authenticity

\`\`\`tsx
<Section className="mt-12">
  <Row>
    <Column>
      <Text className="m-0 mb-2 text-base text-gray-900">
        Thank you for being part of our journey,
      </Text>
      <Text className="m-0 mb-1 text-base font-semibold text-gray-900">
        [Founder Name]
      </Text>
      <Text className="m-0 text-sm text-gray-500">
        Founder & CEO, [Company Name]
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**With Founder Photo** (Optional):
\`\`\`tsx
<Section className="mt-12">
  <Row>
    <Column className="w-16">
      <Img
        src="[FOUNDER_PHOTO_URL]"
        width="64"
        height="64"
        alt="[Founder Name]"
        className="rounded-full"
        style={{ width: '64px', height: '64px', borderRadius: '50%' }}
      />
    </Column>
    <Column className="pl-4">
      <Text className="m-0 mb-2 text-base text-gray-900">
        Thank you for being part of our journey,
      </Text>
      <Text className="m-0 mb-1 text-base font-semibold text-gray-900">
        [Founder Name]
      </Text>
      <Text className="m-0 text-sm text-gray-500">
        Founder & CEO
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Personal, warm tone
- Real founder name (not "The Team")
- Optional photo (64px circle)
- Keep signature simple
- Can add P.S. for extra ask

---

### PATTERN 12: Footer
**When to use**: Bottom of every email
**Purpose**: Legal compliance, secondary links

\`\`\`tsx
<Section className="mt-12 border-t border-gray-200 pt-6">
  <Row>
    <Column>
      <Text className="m-0 text-center text-xs text-gray-500">
        [Company Name] • [Website URL]
      </Text>
      <Text className="mt-2 text-center text-xs text-gray-500">
        <Link href="[UNSUBSCRIBE_URL]" className="text-gray-500 underline">
          Unsubscribe
        </Link>
        {" • "}
        <Link href="[PRODUCT_HUNT_URL]" className="text-gray-500 underline">
          View on Product Hunt
        </Link>
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Minimal, don't distract from CTAs above
- Include Product Hunt link as fallback
- Standard unsubscribe compliance
- Small text (12px)
- Center aligned

---

## 📋 CONTENT GUIDELINES

### Email Structure (Recommended Flow)

**Optimal Layout** (600-800 words):
1. Launch badge (optional)
2. Hero headline
3. Personal ask subheadline
4. Product screenshot
5. **PRIMARY CTA** (upvote button)
6. Launch story (2-3 paragraphs)
7. Urgency call-out box
8. Benefits/features (optional, 3-5 bullets)
9. Social sharing (optional)
10. **SECONDARY CTA** (upvote button)
11. Founder signature
12. Footer

**Minimal Layout** (300-400 words):
1. Hero headline
2. Product screenshot
3. **PRIMARY CTA**
4. Brief story (1-2 paragraphs)
5. Urgency note
6. **SECONDARY CTA**
7. Signature
8. Footer

---

### Headline Writing Principles

**Formula**: [Status] + [Product Hunt] + [Emoji]

**Examples**:
- "We're Live on Product Hunt! 🚀"
- "Today's the Day - [Product] Launches on Product Hunt 🎉"
- "[Product] is Now on Product Hunt! 🔥"

**Guidelines**:
- Always mention "Product Hunt" explicitly
- Use emoji for energy (🚀 🎉 🔥 most common)
- Present tense ("We're live" not "We launched")
- Exclamation point for excitement
- Keep under 10 words

---

### Body Copy Best Practices

**Tone**:
- Excited but humble
- Personal, not corporate
- Grateful, not entitled
- Urgent without being pushy

**Do's**:
- ✅ "We'd be so grateful"
- ✅ "Your support means everything"
- ✅ "Help us show the world"
- ✅ Include specific metrics/traction
- ✅ Mention how long you've been building
- ✅ Explain Product Hunt's 24-hour window

**Don'ts**:
- ❌ "You must upvote"
- ❌ "Click here"
- ❌ Long company history
- ❌ Technical jargon
- ❌ Multiple different asks (stay focused on upvote)

---

### Urgency Messaging

**Why it matters**:
- "Launch day votes count 10x more than later votes"
- "Product Hunt's algorithm prioritizes the first 24 hours"
- "Early momentum determines if we get featured"
- "The first 6 hours are critical for reaching #1"

**Goal framing**:
- "Help us reach #1 Product of the Day"
- "We're aiming for the top 5"
- "Every upvote pushes us up the leaderboard"

---

### Voice & Tone

**Spectrum**: Startup Founder → Friend Asking a Favor

**Characteristics**:
- **Personal**: Use "I", "we", "us", "our small team"
- **Grateful**: "Thank you", "we'd be honored", "means the world"
- **Excited**: Emojis, exclamation points (in moderation)
- **Vulnerable**: "Nervous but excited", "huge milestone", "been dreaming of this"
- **Direct**: Clear ask, no beating around the bush

**Avoid**:
- Corporate marketing speak
- Overly formal language
- Passive voice
- Excessive self-promotion
- Demanding tone

---

## ✅ QUALITY CHECKLIST

Before sending/generating:

### Content
- [ ] Headline mentions "Product Hunt" in orange
- [ ] Primary CTA button is Product Hunt orange (#FF6154)
- [ ] At least ONE clear upvote CTA (ideally two)
- [ ] Launch story explains what you built (2-3 paragraphs)
- [ ] Urgency messaging explains why timing matters
- [ ] Personal founder signature included
- [ ] Tone is personal, not corporate
- [ ] Product Hunt link is correct and functional

### Design
- [ ] Product screenshot included and linked
- [ ] Primary CTA is large, orange, impossible to miss
- [ ] Typography hierarchy is clear (headline > subhead > body)
- [ ] Spacing is generous (not cramped)
- [ ] Orange (#FF6154) used for brand moments only
- [ ] Email is 600-800 words max (concise)
- [ ] Founder photo (if included) is professional

### Technical
- [ ] All CTAs link to correct Product Hunt URL
- [ ] Images have descriptive alt text
- [ ] Email renders well on mobile
- [ ] No broken links
- [ ] Unsubscribe link present
- [ ] Product Hunt URL uses tracking (if applicable)

### Emotional Impact
- [ ] Reader feels personally asked (not mass marketed)
- [ ] Urgency creates FOMO without being pushy
- [ ] Story creates empathy/connection with founder
- [ ] Clear why their upvote matters
- [ ] Makes them WANT to help, not feel obligated

---

## 🎯 EXAMPLE USE CASES

### Example 1: Simple Launch Announcement
\`\`\`
Generate a Product Hunt launch email for our project management tool "TaskFlow". 
We've been building for 8 months, have 500 beta users, and are going for 
Product of the Day. Founder is Sarah Chen, CEO.
\`\`\`

### Example 2: Launch with Backstory
\`\`\`
Create a Product Hunt launch email for "CodeSnap" (screenshot tool for developers). 
Built by solo founder after getting frustrated with existing tools. Mention it's 
been a 2-year journey and this launch is the culmination. Ask for upvotes to 
reach #1.
\`\`\`

### Example 3: Team Launch
\`\`\`
Write a PH launch email for "TeamSync" (async collaboration tool). Small team of 
3 indie hackers. Already have 1,200 users from HackerNews launch. Today is our 
Product Hunt debut. Include urgency about 24-hour window.
\`\`\`

---

## 💡 PRO TIPS

### Timing Best Practices
- Send email at launch time (12:01 AM PST)
- Follow up 6-8 hours later to people who didn't click
- Final push 2-3 hours before day ends

### Segmentation Strategy
- **Highest priority**: Existing users, newsletter subscribers
- **Medium priority**: Social media followers, past customers
- **Low priority**: Cold outreach (focus on warm network)

### A/B Testing Ideas
- Headline with vs without emoji
- One CTA vs two CTAs
- Short email (300 words) vs detailed (600 words)
- Founder photo vs no photo

### Post-Launch Follow-Up
- Thank you email to everyone who upvoted
- Results announcement ("We hit #3!")
- Special offer for supporters (optional)

---

## 🚫 COMMON MISTAKES TO AVOID

❌ **Burying the CTA**: Upvote button must be above the fold
❌ **Too much product detail**: This is a support ask, not a product demo
❌ **No urgency**: Must explain why TODAY matters
❌ **Multiple asks**: Don't ask for upvote + sign up + follow + share (pick one: upvote)
❌ **Corporate tone**: "We are pleased to announce" → "We're so excited!"
❌ **No founder signature**: Makes it feel like a marketing email
❌ **Wrong orange**: Use #FF6154, not any random orange
❌ **Forgetting mobile**: 50%+ will read on phone, test it

---

END OF DESIGN SYSTEM SPECIFICATION
`,
};

export default ProductHuntLaunchDesignSystem;

