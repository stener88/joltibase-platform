/**
 * SAAS PRODUCT UPDATE EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating modern, professional product update emails.
 * Optimized for: SaaS companies, product announcements, feature launches, integrations
 * 
 * Target Audience: Existing customers, product users, business professionals
 * Goal: Inform, engage, drive feature adoption
 * 
 * Based on: Miro, Notion, Linear, Figma product update emails
 */

export const SaaSProductUpdateDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'saas-product-update',
  name: 'SaaS Product Update',
  description: 'Modern, professional design for product announcements and feature updates',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   */
  triggers: [
    // Product update keywords
    'new feature', 'product update', 'announcement', 'integration', 
    'now available', 'just launched', 'introducing', 'release notes',
    'what\'s new', 'latest update', 'version', 'upgrade',
    
    // Integration keywords
    'integrate', 'integration', 'connect', 'sync', 'workflow',
    'automation', 'app', 'marketplace', 'plugin', 'extension',
    
    // Feature keywords
    'supercharge', 'boost productivity', 'streamline', 'enhance',
    'powerful', 'collaboration', 'team', 'workspace',
    
    // SaaS tool names
    'slack', 'google', 'microsoft', 'notion', 'miro', 'figma',
    'asana', 'trello', 'jira', 'github', 'gitlab',
    
    // Action keywords
    'browse', 'explore', 'discover', 'try it out', 'get started',
    'learn more', 'check it out', 'dive in', 'see how'
  ],
  
  /**
   * Image keywords for this design system
   */
  imageKeywords: {
    hero: ['app interface', 'dashboard', 'software', 'collaboration'],
    feature: ['icons', 'ui elements', 'integrations', 'technology'],
    product: ['product screenshot', 'app screen', 'interface'],
    background: ['abstract tech', 'gradient', 'modern'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# SAAS PRODUCT UPDATE EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Clear, modern, action-oriented. Help users understand and adopt new features quickly.

This design system prioritizes:
- **Clarity**: Straightforward messaging, scannable content
- **Professionalism**: Clean layouts, consistent spacing
- **Action-Oriented**: Clear CTAs, easy next steps
- **Brand Consistency**: Modern SaaS aesthetic
- **Mobile-First**: Responsive, works on all devices

**Target Audience**: Existing customers, active users, product champions

**Goal**: Drive feature awareness and adoption, strengthen product engagement

---

## 📐 TYPOGRAPHY SYSTEM

### Font Stack
\`\`\`
Primary: Inter (web font from Google Fonts)
Fallback: Helvetica, Arial, sans-serif
Weight Range: 400 (regular), 600 (semibold), 700 (bold)

IMPORTANT: Always include Inter web font in <Head>:
<Font
  fontFamily="Inter"
  fallbackFontFamily="Helvetica"
  webFont={{
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    format: 'woff2',
  }}
  fontWeight={400}
  fontStyle="normal"
/>
\`\`\`

### Hierarchy & Sizing

\`\`\`
H1 (Main Headline - Feature Announcement)
├─ Size: text-[34px] (34px)
├─ Weight: font-bold (700)
├─ Font: Inter
├─ Line Height: default (1.2)
├─ Color: text-gray-900 (#111827)
├─ Letter Spacing: tracking-tight
├─ Text Align: text-center
└─ Classes: "text-center text-[34px] font-bold tracking-tight text-gray-900"

H2 (Section Heading)
├─ Size: text-[26px] (26px)
├─ Weight: font-bold (700)
├─ Line Height: leading-9 (2.25rem)
├─ Color: text-gray-900 (#111827)
├─ Letter Spacing: tracking-tight
└─ Classes: "text-[26px] font-bold leading-9 tracking-tight text-gray-900"

Body Text (Primary - Hero/Intro)
├─ Size: text-[16px] (16px)
├─ Weight: font-normal (400)
├─ Line Height: default
├─ Color: text-gray-900 (#111827)
├─ Text Align: text-center (for hero)
└─ Classes: "text-center text-[16px] text-gray-900"

Body Text (Small - List Items)
├─ Size: text-sm (14px)
├─ Weight: font-normal (400)
├─ Line Height: default
├─ Color: text-gray-900 (#111827)
└─ Classes: "text-sm text-gray-900"

Link Text (Inline)
├─ Size: inherit
├─ Weight: font-bold (700)
├─ Color: text-blue-600 (#2563eb)
├─ Text Decoration: none (add underline on hover if desired)
└─ Classes: "font-bold text-blue-600"

Link Text (Footer)
├─ Size: text-xs (12px)
├─ Weight: font-semibold (600)
├─ Color: text-gray-500 (#6b7280)
├─ Text Decoration: underline
└─ Classes: "text-xs text-gray-500 underline" or "font-semibold text-gray-500 underline"

Footer Text
├─ Size: text-xs (12px)
├─ Weight: font-normal (400)
├─ Line Height: default
├─ Color: text-gray-500 (#6b7280)
└─ Classes: "text-xs text-gray-500"

Signature Text
├─ Size: text-[16px] (16px)
├─ Weight: font-normal (400)
├─ Color: text-gray-900 (#111827)
├─ Margin: m-0 (no default margin)
└─ Classes: "m-0 text-[16px] text-gray-900"
\`\`\`

---

## 🎨 COLOR PALETTE

### Primary Colors (Tailwind Classes)
\`\`\`
Primary Blue: bg-blue-600 (#2563eb) - CTAs, links, brand accents
  - Use for: Button backgrounds, link text
  - Classes: bg-blue-600, text-blue-600

Dark Gray: text-gray-900 (#111827) - Primary text, headings
  - Use for: All body text, headings
  - Classes: text-gray-900

Medium Gray: text-gray-500 (#6b7280) - Footer, secondary text
  - Use for: Footer text, disclaimers, metadata
  - Classes: text-gray-500
\`\`\`

### Background Colors
\`\`\`
Page Background: bg-gray-100/70 (#f3f4f6 with 70% opacity)
  - Use for: Outer <Body> background
  - Classes: bg-gray-100/70

Card Background: bg-white (#ffffff)
  - Use for: Main <Container> background
  - Classes: bg-white
  - Style: { borderRadius: '8px', border: 'none' }

White: #ffffff
  - Use for: Text on blue buttons, card backgrounds
  - Classes: text-white, bg-white
\`\`\`

### Accent Colors (Use Sparingly)
\`\`\`
Success Green: #10b981 - Success states, confirmation
Warning Yellow: #f59e0b - Beta badges, alerts
Subtle Border: #e5e7eb - Dividers (rarely needed with Tailwind)
\`\`\`

---

## 🏗️ LAYOUT STRUCTURE

### Container System (React Email Components)

\`\`\`tsx
// OUTER BODY - Full viewport background
<Body className="mx-auto my-auto bg-gray-100/70 pt-6 font-sans text-gray-900 antialiased">
  // INNER CONTAINER - Centered white card (no border)
  <Container className="mx-auto my-[40px] max-w-[600px] bg-white">
    // SECTIONS - Individual content blocks
    <Section className="px-8 py-8"> ... </Section>
  </Container>
</Body>
\`\`\`

### Section Spacing Guidelines

\`\`\`
Logo Header
├─ Padding: px-8 py-8 (32px horizontal, 32px vertical)
├─ Logo Size: 120px × 48px
└─ Alignment: Left (default)

Hero Section (Headline + Intro)
├─ Padding: px-10 (40px horizontal)
├─ Vertical Spacing: Standard section padding
└─ Text Alignment: Center

Content Section (Body Paragraphs)
├─ Padding: px-10 (40px horizontal)
├─ Vertical Spacing Between: mt-10 (40px)
└─ Text Alignment: Center (hero), left (lists)

CTA Button Section
├─ Padding: mt-10 (40px top)
├─ Alignment: Column align="center"
└─ Button: rounded-full bg-blue-600 px-6 py-3

Feature Image
├─ Margin: mt-16 (64px top)
├─ Width: w-full (100%)
└─ Classes: "w-full" or specific width like "w-[220px]"

Feature List Section
├─ Padding: px-10 (40px horizontal)
├─ List Padding: pt-10 (40px top)
└─ Column Layout: Two columns (50% each)

Signature Section
├─ Padding: px-10 pb-10 pt-14 (40px sides, 40px bottom, 56px top)
├─ Text Spacing: mt-1 between lines
└─ Margin: m-0 on text elements

Footer Social Links
├─ Alignment: Column align="center"
├─ Icon Spacing: mx-2 (8px horizontal between)
├─ Icon Size: 48px × 48px
└─ Link Spacing: mx-4 (16px horizontal between)

Footer Legal
├─ Padding: pb-10 (40px bottom)
├─ Text Margin: mb-1 mt-10 (4px bottom, 40px top)
└─ Alignment: Column align="center"
\`\`\`

---

## 🧩 COMPONENT PATTERNS

### PATTERN 1: Logo Header
**When to use**: Every email, top of email
**Purpose**: Brand identification

\`\`\`tsx
<Section className="px-8 py-8">
  <Row>
    <Column>
      <Img
        src="[LOGO_URL]"
        width="120"
        height="48"
        alt="[COMPANY_NAME]"
      />
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[LOGO_URL]\`: Company logo (PNG/SVG, transparent background preferred)
- \`[COMPANY_NAME]\`: Alt text for accessibility

---

### PATTERN 2: Hero Announcement
**When to use**: Opening, main feature announcement
**Purpose**: Capture attention, communicate key message

\`\`\`tsx
<Section className="px-10">
  <Row>
    <Heading className="text-center text-[34px] font-bold tracking-tight text-gray-900">
      [FEATURE_HEADLINE]
    </Heading>
    <Text className="mt-10 text-center text-[16px] text-gray-900">
      [FEATURE_DESCRIPTION]. [CONTEXT_SENTENCE]. 
      <Link href="[CTA_URL]">[LINK_TEXT]</Link>. [CLOSING_SENTENCE].
    </Text>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[FEATURE_HEADLINE]\`: Benefit-driven headline (8-12 words)
  - Example: "Supercharge productivity with app integrations"
- \`[FEATURE_DESCRIPTION]\`: 1-2 sentence intro explaining the feature
- \`[CTA_URL]\`: Link to marketplace/feature page
- \`[LINK_TEXT]\`: Inline link text (e.g., "Apps & Integrations Marketplace")
- \`[CLOSING_SENTENCE]\`: Forward-looking statement

**Guidelines**:
- Keep headline under 60 characters
- Use inline links naturally within sentences
- Aim for 3-4 sentences total in description

---

### PATTERN 3: Primary CTA Button
**When to use**: After hero, after content sections
**Purpose**: Drive user to take action

\`\`\`tsx
<Section className="mt-10">
  <Row>
    <Column align="center">
      <Button className="rounded-full bg-blue-600 px-6 py-3 text-lg text-white">
        [ACTION_TEXT] ⟶
      </Button>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[ACTION_TEXT]\`: Clear, specific action verb phrase
  - Examples:
    - "Integrate your favorite tools in [PRODUCT]"
    - "Browse [PRODUCT] integrations"
    - "Explore the marketplace"
    - "See what's new"

**Guidelines**:
- Always include arrow (⟶) for visual direction
- Use specific verbs (Browse, Integrate, Explore) not generic (Learn More)
- Keep under 50 characters
- Link to specific landing page, not homepage

---

### PATTERN 4: Full-Width Feature Image
**When to use**: After hero CTA, showcasing UI/product
**Purpose**: Visual proof, break up text

\`\`\`tsx
<Section className="mt-16">
  <Img
    src="[FEATURE_IMAGE_URL]"
    className="w-full"
    alt="[FEATURE_DESCRIPTION]"
  />
</Section>
\`\`\`

**Variables**:
- \`[FEATURE_IMAGE_URL]\`: Screenshot or illustration (1200px width recommended)
- \`[FEATURE_DESCRIPTION]\`: Descriptive alt text

**Guidelines**:
- Use high-quality screenshots (2x resolution for retina)
- Show actual product UI when possible
- Avoid generic stock photos
- Recommended size: 1200px × 600-800px

---

### PATTERN 5: Section Subheading
**When to use**: Before feature lists, mid-email sections
**Purpose**: Break content into digestible sections

\`\`\`tsx
<Section className="px-10 pt-10">
  <Row>
    <Text className="max-w-sm text-[26px] font-bold leading-9 tracking-tight text-gray-900">
      [SECTION_HEADING]
    </Text>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[SECTION_HEADING]\`: Descriptive section title
  - Example: "Here's a few integrations our community loves:"

**Guidelines**:
- Use conversational tone ("Here's..." not "Available Features")
- Keep under 60 characters
- Optional: Add emoji for personality (use sparingly)

---

### PATTERN 6: Two-Column Feature List with Image
**When to use**: Showcasing multiple related features/integrations
**Purpose**: Provide detailed information with visual support

\`\`\`tsx
<Section className="px-10">
  <Row>
    <Column className="w-[50%] align-baseline">
      <ul>
        <li>
          <Text className="text-sm text-gray-900">
            [FEATURE_DESCRIPTION_1] with <Link className="font-bold text-blue-600">[TOOL_NAME_1]</Link>[CONTINUATION_1].
          </Text>
        </li>
        <li>
          <Text className="text-sm text-gray-900">
            [FEATURE_DESCRIPTION_2] with <Link className="font-bold text-blue-600">[TOOL_NAME_2]</Link>.
          </Text>
        </li>
        <li>
          <Text className="text-sm text-gray-900">
            [FEATURE_DESCRIPTION_3] with <Link className="font-bold text-blue-600">[TOOL_NAME_3]</Link> or <Link className="font-bold text-blue-600">[TOOL_NAME_4]</Link>.
          </Text>
        </li>
      </ul>
    </Column>
    <Column className="w-[50%] pl-8">
      <Img
        src="[SUPPORTING_IMAGE_URL]"
        className="h-full w-[220px]"
        alt="[IMAGE_DESCRIPTION]"
      />
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[FEATURE_DESCRIPTION_N]\`: Benefit-focused description
- \`[TOOL_NAME_N]\`: Integration/tool name (linked)
- \`[SUPPORTING_IMAGE_URL]\`: Relevant illustration/screenshot

**Guidelines**:
- Use 3-4 list items (not more)
- Each item: 1-2 sentences max
- Link all tool/product names
- Image should complement, not duplicate text

---

### PATTERN 7: Secondary CTA Button
**When to use**: After feature list, before signature
**Purpose**: Reinforce primary action

\`\`\`tsx
<Section className="mt-10 px-10">
  <Row>
    <Column>
      <Button className="rounded-full bg-blue-600 px-6 py-3 text-lg text-white">
        [ACTION_TEXT] ⟶
      </Button>
    </Column>
  </Row>
</Section>
\`\`\`

**Note**: Same as Primary CTA but left-aligned (no center alignment)

---

### PATTERN 8: Signature
**When to use**: End of main content, before footer
**Purpose**: Personal sign-off

\`\`\`tsx
<Section className="px-10 pb-10 pt-14">
  <Row>
    <Column>
      <Text className="m-0 text-[16px] text-gray-900">
        [CLOSING_LINE],
      </Text>
      <Text className="m-0 mt-1 text-[16px] text-gray-900">
        [SIGNATURE_NAME]
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[CLOSING_LINE]\`: Warm closing
  - Examples: "Happy collaborating", "Happy building", "Cheers"
- \`[SIGNATURE_NAME]\`: Team name or individual
  - Examples: "The Miro Team", "Sarah from Product", "Your friends at [COMPANY]"

**Guidelines**:
- Keep informal and friendly
- Use team name for product updates
- Use individual name for personal outreach

---

### PATTERN 9: Social Media Footer
**When to use**: Every email, after signature
**Purpose**: Social engagement, additional resources

\`\`\`tsx
<Section>
  <Row>
    <Column align="center">
      {/* Social Icons Row */}
      <Row className="w-auto">
        <Column className="px-2">
          <Link href="[TWITTER_URL]">
            <Img
              src="https://cdn.simpleicons.org/x/1DA1F2"
              width="24"
              height="24"
              alt="Twitter"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[LINKEDIN_URL]">
            <Img
              src="https://cdn.simpleicons.org/linkedin/0A66C2"
              width="24"
              height="24"
              alt="LinkedIn"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[FACEBOOK_URL]">
            <Img
              src="https://cdn.simpleicons.org/facebook/1877F2"
              width="24"
              height="24"
              alt="Facebook"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
      </Row>
      
      {/* Footer Links Row */}
      <Row className="mt-6">
        <Column align="center">
          <Text className="text-center">
            <Link className="mx-2 font-semibold text-gray-500 underline text-xs" href="[BLOG_URL]">
              Blog
            </Link>
            <Link className="mx-2 font-semibold text-gray-500 underline text-xs" href="[WEBINARS_URL]">
              Webinars
            </Link>
            <Link className="mx-2 font-semibold text-gray-500 underline text-xs" href="[ACADEMY_URL]">
              Academy
            </Link>
            <Link className="mx-2 font-semibold text-gray-500 underline text-xs" href="[COMMUNITY_URL]">
              Community
            </Link>
          </Text>
        </Column>
      </Row>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Social icon URLs and links (4-5 platforms)
- Footer link URLs (3-5 resources)

**Social Icon Details**:
- **Size**: 24px × 24px (optimal for email footers - must be specified in BOTH width/height attributes AND inline style)
- **CDN URLs** (production-ready, from Simple Icons CDN):
\`\`\`
Twitter/X: https://cdn.simpleicons.org/x/1DA1F2
LinkedIn: https://cdn.simpleicons.org/linkedin/0A66C2
Facebook: https://cdn.simpleicons.org/facebook/1877F2
Instagram: https://cdn.simpleicons.org/instagram/E4405F
YouTube: https://cdn.simpleicons.org/youtube/FF0000
GitHub: https://cdn.simpleicons.org/github/181717
Discord: https://cdn.simpleicons.org/discord/5865F2
TikTok: https://cdn.simpleicons.org/tiktok/000000
\`\`\`

**Why Simple Icons CDN?**
- ✅ Free, reliable (Cloudflare CDN)
- ✅ Works in all email clients
- ✅ 2000+ brand icons available
- ✅ Color customizable via URL
- ✅ No API key required

**NEVER use these broken placeholder URLs**:
- ❌ https://react.email/static/brand-*.png
- ❌ https://via.placeholder.com/*
- ❌ https://example.com/*
These CDN URLs are:
- Fast and reliable (Simple Icons CDN)
- Work in all email clients
- SVG format (sharp at any size)
- Free to use
- Color can be customized via URL parameter

**Guidelines**:
- Use grayscale or brand-colored icons
- Keep icon count to 4-5 max
- Footer links: Blog, Help Center, Community, Academy, Webinars

---

### PATTERN 10: Legal Footer
**When to use**: Every email, very bottom
**Purpose**: Compliance, unsubscribe

\`\`\`tsx
<Section>
  <Row>
    <Column align="center" className="pb-10">
      <Text className="mb-1 mt-10 text-xs text-gray-500">
        [COMPANY_NAME], [FULL_ADDRESS]
      </Text>
      <Link href="[UNSUBSCRIBE_URL]" className="text-xs text-gray-500 underline">
        Unsubscribe
      </Link>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- \`[COMPANY_NAME]\`: Legal company name
- \`[FULL_ADDRESS]\`: Complete mailing address
- \`[UNSUBSCRIBE_URL]\`: Unsubscribe link (required by law)

**Guidelines**:
- Required for CAN-SPAM compliance
- Always include unsubscribe link
- Use actual mailing address

---

## 📋 CONTENT GUIDELINES

### Headline Writing Principles
1. **Lead with Benefits**: "Supercharge productivity" not "New integrations available"
2. **Be Specific**: Name the feature or capability
3. **Action-Oriented**: Use power verbs (streamline, boost, enhance)
4. **Keep Short**: 8-12 words maximum
5. **Avoid Jargon**: Write for non-technical users

**Examples**:
- ✅ "Supercharge productivity with app integrations"
- ✅ "Connect your favorite tools in seconds"
- ❌ "Integration marketplace now live"
- ❌ "Announcing new API connectivity features"

---

### Body Copy Best Practices
1. **Open with Context**: Explain why this matters now
2. **Use Inline Links**: Embed links naturally in sentences
3. **Feature 3-4 Examples**: Specific use cases or integrations
4. **Close Forward-Looking**: Hint at future additions

**Structure**:
\`\`\`
Para 1: Context + why we built this
Para 2: How it works + primary use cases
Para 3: Specific examples (with links)
Para 4: Forward-looking statement
\`\`\`

---

### CTA Copy Formulas
**Primary CTA** (high intent):
- "[Action] your [things] in [product]" 
  - Ex: "Integrate your favorite tools in Miro"
- "Browse [product] [feature]"
  - Ex: "Browse Miro integrations"

**Secondary CTA** (exploration):
- "Explore [feature/marketplace]"
- "See what's new"
- "Check out [feature]"

**Always include arrow**: ⟶

---

### Voice & Tone
- **Professional but Friendly**: Not corporate, not casual
- **Enthusiastic**: Show excitement about features
- **Collaborative**: "We've partnered with..." not "We built..."
- **Future-Focused**: "We're always adding..." "Be on the lookout..."

---

## ✅ QUALITY CHECKLIST

Before sending any email using this design system:

### Content
- [ ] Headline is benefit-focused (not feature-focused)
- [ ] Opening paragraph explains "why now"
- [ ] 3-4 specific examples included
- [ ] All tool/product names are linked
- [ ] CTA copy is specific and action-oriented
- [ ] Signature is warm and friendly
- [ ] Legal footer includes unsubscribe

### Design
- [ ] Inter web font is loaded in <Head>
- [ ] Logo is 120px × 48px
- [ ] Primary CTA uses blue-600 background
- [ ] All images have descriptive alt text
- [ ] Spacing follows pattern guidelines (px-10, mt-10, etc.)
- [ ] Text colors: gray-900 (body), gray-500 (footer)

### Technical
- [ ] All links have href attributes
- [ ] Images have width/height attributes
- [ ] Container has max-width and centered
- [ ] Mobile-responsive (Tailwind handles this)
- [ ] Tested in Gmail, Outlook, Apple Mail

### Accessibility
- [ ] All images have alt text
- [ ] Link text is descriptive (not "click here")
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Font sizes are readable (minimum 14px)

---

## 🎨 VARIATIONS & ADAPTATIONS

### Variation: Short Announcement
**Use when**: Single feature, quick update
**Changes**:
- Remove feature list section
- One CTA only
- Shorter intro (2 sentences)

### Variation: Multiple Features
**Use when**: Release notes, multiple updates
**Changes**:
- Repeat "Feature Image + CTA" pattern 2-3 times
- Add subheadings between sections
- Keep total length under 800px scroll

### Variation: Beta Launch
**Use when**: Limited availability, early access
**Changes**:
- Add beta badge to headline
- Include "Limited spots available" copy
- CTA: "Request early access" instead of "Browse"

---

## 📱 MOBILE CONSIDERATIONS

Tailwind classes handle mobile responsiveness automatically:
- Container: max-width scales down
- Text: Maintains readability
- Buttons: Touch-friendly (py-3 = 48px min)
- Images: w-full scales proportionally

**No additional mobile-specific code needed** ✅

---

## 🔗 EXAMPLE PROMPTS

### Example 1: Integration Announcement
\`\`\`
Create a SaaS product update email announcing new Slack and Google Calendar 
integrations. Highlight how teams can streamline workflow and never miss notifications. 
Include a hero image of the integration marketplace and a list of 3 key benefits.
\`\`\`

### Example 2: Feature Launch
\`\`\`
Generate an email announcing our new AI-powered search feature. Target existing users,
explain how it saves time finding content, and encourage them to try it. Include 
screenshot and CTA to documentation.
\`\`\`

### Example 3: Marketplace Update
\`\`\`
Write a product update email about our expanded app marketplace with 50+ new integrations.
Focus on popular tools like Figma, Notion, and Asana. Include social proof 
("our community loves") and forward-looking statement about future additions.
\`\`\`

---

## 🚀 IMPLEMENTATION NOTES

**For AI Generation**:
1. Detect triggers in user prompt
2. Select this design system if matches
3. Generate content following hierarchy
4. Use component patterns as building blocks
5. Maintain Tailwind class consistency
6. Include Inter web font in every email

**For Developers**:
- All Tailwind classes are from @react-email/components
- Test in multiple email clients (Gmail, Outlook priority)
- Use image CDN for all assets (fast loading)
- Implement unsubscribe link properly

**For Designers**:
- Stick to blue-600 for brand consistency
- Use 32px × 32px for social icons (with explicit inline style)
- Feature images: 1200px width minimum
- Maintain generous spacing (40px standard)
- Container: NO rounded classes, use max-w-[600px] in className

---

END OF DESIGN SYSTEM SPECIFICATION
`,
};

export default SaaSProductUpdateDesignSystem;

