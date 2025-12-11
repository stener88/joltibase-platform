/**
 * CHANGELOG & FEATURE UPDATE EMAIL DESIGN SYSTEM
 * Based on Cal.com's feature update newsletter template
 *
 * Use cases:
 * - Product changelog announcements
 * - Monthly/weekly feature roundups
 * - Release notes newsletters
 * - New feature launches
 * - Product update digests
 * - Version release announcements
 * - Multi-feature update emails
 */

import type { DesignSystem } from '../lib/design-system-selector';

export const ChangelogFeatureUpdateDesignSystem: DesignSystem = {
  id: 'changelog-feature-update',
  name: 'Changelog & Feature Update',
  description:
    'Clean, text-focused changelog email with hero images per feature, dark CTA buttons, and minimal styling. Perfect for announcing multiple product updates in a single digest format.',

  // KEYWORD TRIGGERS
  triggers: [
    'changelog',
    'release notes',
    'new features',
    'feature update',
    'product update',
    'whats new',
    "what's new",
    'version',
    'release',
    'launched',
    'shipping',
    'improvements',
    'enhancements',
    'now available',
    'new in',
    'updates',
    'announcing',
    'introducing',
    'upgrade',
    'issue',
    'v2',
    'v3',
    'beta',
    'launches today',
    'product news',
  ],

  // IMAGE KEYWORDS
  imageKeywords: {
    hero: ['product', 'dashboard', 'interface', 'feature'],
    feature: ['laptop', 'computer', 'desk', 'workspace'],
    product: ['software', 'app', 'mobile', 'screen'],
    background: ['clean', 'minimal', 'modern', 'tech'],
    people: ['team', 'collaboration', 'meeting', 'work'],
  },

  // COMPLETE DESIGN SYSTEM SPECIFICATION
  system: `
# CHANGELOG & FEATURE UPDATE EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Clear, scannable feature announcements with a focus on readability. Multiple features in one email, each with its own image and CTA.

This design system prioritizes:
- **Content over Chrome**: Minimal decoration, maximum information
- **Scannability**: Easy to browse multiple features quickly
- **Visual Hierarchy**: Clear headlines, sub-sections, and CTAs for each feature
- **Consistency**: Repeating pattern for each feature announcement

**Target Audience**: Existing users, product subscribers, newsletter readers
**Goal**: Inform users about new features, drive adoption, increase engagement

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
Main Headline (Changelog Title)
├─ Size: text-[32px] (32px)
├─ Weight: font-bold (700)
├─ Line Height: 40px
├─ Color: text-gray-900 (#131212)
├─ Margin: 20px 0
└─ Usage: "Changelog: Product v5.7 - Feature Name & More..."

Byline/Meta
├─ Size: text-base (16px)
├─ Weight: font-normal (400)
├─ Color: text-gray-500 (#6D757E)
├─ Margin: 0 0 18px 0
└─ Usage: "By the Product Team • Issue #39"

Introduction Text
├─ Size: text-base (16px)
├─ Weight: font-normal (400)
├─ Color: text-gray-900 (#131212)
├─ Line Height: 1.5
├─ Margin: 16px 0 24px 0
└─ Usage: Welcome/intro paragraph before feature list

Feature Section Headline
├─ Size: text-[24px] (24px)
├─ Weight: font-bold (700)
├─ Line Height: 1.3
├─ Color: text-gray-900 (#131212)
├─ Margin: 20px 0
└─ Usage: Individual feature titles

Body Copy
├─ Size: text-base (16px)
├─ Weight: font-normal (400)
├─ Color: text-gray-900 (#131212)
├─ Line Height: 1.6
├─ Margin: 16px 0
└─ Usage: Feature descriptions, paragraphs

Bullet Lists
├─ Size: text-base (16px)
├─ Weight: font-normal (400)
├─ Color: text-gray-900 (#131212)
├─ Line Height: 1.6
├─ Margin: 16px 0
├─ List Style: Bullets
└─ Usage: Feature highlights, key points

Footer Disclaimer
├─ Size: text-base (16px)
├─ Weight: font-normal (400)
├─ Style: italic
├─ Color: inherit
├─ Margin: 42px 0 16px 0
└─ Usage: Unsubscribe info, legal text

Footer Legal
├─ Size: text-xs (12px)
├─ Weight: font-normal (400)
├─ Color: text-gray-600 (#444444)
├─ Alignment: center
├─ Margin: 0
└─ Usage: Company name, address, unsubscribe link
\`\`\`

---

## 🎨 COLOR PALETTE

### Primary Colors

\`\`\`
Dark Gray (Primary Text): #131212 (rgb(19, 18, 18))
  - Use for: Headlines, body text, all primary content
  - Classes: text-gray-900 or color: rgb(19, 18, 18)

Medium Gray (Secondary Text): #6D757E (rgb(109, 117, 126))
  - Use for: Bylines, meta info, secondary content
  - Classes: text-gray-500

Link Blue: #1156CC (rgb(17, 86, 204))
  - Use for: Inline text links only
  - Classes: text-blue-600

Button/CTA Black: #333333
  - Use for: All CTA button backgrounds
  - Style: backgroundColor: '#333333', color: '#ffffff'
\`\`\`

### Background Colors

\`\`\`
Page Background: #ffffff (white)
  - Use for: <Body> background
  - Style: backgroundColor: '#ffffff'

Container Background: #ffffff (white)
  - Use for: Main <Container> background
  - Style: backgroundColor: '#ffffff'

Separator Border: #e5e5e5 (light gray)
  - Use for: Horizontal rule before footer
  - Style: borderTop: '1px solid #e5e5e5'
\`\`\`

---

## 🏗️ LAYOUT STRUCTURE

### Container System (React Email Components)

\`\`\`tsx
// SIMPLE STRUCTURE - Clean white background
<Body style={{ backgroundColor: "#ffffff" }}>
  <Container style={{ maxWidth: "600px", backgroundColor: "#ffffff" }}>
    // All sections here
  </Container>
</Body>
\`\`\`

**CRITICAL**: Use INLINE STYLES (style={{}}) not Tailwind classes for this design system.

### Section Spacing Guidelines

\`\`\`
Header Image
├─ Margin: 0
├─ Image Size: 576px × 243px (hero ratio)
├─ Border Radius: 4px on all corners
└─ Alignment: Center

Headline Section
├─ Margin: 20px 0
├─ Padding: 0 10px
└─ Alignment: Left

Feature Section Pattern (Repeating)
├─ Headline: 20px 0 margin, 10px padding
├─ Image: 576px width, 4px border radius, centered
├─ Description: 16px 0 margin, 10px padding
├─ CTA Button: 0 0 16px 0 margin, 10px padding
└─ Spacing Between Features: 16-20px

Footer Separator
├─ Margin: 48px 0 0 0
├─ Border: 1px solid #e5e5e5 (top only)
└─ Below: 42px margin before disclaimer

Footer Content
├─ Padding: 40px 32px
├─ Background: #ffffff
├─ Text Alignment: center
└─ Line Spacing: Standard margins between elements
\`\`\`

---

## 🔧 COMPONENT PATTERNS

### PATTERN 1: Header Hero Image
**When to use**: Top of email, sets visual tone
**Purpose**: Brand presence, visual interest

\`\`\`tsx
<Section>
  <Row>
    <Column align="center">
      <Link href="[LINK_URL]">
        <Img 
          src="[IMAGE_URL]" 
          style={{
            borderRadius: "4px",
            width: "576px",
            height: "243px"
          }} 
          alt="[Descriptive alt text]"
        />
      </Link>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Image URL: Hero/brand image
- Link URL: Product homepage or feature page
- Alt text: Descriptive text

---

### PATTERN 2: Main Headline
**When to use**: First text after hero image
**Purpose**: Email title, changelog version

\`\`\`tsx
<Section style={{
  borderRadius: "0px",
  margin: "20px 0 20px 0"
}}>
  <Row>
    <Column style={{ padding: "0px 10px 0px 10px" }}>
      <Text style={{ 
        lineHeight: "40px",
        color: "rgb(19, 18, 18)", 
        fontSize: "32px",
        fontWeight: "bold",
        margin: 0
      }}>
        Changelog: <Link href="[PRODUCT_URL]">[Product Name]</Link> v5.7 - [Feature Names] & More...
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Product name and URL
- Version number
- Feature highlights

**Guidelines**:
- Keep under 100 characters
- Include version number if applicable
- Mention 1-2 key features

---

### PATTERN 3: Byline/Meta Info
**When to use**: Immediately after headline
**Purpose**: Author attribution, issue number

\`\`\`tsx
<Section style={{
  borderRadius: "0px",
  margin: "0px 0 0px 0"
}}>
  <Row>
    <Column style={{ padding: "0px 10px 18px 10px" }}>
      <Text style={{ margin: 0 }}>
        <Text style={{ color: "rgb(109, 117, 126)" }}>
          By the
        </Text>{" "}
        <Link href="[COMPANY_URL]">[Company Name]</Link> Product Team
        <Text style={{ color: "rgb(108, 117, 125)", fontSize: "16px" }}> • </Text>
        <Link href="[ISSUE_URL]">
          <Text style={{ 
            color: "rgb(108, 117, 125)", 
            fontSize: "16px",
            textDecoration: "underline" 
          }}>
            Issue #39
          </Text>
        </Link>
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Company name and URL
- Issue number and URL
- Team name

---

### PATTERN 4: Introduction Paragraph
**When to use**: After byline, before feature list
**Purpose**: Context setting, warm welcome

\`\`\`tsx
<Section style={{
  borderRadius: "0px",
  margin: "0px 0 0px 0"
}}>
  <Row>
    <Column style={{ padding: "16px 10px 24px 10px" }}>
      <Text>
        Hello, welcome to this month's feature update! This month, we've focused on a few key areas to improve your experience:
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- 1-2 sentences max
- Friendly, conversational tone
- Set expectations for what's in the email

---

### PATTERN 5: Feature Section Headline
**When to use**: Before each feature announcement
**Purpose**: Feature name, clear section break

\`\`\`tsx
<Section style={{
  borderRadius: "0px",
  margin: "0px 0 0px 0"
}}>
  <Row>
    <Column style={{ padding: "20px 10px 20px 10px" }}>
      <Text style={{
        color: "rgb(19, 18, 18)", 
        fontSize: "24px",
        fontWeight: "bold",
        margin: 0
      }}>
        <Link href="[FEATURE_URL]">[Product/Feature Name]</Link> launching on Product Hunt - Upvote if you love it!
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Feature name
- Feature URL
- Action-oriented headline

**Guidelines**:
- Lead with benefit or excitement
- Include call-to-action in headline if relevant
- Use bold font, 24px size

---

### PATTERN 6: Feature Image
**When to use**: After feature headline
**Purpose**: Visual representation of feature

\`\`\`tsx
<Section>
  <Row>
    <Column align="center">
      <Link href="[FEATURE_URL]">
        <Img 
          src="[IMAGE_URL]" 
          style={{
            borderRadius: "4px",
            width: "576px",
            height: "322px"
          }}
          alt="[Descriptive alt text for feature image]"
        />
      </Link>
    </Column>
  </Row>
</Section>
\`\`\`

**Image Specs**:
- Width: 576px
- Height: 296px - 322px (varies by content)
- Border Radius: 4px
- Format: PNG or JPG

**Guidelines**:
- Use screenshots for product features
- Use illustrations for concepts
- Always include descriptive alt text (10-15 words)

---

### PATTERN 7: Feature Description (Text Block)
**When to use**: After feature image
**Purpose**: Explain feature, benefits, details

\`\`\`tsx
<Section style={{
  borderRadius: "0px",
  margin: "16px 0px 16px 0px"
}}>
  <Row>
    <Column style={{ padding: "0px 10px 0px 10px" }}>
      <Text>
        We're excited to announce that <Link href="[URL]"><strong>[Feature Name]</strong></Link>, 
        your 24/7 AI-powered scheduling assistant, is now live on Product Hunt! 
        If you're as excited as we are, we'd love your <strong>upvote</strong> to help 
        more people discover [Feature Name] and make scheduling effortless.
      </Text>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Feature name and URL
- Description text
- Inline links to related content

**Guidelines**:
- 2-4 sentences per paragraph
- Use inline <strong> for emphasis
- Include inline <Link> elements naturally
- Break long descriptions into multiple sections

---

### PATTERN 8: Feature Description (Bullet List)
**When to use**: Listing multiple sub-features or highlights
**Purpose**: Scannable key points

\`\`\`tsx
<Section style={{
  borderRadius: "0px",
  margin: "16px 0px 16px 0px"
}}>
  <Row>
    <Column style={{ padding: "0px 10px 0px 10px" }}>
      <Text>The main highlights of this upgrade:</Text>
      <ul style={{ margin: 0, paddingLeft: "20px" }}>
        <li>
          <Text style={{ margin: 0 }}>
            <strong>Performance boost:</strong> Thanks to performance improvements, 
            data fetching is now up to 4.5x faster for scheduling insights.
          </Text>
        </li>
        <li>
          <Text style={{ margin: 0 }}>
            <strong>New filters:</strong> You can now additionally filter by 
            'Booking Status', 'Attendee Email', 'Paid', and 'Rating'.
          </Text>
        </li>
        <li>
          <Text style={{ margin: 0 }}>
            <strong>Additional charts:</strong> We've added new charts like 
            'Bookings by Hour', 'Routing Funnel' and 'Recent No-Show Guests'.
          </Text>
        </li>
      </ul>
    </Column>
  </Row>
</Section>
\`\`\`

**Guidelines**:
- Use <ul> with <li> elements (standard HTML)
- Bold the key term/feature name
- Keep each bullet to 1-2 sentences
- 3-5 bullets maximum per list

---

### PATTERN 9: CTA Button (Dark Theme)
**When to use**: After each feature description
**Purpose**: Drive action for specific feature

\`\`\`tsx
<Section style={{
  margin: "0px 0 16px 0",
  padding: "0px 10px 0px 10px"
}}>
  <Row>
    <Column align="left" style={{
      width: "100%",
      paddingLeft: "0",
      paddingRight: "0",
      verticalAlign: "top"
    }}>
      <Button 
        href="[ACTION_URL]" 
        style={{
          backgroundColor: "#333333",
          padding: "12px 18px",
          color: "#ffffff",
          borderRadius: "6px",
          fontSize: "14px",
          lineHeight: "normal",
          textDecoration: "none"
        }}
      >
        Upvote Cal.ai on Product Hunt!
      </Button>
    </Column>
  </Row>
</Section>
\`\`\`

**Button Specs**:
- Background: #333333 (dark gray)
- Text Color: #ffffff (white)
- Padding: 12px 18px
- Border Radius: 6px
- Font Size: 14px

**CTA Copy Guidelines**:
- Action-oriented verbs: Try, Explore, Upvote, Learn More
- Be specific: "Try [Feature] now" not "Click here"
- Keep under 6 words when possible
- Use exclamation marks for excitement (sparingly)

---

### PATTERN 10: Footer Separator & Disclaimer
**When to use**: Before footer, after last feature
**Purpose**: Legal compliance, unsubscribe info

\`\`\`tsx
<Section style={{
  margin: "48px 0 0px 0",
  padding: "0px 0px 0px 0px",
  borderTop: "1px solid #e5e5e5"
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
        margin: "42px 0 16px 0"
      }}>
        <Row>
          <Column style={{ padding: "16px 20px 16px 20px" }}>
            <Text style={{ 
              fontStyle: "italic",
              fontSize: "16px",
              margin: 0
            }}>
              You're receiving this email because you created an account with{" "}
              <Link href="[COMPANY_URL]">[Company Name]</Link>, 
              [tagline]. If you don't want to receive these emails unsubscribe 
              below – you'll continue to receive important scheduling and 
              other account-related emails.
            </Text>
          </Column>
        </Row>
      </Section>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Company name and URL
- Company tagline
- Email purpose description

**Guidelines**:
- Required for CAN-SPAM compliance
- Explain why they're receiving email
- Mention unsubscribe option
- Use italic font style

---

### PATTERN 11: Footer (Company Info)
**When to use**: Bottom of every email
**Purpose**: Legal compliance, branding, unsubscribe

\`\`\`tsx
<Section style={{
  padding: "40px 32px 40px 32px",
  backgroundColor: "#ffffff"
}}>
  <Row>
    <Column align="center" style={{
      width: "100%",
      paddingLeft: "0",
      paddingRight: "0",
      verticalAlign: "top"
    }}>
      <Section style={{ margin: "0px 0 0px 0" }}>
        <Row>
          <Column style={{ padding: "0 0 0 0" }}>
            <Text style={{ 
              textAlign: "center",
              fontSize: "12px",
              margin: "0 0 8px 0"
            }}>
              [Company Name]
            </Text>
          </Column>
        </Row>
      </Section>
      
      <Section style={{ margin: "0px 0 0px 0" }}>
        <Row>
          <Column style={{ padding: "0 0 0 0" }}>
            <Text style={{ 
              textAlign: "center",
              color: "rgb(68, 68, 68)",
              fontSize: "12px",
              margin: "0 0 8px 0"
            }}>
              [Full Mailing Address]
            </Text>
          </Column>
        </Row>
      </Section>
      
      <Link href="[UNSUBSCRIBE_URL]">
        <Section style={{ margin: "0 0 0 0" }}>
          <Row>
            <Column style={{ padding: "0 0 0 0" }}>
              <Text style={{ 
                textAlign: "center",
                fontSize: "12px",
                textDecoration: "underline",
                margin: 0
              }}>
                Unsubscribe
              </Text>
            </Column>
          </Row>
        </Section>
      </Link>
    </Column>
  </Row>
</Section>
\`\`\`

**Variables**:
- Company name
- Full mailing address
- Unsubscribe URL

**Guidelines**:
- Required for CAN-SPAM compliance
- Always include unsubscribe link
- Use actual mailing address
- Center-aligned, small text (12px)

---

## 📋 CONTENT GUIDELINES

### Email Structure

**Recommended Flow**:
1. Hero image (optional)
2. Main headline (Changelog: Product vX.X)
3. Byline (By the Team • Issue #X)
4. Welcome/intro paragraph (1-2 sentences)
5. Feature 1:
   - Headline
   - Image
   - Description
   - CTA
6. Feature 2: (repeat pattern)
7. Feature 3: (repeat pattern)
8. Footer separator
9. Disclaimer
10. Footer

### Headline Writing Principles

1. **Include Version**: "Changelog: Product v5.7 - Features"
2. **Be Specific**: Name 1-2 key features
3. **Keep Short**: Under 100 characters
4. **Use Colons/Dashes**: Structure: "Changelog: [Product] [Version] - [Features]"

**Examples**:
- ✅ "Changelog: Cal.com v5.7 - Cal.ai Phone Agent, Insights 2.0 & More..."
- ✅ "Release Notes: Figma v3.2 - Auto Layout, Plugins, Variables"
- ❌ "New Updates Available" (too vague)
- ❌ "Check out what we've been working on this month!" (too long, not specific)

### Feature Section Best Practices

**Headline**:
- Lead with feature name
- Include benefit or action
- 24px, bold
- Can include inline links

**Description**:
- 2-4 sentences for simple features
- Use bullet lists for complex features
- Bold key terms
- Include inline links naturally
- Conversational tone

**Images**:
- Screenshot for UI features
- Illustration for concepts
- 576px width
- 4px border radius
- Descriptive alt text

**CTA**:
- One CTA per feature
- Dark button (#333333)
- Action-oriented text
- 6 words or less

### Voice & Tone

- **Excited but Professional**: Show enthusiasm without being overly casual
- **Clear and Direct**: No marketing fluff, just facts
- **Friendly**: "We're excited to announce..." "Happy to share..."
- **Helpful**: Focus on how features help the user

### Writing Style

**Do's**:
- ✅ Use "we" for company actions
- ✅ Use "you" to address the user
- ✅ Include specific numbers/metrics
- ✅ Link product/feature names
- ✅ Break into short paragraphs

**Don'ts**:
- ❌ Long walls of text
- ❌ Jargon without explanation
- ❌ Vague benefits ("better experience")
- ❌ ALL CAPS (except in headlines if appropriate)

---

## ✅ QUALITY CHECKLIST

Before generating/sending:

### Content
- [ ] Headline includes version/issue number
- [ ] Byline includes team name
- [ ] Intro paragraph sets context
- [ ] Each feature has: headline, image, description, CTA
- [ ] All product/feature names are linked
- [ ] CTAs are action-oriented and specific
- [ ] Footer disclaimer explains email purpose
- [ ] Unsubscribe link is present and working

### Design
- [ ] All images are 576px width
- [ ] All images have 4px border radius
- [ ] All images have descriptive alt text
- [ ] Buttons use #333333 background, white text
- [ ] Footer separator has 48px top margin
- [ ] Text uses correct font sizes (32px, 24px, 16px, 12px)
- [ ] Consistent 16px margins between sections

### Technical
- [ ] All inline styles use style={{}} not className
- [ ] All links have href attributes
- [ ] Container maxWidth is 600px
- [ ] No Tailwind classes (use inline styles instead)
- [ ] Section margins are consistent
- [ ] Padding is 10px horizontal, variable vertical

### Accessibility
- [ ] All images have alt text (10-15 words)
- [ ] Link text is descriptive (not "click here")
- [ ] Text color contrast meets WCAG AA
- [ ] Font sizes are readable (minimum 12px)

---

## 🎨 STYLING REQUIREMENTS

**CRITICAL**: This design system uses **INLINE STYLES ONLY**, NOT Tailwind classes.

### Correct Styling Approach

\`\`\`tsx
// ✅ CORRECT - Use inline styles
<Text style={{
  fontSize: "32px",
  fontWeight: "bold",
  color: "rgb(19, 18, 18)",
  lineHeight: "40px",
  margin: 0
}}>
  Headline text
</Text>

// ❌ INCORRECT - Don't use Tailwind
<Text className="text-[32px] font-bold text-gray-900">
  Headline text
</Text>
\`\`\`

### Common Inline Styles

**Text Styling**:
\`\`\`javascript
// Headlines
style={{ fontSize: "32px", fontWeight: "bold", color: "rgb(19, 18, 18)", lineHeight: "40px" }}

// Subheadlines
style={{ fontSize: "24px", fontWeight: "bold", color: "rgb(19, 18, 18)" }}

// Body text
style={{ fontSize: "16px", color: "rgb(19, 18, 18)", lineHeight: "1.6" }}

// Meta/byline
style={{ fontSize: "16px", color: "rgb(109, 117, 126)" }}

// Footer
style={{ fontSize: "12px", color: "rgb(68, 68, 68)", textAlign: "center" }}
\`\`\`

**Section Styling**:
\`\`\`javascript
// Standard section
style={{ margin: "16px 0px 16px 0px", borderRadius: "0px" }}

// Padded content
style={{ padding: "0px 10px 0px 10px" }}

// Footer separator
style={{ margin: "48px 0 0px 0", borderTop: "1px solid #e5e5e5" }}
\`\`\`

**Image Styling**:
\`\`\`javascript
style={{ borderRadius: "4px", width: "576px", height: "auto" }}
\`\`\`

**Button Styling**:
\`\`\`javascript
style={{
  backgroundColor: "#333333",
  padding: "12px 18px",
  color: "#ffffff",
  borderRadius: "6px",
  fontSize: "14px",
  lineHeight: "normal",
  textDecoration: "none"
}}
\`\`\`

---

## 🚀 IMPLEMENTATION NOTES

**For AI Generation**:
1. Detect "changelog", "release", "feature update" keywords
2. Select this design system
3. Generate 2-4 feature sections minimum
4. Use repeating pattern for consistency
5. **USE INLINE STYLES ONLY** - no Tailwind classes
6. Include proper footer and disclaimer

**For Developers**:
- All styles must be inline style={{}} objects
- No Tailwind className usage
- No <Font> component needed (uses default fonts)
- Test in Gmail, Outlook, Apple Mail
- Ensure all images load properly

**For Designers**:
- Stick to dark buttons (#333333)
- Use 576px width for all images
- 4px border radius on images
- 16px standard vertical spacing
- 10px standard horizontal padding

---

## 📱 MOBILE CONSIDERATIONS

Inline styles scale naturally:
- Container maxWidth: 600px scales down
- Font sizes remain readable
- Buttons are touch-friendly (12px padding)
- Images scale with width: 100% behavior

---

## 🎯 EXAMPLE USE CASES

### Example 1: Monthly Changelog
\`\`\`
Generate a changelog email for our v3.5 release featuring: AI-powered search, 
dark mode, and improved notifications. Include Product Hunt launch announcement.
\`\`\`

### Example 2: Single Major Feature
\`\`\`
Create a feature update email announcing our new AI assistant that handles customer 
support calls 24/7. Include benefits, pricing, and getting started CTA.
\`\`\`

### Example 3: Weekly Digest
\`\`\`
Write a weekly product update newsletter highlighting: performance improvements 
(4x faster), new integrations (Slack, Teams), and UI refresh.
\`\`\`

---

END OF DESIGN SYSTEM SPECIFICATION
`,
};

export default ChangelogFeatureUpdateDesignSystem;

