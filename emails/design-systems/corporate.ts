/**
 * CORPORATE PROFESSIONAL EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating professional, business-focused emails.
 * This serves as the template structure for all design systems.
 * 
 * Target Audience: C-suite executives, enterprise buyers, B2B communications,
 * formal business stakeholders, annual reports, quarterly updates
 */

export const CorporateDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'corporate-professional',
  name: 'Corporate Professional',
  description: 'Conservative, trustworthy, accessible design for formal business communications',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   * Front-load most important keywords (they get checked first)
   */
  triggers: [
    // Primary business terms
    'professional', 'corporate', 'business', 'executive', 'enterprise',
    'formal', 'B2B', 'stakeholder', 'investor', 'board', 'annual report',
    'quarterly', 'financial', 'earnings', 'shareholder', 'compliance',
    
    // Industry-specific
    'banking', 'finance', 'legal', 'consulting', 'insurance',
    'healthcare', 'pharmaceutical', 'government', 'enterprise software',
    
    // Communication types
    'announcement', 'update', 'memo', 'statement', 'report',
    'notification', 'alert', 'policy', 'terms', 'agreement'
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['business', 'corporate', 'professional'],
    feature: ['office', 'team', 'meeting'],
    product: ['service', 'presentation', 'workspace'],
    background: ['abstract', 'pattern', 'minimal'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# CORPORATE PROFESSIONAL EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Clarity, trustworthiness, and accessibility over creativity.

This design system prioritizes:
- **Readability**: Clear hierarchy, ample spacing, legible typography
- **Trust**: Conservative colors, professional imagery, consistent branding
- **Accessibility**: WCAG AA compliance, semantic HTML, sufficient contrast
- **Compatibility**: Works across all major email clients (Gmail, Outlook, Apple Mail)

**Target Audience**: C-suite executives, enterprise decision-makers, formal business stakeholders

**Avoid**: Playful elements, bright colors, casual language, experimental layouts

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
H1 (Main Headline)
├─ Size: 36-40px
├─ Weight: 700 (bold)
├─ Line Height: 1.2 (tight for impact)
├─ Color: #1a1a1a (near black)
├─ Margin: 0 0 16px 0
└─ Usage: Once per email, primary message

H2 (Section Headline)
├─ Size: 28-32px
├─ Weight: 600 (semi-bold)
├─ Line Height: 1.3
├─ Color: #2d2d2d
├─ Margin: 32px 0 12px 0
└─ Usage: Major sections, max 2-3 per email

H3 (Subsection)
├─ Size: 22-24px
├─ Weight: 600
├─ Line Height: 1.4
├─ Color: #333333
├─ Margin: 24px 0 8px 0
└─ Usage: Sub-points, feature callouts

Body Large (Lead paragraph)
├─ Size: 18px
├─ Weight: 400 (normal)
├─ Line Height: 1.6
├─ Color: #4a4a4a (medium gray)
├─ Margin: 0 0 16px 0
└─ Usage: First paragraph after headline

Body Regular (Standard text)
├─ Size: 16px
├─ Weight: 400
├─ Line Height: 1.7 (generous for readability)
├─ Color: #4a4a4a
├─ Margin: 0 0 16px 0
└─ Usage: Main content, most common

Body Small (Supporting text)
├─ Size: 14px
├─ Weight: 400
├─ Line Height: 1.6
├─ Color: #666666 (lighter gray)
├─ Margin: 0 0 12px 0
└─ Usage: Captions, disclaimers, metadata

Caption/Legal
├─ Size: 12px
├─ Weight: 400
├─ Line Height: 1.5
├─ Color: #888888
├─ Margin: 8px 0
└─ Usage: Footer text, legal disclaimers only
\`\`\`

### Font Stack

**Primary**: 
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
\`\`\`

**Why this stack**:
- System fonts load instantly (no web fonts in email)
- Consistent across all platforms
- Professional appearance
- Excellent readability at all sizes

**NEVER USE**:
- ❌ Decorative fonts (Papyrus, Comic Sans, etc.)
- ❌ Script/handwriting fonts
- ❌ Display fonts (too stylized)
- ❌ Monospace fonts (unless showing code)
- ❌ Web fonts (@font-face doesn't work reliably in email)

### Typography Rules

1. **Paragraph Length**: Maximum 3-4 sentences (60-80 words)
2. **Line Length**: 50-75 characters for optimal readability
3. **Text Alignment**: Left-aligned body text (NEVER justify or center paragraphs)
4. **Emphasis**: Use bold for emphasis, NEVER use italics alone (poor readability)
5. **All Caps**: Avoid except for very short labels (max 2-3 words)
6. **Link Styling**: Underline + color, or just color if in button

---

## 🎨 COLOR SYSTEM

### Primary Palette

\`\`\`
Background
├─ Primary: #ffffff (pure white)
├─ Subtle: #f9fafb (very light gray)
└─ Usage: Main background always white, sections can use subtle

Brand Primary (Professional Blue)
├─ Dark: #1e3a8a (headlines, primary CTAs)
├─ Medium: #2563eb (links, accents)
├─ Light: #3b82f6 (hover states)
└─ Usage: CTAs, links, brand elements

Neutral Grays (Text & Borders)
├─ Near Black: #1a1a1a (H1, important text)
├─ Dark Gray: #2d2d2d (H2)
├─ Medium Gray: #4a4a4a (body text)
├─ Light Gray: #666666 (supporting text)
├─ Very Light: #e5e7eb (borders, dividers)
└─ Subtle: #f3f4f6 (backgrounds)
\`\`\`

### Accent Colors (Use Sparingly)

\`\`\`
Success (Positive outcomes)
├─ Color: #059669
└─ Usage: Confirmations, growth metrics, positive news

Warning (Important notices)
├─ Color: #d97706
└─ Usage: Deadlines, important dates, attention needed

Error/Urgent (Critical information)
├─ Color: #dc2626
└─ Usage: Critical alerts, urgent action required

Info (Neutral highlights)
├─ Color: #0891b2
└─ Usage: Tips, informational callouts
\`\`\`

### Color Usage Rules

**STRICT GUIDELINES**:
1. **Maximum 3 colors per email**: Primary + 2 accents maximum
2. **Never use bright/saturated colors**: No neon, no #FF0000, no #00FF00
3. **Contrast requirements**: 
   - Body text: 4.5:1 minimum (WCAG AA)
   - Large text (18px+): 3:1 minimum
   - Interactive elements: 3:1 minimum
4. **Background restrictions**: White or very light gray (#f9fafb max)
5. **Brand consistency**: Use primary blue (#1e3a8a) for all CTAs unless specified

**Examples of GOOD color usage**:
- White background + dark gray text + blue CTA = ✅
- Light gray section + medium gray text + green accent = ✅
- White background + blue headline + blue CTA + gray text = ✅

**Examples of BAD color usage**:
- Bright yellow background = ❌
- Red text on blue background = ❌ (poor contrast)
- 5 different accent colors = ❌ (too busy)
- Neon green CTA = ❌ (unprofessional)

---

## 📏 SPACING SYSTEM

**Base Unit**: 8px (all spacing is multiples of 8)

### Spacing Scale

\`\`\`
2px   → Fine details, icon padding
4px   → Tight spacing, inline elements
8px   → Related elements, list items
12px  → Small gaps, compact layouts
16px  → Default paragraph spacing
24px  → Component spacing, section padding
32px  → Generous spacing, major sections
48px  → Large gaps, section dividers
64px  → Extra large gaps, header/footer
96px  → Maximum spacing, major breaks
\`\`\`

### Component Spacing

**Email Container**:
\`\`\`css
max-width: 600px;
margin: 0 auto;
padding: 0;
\`\`\`

**Section Padding**:
\`\`\`css
padding: 48px 24px; /* vertical horizontal */
\`\`\`

**Paragraph Spacing**:
\`\`\`css
margin-bottom: 16px; /* between paragraphs */
\`\`\`

**Heading Spacing**:
\`\`\`css
/* H1 */
margin: 0 0 16px 0;

/* H2 */
margin: 32px 0 12px 0; /* space above to separate from previous section */

/* H3 */
margin: 24px 0 8px 0;
\`\`\`

**Component Gaps**:
\`\`\`css
/* Between major components (hero → content → CTA) */
margin-bottom: 48px;

/* Between related items (feature list, bullet points) */
margin-bottom: 12px;
\`\`\`

---

## 🔘 CTA (CALL-TO-ACTION) DESIGN

### Primary CTA Button

**Visual Specifications**:
\`\`\`css
background-color: #1e3a8a; /* Brand primary dark */
color: #ffffff;
font-size: 16px;
font-weight: 600;
padding: 14px 32px;
border-radius: 6px; /* Subtle rounding */
text-decoration: none;
display: inline-block;
margin: 32px 0 16px 0;
min-width: 200px;
max-width: 280px;
text-align: center;
\`\`\`

**Implementation**:
\`\`\`tsx
<Button
  href="https://example.com/action"
  style={{
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    padding: '14px 32px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '32px'
  }}
>
  View Full Report
</Button>
\`\`\`

### CTA RULES (CRITICAL)

1. **Maximum 2 CTAs total**: 1 primary + 1 secondary OR 1 primary + multiple text links
2. **Primary CTA placement**: After main content, before supporting info
3. **CTA text length**: 2-4 words maximum
4. **Action-oriented language**: 
   - ✅ "View Report", "Schedule Call", "Download Guide"
   - ❌ "Click Here", "Learn More" (too vague without context)
5. **Visual hierarchy**: Primary CTA should be most prominent element after headline
6. **Spacing**: 32px above, 16px below primary CTA
7. **Touch target**: Minimum 44px height for mobile (padding + font size ≥ 44px)

### CTA Text Examples by Context

**Reports/Documents**: "View Report", "Download PDF", "Read Analysis"
**Scheduling**: "Schedule Call", "Book Meeting", "Reserve Time"
**Actions**: "Confirm Attendance", "Update Preferences", "Review Details"
**Commerce**: "View Pricing", "Request Quote", "Compare Plans"

---

## 🖼️ IMAGE GUIDELINES

### Hero Images

**Specifications**:
- **Aspect Ratio**: 16:9 (preferred) or 3:2
- **Dimensions**: 1200×675px (2x for retina) or 900×600px
- **File Format**: JPG (photos) or PNG (graphics with transparency)
- **File Size**: <200KB (optimize for email)
- **Placement**: After header, before headline

**Content Guidelines**:
- Professional photography (no stock photo clichés)
- Authentic business settings (real offices, real people)
- Diverse representation (gender, ethnicity, age)
- Natural poses (avoid overly staged corporate headshots)
- Avoid: Forced smiles, unrealistic scenarios, dated imagery

**Implementation**:
\`\`\`tsx
<Img 
  src="https://example.com/hero.jpg"
  alt="Diverse team collaborating on financial analysis in modern office"
  style={{
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    display: 'block'
  }}
/>
\`\`\`

### Image Accessibility (CRITICAL)

**Every image MUST have alt text**:

Good alt text examples:
- ✅ "Team of five professionals reviewing quarterly financial projections on wall-mounted display"
- ✅ "Graph showing 127% revenue growth from Q3 to Q4 2024"
- ✅ "Company logo - Acme Corporation"

Bad alt text examples:
- ❌ "Image" or "Photo"
- ❌ "" (empty alt text, unless purely decorative)
- ❌ "img_1234.jpg"

**Alt Text Rules**:
1. Length: 10-15 words (be descriptive but concise)
2. Include context (who, what, where relevant)
3. For charts: Describe the trend/conclusion
4. For logos: Include company name
5. For decorative images: Use empty alt="" (but avoid decorative images in business emails)

---

## ♿ ACCESSIBILITY REQUIREMENTS

### WCAG AA Compliance (Minimum)

**Color Contrast**:
- Body text (16px): 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Semantic HTML**:
\`\`\`tsx
// ✅ CORRECT - Use semantic components
<Heading>Main Headline</Heading>
<Text>Body paragraph</Text>
<Link href="...">Action text</Link>

// ❌ WRONG - Generic divs
<div style={{ fontSize: '24px', fontWeight: 'bold' }}>Headline</div>
\`\`\`

**Font Size Minimums**:
- Body text: 16px minimum
- Small text: 14px minimum
- Legal/footer: 12px minimum (use sparingly)
- Never below 12px

---

## 📧 EMAIL CLIENT COMPATIBILITY

### Technical Requirements

**CRITICAL - Use INLINE STYLES ONLY**:
\`\`\`tsx
// ✅ CORRECT
<div style={{ padding: '24px', backgroundColor: '#ffffff' }}>

// ❌ WRONG - Email clients strip className
<div className="header">
\`\`\`

**Max Width**:
\`\`\`tsx
<Container style={{ maxWidth: '600px', margin: '0 auto' }}>
  {/* Content */}
</Container>
\`\`\`

---

## ⚠️ COMMON MISTAKES TO AVOID

### Design Mistakes

❌ **Too many competing CTAs** - Maximum 2 CTAs per email
❌ **Walls of text** - Break into 2-3 sentence paragraphs
❌ **Tiny font sizes** - Minimum 16px for body text
❌ **Missing alt text** - Every image needs descriptive alt text
❌ **Vague CTAs** - "Click Here" → Be specific: "View Q4 Report"

### Technical Mistakes

❌ **Using className instead of inline styles**
❌ **Forgetting max-width on container**
❌ **Missing React Email imports**
❌ **Placeholder text** - NO {{variables}}, NO "Lorem ipsum"

---

## 🔧 REACT EMAIL COMPONENT REQUIREMENTS

### Required Imports

\`\`\`tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link
} from '@react-email/components';
\`\`\`

### Complete Email Template Structure

\`\`\`tsx
export default function EmailName() {
  return (
    <Html lang="en">
      <Head>
        <title>Email Title</title>
      </Head>
      <Body style={{
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Header */}
          <Section style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <Img src="..." alt="Company Logo" style={{ height: '40px' }} />
          </Section>

          {/* Hero */}
          <Section style={{ padding: '48px 24px' }}>
            <Img src="..." alt="Descriptive alt text" style={{ width: '100%', maxWidth: '600px' }} />
            
            <Heading style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              lineHeight: '1.2',
              margin: '32px 0 16px 0'
            }}>
              Main Headline Here
            </Heading>
            
            <Text style={{
              fontSize: '18px',
              color: '#4a4a4a',
              lineHeight: '1.6',
              margin: '0 0 16px 0'
            }}>
              Lead paragraph (2-3 sentences).
            </Text>
            
            <Text style={{
              fontSize: '16px',
              color: '#4a4a4a',
              lineHeight: '1.7',
              margin: '0 0 16px 0'
            }}>
              Body text with details.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ padding: '32px 24px', textAlign: 'center' }}>
            <Button
              href="https://example.com/action"
              style={{
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                padding: '14px 32px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Action Text
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{
            padding: '32px 24px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            marginTop: '64px'
          }}>
            <Text style={{ fontSize: '14px', color: '#666', textAlign: 'center', margin: '0 0 8px 0' }}>
              © 2025 Company Name. All rights reserved.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888', textAlign: 'center' }}>
              <Link href="/unsubscribe" style={{ color: '#2563eb' }}>Unsubscribe</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
\`\`\`
`,

  // ============================================================================
  // COMPLETE REFERENCE EXAMPLE
  // ============================================================================

  exampleEmail: `import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link
} from '@react-email/components';

/**
 * Corporate Professional Email Example
 * Use Case: Quarterly earnings announcement to shareholders
 */
export default function Q4EarningsEmail() {
  return (
    <Html lang="en">
      <Head>
        <title>Q4 2024 Results - Acme Corporation</title>
      </Head>
      <Body style={{
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Header */}
          <Section style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#ffffff'
          }}>
            <Img 
              src="https://example.com/logo.png" 
              alt="Acme Corporation Logo" 
              style={{ height: '40px' }}
            />
          </Section>

          {/* Hero Section */}
          <Section style={{ padding: '48px 24px' }}>
            <Img 
              src="https://example.com/hero-q4-results.jpg"
              alt="Diverse team of executives analyzing financial charts in modern conference room"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                display: 'block',
                marginBottom: '32px'
              }}
            />
            
            <Heading style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              lineHeight: '1.2',
              margin: '0 0 16px 0'
            }}>
              Q4 2024 Results Exceed Expectations
            </Heading>
            
            <Text style={{
              fontSize: '18px',
              fontWeight: '400',
              color: '#4a4a4a',
              lineHeight: '1.6',
              margin: '0 0 16px 0'
            }}>
              Our strategic initiatives delivered 127% year-over-year revenue growth in Q4,
              positioning Acme Corporation for continued success in 2025.
            </Text>
            
            <Text style={{
              fontSize: '16px',
              color: '#4a4a4a',
              lineHeight: '1.7',
              margin: '0 0 16px 0'
            }}>
              This exceptional performance reflects the dedication of our team and the trust
              our enterprise clients place in our solutions. We onboarded 45 new Fortune 500
              clients and expanded our product offerings across key verticals.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#4a4a4a',
              lineHeight: '1.7',
              margin: '0'
            }}>
              Thank you for your continued confidence in our vision. We look forward to
              sharing our detailed financial results and 2025 strategic roadmap.
            </Text>
          </Section>

          {/* CTA Section */}
          <Section style={{
            padding: '32px 24px',
            textAlign: 'center'
          }}>
            <Button
              href="https://investors.acme.com/q4-2024-report"
              style={{
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                padding: '14px 32px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              View Full Report
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{
            padding: '32px 24px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            marginTop: '64px'
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#666666',
              textAlign: 'center',
              margin: '0 0 8px 0'
            }}>
              © 2025 Acme Corporation, Inc. All rights reserved.
            </Text>
            
            <Text style={{
              fontSize: '14px',
              color: '#666666',
              textAlign: 'center',
              margin: '0 0 16px 0'
            }}>
              500 Corporate Plaza, Suite 1200 • San Francisco, CA 94105
            </Text>
            
            <Text style={{
              fontSize: '14px',
              color: '#888888',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: 0
            }}>
              You received this email as a valued shareholder of Acme Corporation.{' '}
              <Link 
                href="https://acme.com/preferences" 
                style={{ color: '#2563eb', textDecoration: 'underline' }}
              >
                Update preferences
              </Link>
              {' '}or{' '}
              <Link 
                href="https://acme.com/unsubscribe" 
                style={{ color: '#2563eb', textDecoration: 'underline' }}
              >
                unsubscribe
              </Link>.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}`
};

