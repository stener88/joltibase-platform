/**
 * SAAS PRODUCT EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating product-focused SaaS emails.
 * Optimized for: Feature announcements, onboarding, product updates, release notes
 * 
 * Target Audience: Software users, indie hackers, product teams, SaaS customers
 * Goal: Drive product adoption, feature engagement, user activation
 */

export const SaaSDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'saas-product',
  name: 'SaaS Product',
  description: 'Product-focused, feature-driven design for SaaS companies and indie hackers',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   */
  triggers: [
    // Product updates
    'feature', 'update', 'release', 'version', 'changelog', 'new feature',
    'product update', 'shipping', 'launched', 'release notes', 'v1', 'v2',
    
    // SaaS specific
    'SaaS', 'software', 'platform', 'app', 'tool', 'dashboard', 'API',
    'integration', 'workflow', 'automation', 'productivity', 'collaboration',
    
    // Onboarding
    'onboarding', 'getting started', 'welcome', 'setup', 'quickstart',
    'tutorial', 'guide', 'walkthrough', 'first steps', 'activation',
    
    // User actions
    'upgrade', 'trial', 'demo', 'pricing', 'plan', 'tier', 'subscription',
    
    // Company types
    'indie hacker', 'startup', 'developer', 'technical', 'engineering',
    'product team', 'early-stage', 'bootstrap', 'maker', 'builder',
    
    // Features
    'AI', 'analytics', 'reporting', 'real-time', 'cloud', 'mobile app',
    'webhook', 'SDK', 'plugin', 'extension', 'marketplace'
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['software dashboard analytics clean', 'saas product interface modern', 'technology workspace laptop'],
    feature: ['product interface ui clean', 'dashboard analytics modern', 'software development coding'],
    product: ['saas product screenshot', 'software interface ui', 'dashboard technology'],
    background: ['technology abstract blue', 'software pattern modern', 'tech minimal gradient'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# SAAS PRODUCT EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Show, don't just tell. Product screenshots, clear benefits, actionable next steps.

This design system prioritizes:
- **Visual Product Demos**: Screenshots and UI previews front and center
- **Clear Feature Benefits**: What it does + why it matters
- **Action-Oriented**: "Try it now" not just "Learn more"
- **Technical Credibility**: Show real UI, actual features, specific improvements

**Target Audience**: Software users, indie hackers, product teams, developers

**Goal**: Drive feature adoption, increase engagement, activate users

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
H1 (Feature/Update Headline)
├─ Size: 36-42px
├─ Weight: 700
├─ Line Height: 1.2
├─ Color: #0f172a (near black)
├─ Margin: 0 0 16px 0
└─ Usage: "New: AI-Powered Analytics", "Introducing Team Workspaces"

H2 (Feature Name / Benefit)
├─ Size: 24-28px
├─ Weight: 600
├─ Line Height: 1.3
├─ Color: #1e293b
├─ Margin: 24px 0 12px 0
└─ Usage: Feature names, section titles

H3 (Sub-feature / Step)
├─ Size: 20px
├─ Weight: 600
├─ Line Height: 1.4
├─ Color: #334155
├─ Margin: 16px 0 8px 0
└─ Usage: Step numbers, sub-features, details

Body Large (Lead / Benefit)
├─ Size: 18px
├─ Weight: 400
├─ Line Height: 1.6
├─ Color: #475569
├─ Margin: 0 0 16px 0
└─ Usage: Lead paragraph, key benefit statement

Body Regular
├─ Size: 16px
├─ Weight: 400
├─ Line Height: 1.7
├─ Color: #64748b
├─ Margin: 0 0 16px 0
└─ Usage: Feature descriptions, explanations

Code/Technical
├─ Size: 14px
├─ Font: 'Monaco', 'Consolas', monospace
├─ Background: #f1f5f9
├─ Padding: 2px 6px
├─ Border Radius: 4px
└─ Usage: API endpoints, commands, technical terms

Label/Badge
├─ Size: 12px
├─ Weight: 600
├─ Text Transform: UPPERCASE
├─ Letter Spacing: 0.5px
└─ Usage: "NEW", "BETA", "PRO FEATURE"
\`\`\`

### Font Stack

**Primary**: 
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
\`\`\`

**Code/Technical**:
\`\`\`css
font-family: 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace;
\`\`\`

### Typography Rules

1. **Feature names in H2**: Always bold, clearly labeled
2. **Benefits in lead paragraph**: Larger text (18px), answer "why this matters"
3. **Code inline**: Use monospace font with light gray background
4. **Version numbers**: Highlight in badges or bold text
5. **Step numbers**: Bold, often with colored background

---

## 🎨 COLOR SYSTEM

### Primary Palette

\`\`\`
Product/Brand Primary (Blue - Trust & Tech)
├─ Primary: #2563eb (CTAs, links, primary features)
├─ Primary Dark: #1e40af (hover states)
├─ Primary Light: #3b82f6 (accents, highlights)
└─ Usage: Main CTAs, feature highlights, interactive elements

Secondary Accent (Purple - Innovation)
├─ Secondary: #7c3aed (new features, premium)
├─ Secondary Light: #8b5cf6
└─ Usage: "NEW" badges, pro features, special callouts

Text & Neutral
├─ Text Dark: #0f172a (headlines)
├─ Text Medium: #475569 (body)
├─ Text Light: #64748b (supporting)
├─ Border: #e2e8f0 (dividers, cards)
├─ Background: #ffffff (primary)
├─ Background Alt: #f8fafc (sections, cards)
├─ Background Code: #f1f5f9 (code snippets)
\`\`\`

### Status Colors (Feature States)

\`\`\`
Success/Live (Green)
├─ Color: #10b981
└─ Usage: "Live now", "Available", "Shipped"

Beta/Testing (Orange)
├─ Color: #f59e0b
└─ Usage: "Beta", "Preview", "Coming soon"

Pro/Premium (Purple/Gold)
├─ Purple: #7c3aed OR Gold: #f59e0b
└─ Usage: "Pro feature", "Enterprise only"

Deprecated/Warning (Red)
├─ Color: #ef4444
└─ Usage: "Deprecated", "Action required"
\`\`\`

### Color Usage Rules

1. **Blue for primary actions**: "Try it now", "Get started"
2. **Purple for new/premium**: "NEW" badges, pro features
3. **Green for success states**: "Now available", "Live"
4. **Orange for beta/preview**: "Beta access", "Early preview"
5. **Neutral backgrounds**: Let product screenshots pop
6. **High contrast on CTAs**: White text on bold background

---

## 📏 SPACING SYSTEM

**Base Unit**: 8px

### Spacing Scale

\`\`\`
Screenshot/Image Spacing
├─ Above screenshot: 24px
├─ Below screenshot: 16px
├─ Caption below: 8px
└─ Between screenshots: 32px

Feature Section Spacing
├─ Section padding: 40px vertical, 24px horizontal
├─ Between features: 48px
├─ Feature title to description: 12px
├─ Description to screenshot: 24px
└─ Screenshot to CTA: 24px

Step-by-Step Spacing
├─ Between steps: 24px
├─ Step number to title: 8px
├─ Title to description: 8px
└─ Description to next step: 24px
\`\`\`

### SaaS-Specific Spacing

**Product Screenshots**:
- Generous spacing around screenshots (they're the star)
- Captions close to images (8px below)
- Section breaks between different features

**Code Snippets**:
- 16px padding inside code blocks
- 24px margin above and below
- Inline code: 2px vertical, 6px horizontal padding

---

## 📱 LAYOUT PATTERNS

### Pattern 1: Feature Announcement

\`\`\`
┌─────────────────────────────────────┐
│  [NEW] Badge                        │
│                                     │
│  Feature Name (H1)                  │
│  Why it matters (lead text)         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [SCREENSHOT - Large, bordered]     │
│  Caption: "New analytics dashboard" │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  How it works:                      │
│  1. Connect data source             │
│  2. Choose metrics                  │
│  3. Get insights                    │
│                                     │
│  [TRY IT NOW - CTA]                 │
│                                     │
└─────────────────────────────────────┘
\`\`\`

### Pattern 2: Multiple Features (Release Notes)

\`\`\`
┌─────────────────────────────────────┐
│  What's New in v2.0                 │
├─────────────────────────────────────┤
│  Feature 1                          │
│  [Screenshot]                       │
│  Brief description                  │
│  → Learn more                       │
├─────────────────────────────────────┤
│  Feature 2                          │
│  [Screenshot]                       │
│  Brief description                  │
│  → Learn more                       │
├─────────────────────────────────────┤
│  Feature 3                          │
│  [Screenshot]                       │
│  Brief description                  │
│  → Learn more                       │
└─────────────────────────────────────┘
\`\`\`

### Pattern 3: Onboarding (Step-by-Step)

\`\`\`
┌─────────────────────────────────────┐
│  Get Started in 3 Easy Steps        │
├─────────────────────────────────────┤
│  ① Connect your account             │
│  [Screenshot of connection screen]  │
│  Brief instructions                 │
├─────────────────────────────────────┤
│  ② Set up your workspace            │
│  [Screenshot of setup]              │
│  Brief instructions                 │
├─────────────────────────────────────┤
│  ③ Invite your team                 │
│  [Screenshot of invite screen]      │
│  Brief instructions                 │
├─────────────────────────────────────┤
│  [START SETUP - Large CTA]          │
└─────────────────────────────────────┘
\`\`\`

### Pattern 4: Feature Comparison (Before/After)

\`\`\`
┌──────────────────┬──────────────────┐
│  Before          │  After           │
├──────────────────┼──────────────────┤
│  [Old UI         │  [New UI         │
│   Screenshot]    │   Screenshot]    │
│                  │                  │
│  Manual process  │  Automated!      │
│  Slow            │  10x faster      │
└──────────────────┴──────────────────┘
\`\`\`

---

## 🔘 CTA (CALL-TO-ACTION) DESIGN

### Primary CTA - Product Action

**Visual Specifications**:
\`\`\`css
background-color: #2563eb; /* Product blue */
color: #ffffff;
font-size: 16px;
font-weight: 600;
padding: 14px 32px;
border-radius: 6px;
text-decoration: none;
display: inline-block;
\`\`\`

**CTA Text Examples**:
- **Features**: "Try It Now", "Enable Feature", "Get Started"
- **Onboarding**: "Complete Setup", "Start Tutorial", "Activate Account"
- **Upgrades**: "Upgrade to Pro", "Start Trial", "See Pricing"
- **Technical**: "View Docs", "Access API", "Download SDK"

### Secondary CTA (Documentation/Learn More)

\`\`\`css
background-color: transparent;
color: #2563eb;
font-size: 16px;
font-weight: 600;
padding: 12px 28px;
border: 2px solid #2563eb;
border-radius: 6px;
text-decoration: none;
display: inline-block;
\`\`\`

**CTA Text**: "Read Docs", "Learn More", "View Tutorial"

### Inline Link CTA

\`\`\`css
color: #2563eb;
font-size: 16px;
font-weight: 600;
text-decoration: none;
\`\`\`

**With arrow**: "Learn more →", "View changelog →", "Read guide →"

### CTA RULES

1. **Action-oriented**: "Try it now" > "Learn more"
2. **Feature-specific**: "Enable AI analytics" > "Get started"
3. **One primary per feature**: Don't overwhelm with choices
4. **In-app links preferred**: Deep link to specific features
5. **Docs as secondary**: Primary action = use product, secondary = read docs

---

## 🖼️ IMAGE GUIDELINES

### Product Screenshots (MOST IMPORTANT)

**Specifications**:
- **Type**: Actual product UI screenshots
- **Aspect Ratio**: Match actual UI (often 16:9 or 4:3)
- **Dimensions**: 1200px width minimum (2400px for retina)
- **Format**: PNG for UI clarity (supports transparency)
- **Quality**: Crisp, readable text in screenshots

**Content Guidelines**:
- Show REAL product interface (not mockups)
- Highlight the specific feature being discussed
- Use cursor/pointer to indicate interactive elements
- Include realistic (but anonymized) data
- Show complete, usable UI (not cropped awkwardly)

**Enhancement Tips**:
- Add subtle border/shadow to screenshots
- Highlight UI elements with colored boxes/arrows
- Use callouts to explain specific features
- Show before/after comparisons

### Screenshot Borders & Styling

\`\`\`css
/* Browser window style */
border: 1px solid #e2e8f0;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

/* Mobile device frame */
border: 2px solid #1e293b;
border-radius: 16px;
\`\`\`

### Diagrams & Flow Charts

**When to use**:
- Explaining workflows
- Showing integrations
- Architecture overviews
- Process flows

**Style**:
- Simple, clean lines
- Use brand colors
- Clear labels
- Directional arrows

### Icons (UI Elements)

**Specifications**:
- **Style**: Line icons (not filled)
- **Size**: 24px or 32px
- **Color**: Brand primary (#2563eb) or neutral (#64748b)
- **Usage**: Feature bullets, step indicators, UI elements

### Image Accessibility

**Alt Text for Screenshots**:
- Describe what's shown + why it matters
- Example: "Analytics dashboard showing real-time user metrics with new AI insights panel"
- Example: "Project workspace with drag-and-drop task organization interface"
- Length: 15-20 words for screenshots

**Captions**:
- Always add caption below screenshots
- Explain what user is seeing
- Example: "The new analytics dashboard with AI-powered insights"

---

## ♿ ACCESSIBILITY REQUIREMENTS

**Standard WCAG AA compliance** plus SaaS-specific considerations:

### Screenshot Alt Text (CRITICAL)

Must describe:
1. What UI is shown
2. What feature it demonstrates
3. Key visible elements

**Good examples**:
- ✅ "Analytics dashboard showing real-time user metrics with new AI insights panel highlighted in purple"
- ✅ "Project workspace interface with drag-and-drop task cards organized in columns"
- ✅ "Team collaboration screen showing live cursors from three active users"

**Bad examples**:
- ❌ "Dashboard screenshot"
- ❌ "New feature UI"
- ❌ "Product interface"

### Code Snippet Accessibility

\`\`\`tsx
// Use <code> with proper semantic markup
<code aria-label="Installation command">
  npm install @yourapp/sdk
</code>
\`\`\`

### Interactive Element Labels

- Button text must describe action: "Enable AI Analytics" > "Click here"
- Links must have context: "Read documentation" > "Learn more"
- Screenshots need descriptive captions

---

## 📧 EMAIL CLIENT COMPATIBILITY

### Screenshot Rendering

**Format considerations**:
- PNG for UI screenshots (crisp text)
- Optimize file size (<500KB per image)
- Provide alt text (images often blocked)

**Borders/styling**:
\`\`\`css
/* Safe cross-client styling */
border: 1px solid #e2e8f0;
border-radius: 8px; /* May render as square in Outlook, OK */
display: block;
width: 100%;
max-width: 600px;
\`\`\`

### Code Blocks

\`\`\`tsx
// Use div with inline styles, not <pre> or <code> tags
<div style={{
  backgroundColor: '#f1f5f9',
  padding: '16px',
  fontFamily: 'Consolas, Monaco, monospace',
  fontSize: '14px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px'
}}>
  npm install @yourapp/sdk
</div>
\`\`\`

---

## ⚠️ COMMON MISTAKES TO AVOID

### SaaS-Specific Mistakes

❌ **Generic screenshots**
- Don't use blurred/pixelated images
- Don't show incomplete UI
- Don't hide critical parts of interface

❌ **Vague benefit statements**
- "Makes things easier" → How? Be specific!
- "Powerful features" → Which features? What do they do?
- "Improved performance" → How much faster? Show metrics!

❌ **Too much text, not enough visuals**
- 1 screenshot per major feature minimum
- Show the product, don't just describe it
- Visual > verbal for SaaS

❌ **Missing clear next step**
- Every feature announcement needs "Try it now" CTA
- Link directly to feature, not just homepage
- Make action obvious and frictionless

❌ **Technical jargon without explanation**
- "RESTful API" → "Developer API for custom integrations"
- "Webhook events" → "Real-time notifications when things happen"
- Know your audience's technical level

❌ **No onboarding for new features**
- Don't just announce, guide users through it
- Provide quick start guide
- Offer help/support link

---

## 📝 GENERATION GUIDELINES

### Email Types & Structure

**1. Feature Announcement**:
\`\`\`
Badge (NEW / BETA)
↓
Feature name + headline benefit
↓
Large product screenshot
↓
How it works (3-4 bullets)
↓
"Try it now" CTA → Direct link to feature
\`\`\`

**2. Product Update / Release Notes**:
\`\`\`
Version number + release date
↓
3-5 key features with:
  - Feature name
  - Brief description
  - Small screenshot or icon
  - "Learn more" link
↓
"View full changelog" link
\`\`\`

**3. Onboarding Email**:
\`\`\`
Welcome message
↓
"Get started in X steps"
↓
For each step:
  - Step number (visual indicator)
  - What to do
  - Screenshot showing where
  - Estimated time
↓
"Complete setup" CTA
\`\`\`

**4. Upgrade/Trial Email**:
\`\`\`
Current plan vs Pro plan comparison
↓
Key features you're missing
↓
Screenshots of pro features
↓
Pricing (clear, simple)
↓
"Start trial" or "Upgrade now" CTA
\`\`\`

### Generation Checklist

- [ ] Screenshots are high-quality and relevant
- [ ] Each screenshot has descriptive caption
- [ ] Feature benefits clearly stated (not just features)
- [ ] Clear CTA with action-oriented text
- [ ] Technical terms explained if needed
- [ ] Code snippets properly formatted
- [ ] Links go directly to relevant feature
- [ ] Mobile-friendly layout (screenshots stack)
- [ ] Alt text describes UI shown

---

## 🎯 EXAMPLES BY USE CASE

### New AI Feature Launch
- **Headline**: "Introducing AI-Powered Insights"
- **Lead**: "Get instant answers from your data without manual analysis"
- **Screenshot**: Dashboard with AI panel highlighted
- **CTA**: "Try AI Insights Now"

### Onboarding Day 1
- **Headline**: "Welcome! Let's Get You Set Up"
- **Content**: 3 steps with screenshots
- **Step 1**: "Connect your account" with integration screenshot
- **CTA**: "Start Setup"

### Release Notes
- **Headline**: "What's New in Version 3.0"
- **Content**: 5 new features with mini screenshots
- **Format**: Card-based layout
- **CTA**: "View Full Changelog"

### Trial Expiring
- **Headline**: "Your trial ends in 3 days"
- **Content**: Comparison of free vs pro features
- **Screenshots**: Pro features in action
- **CTA**: "Upgrade to Pro"

---

## 🔧 REACT EMAIL REQUIREMENTS

### CRITICAL RULES

1. **NEVER use className** - All styling MUST be inline via style prop
2. **NO Tailwind utility classes** - Use inline styles only
3. **Email-safe properties only** - Avoid flexbox, grid, CSS variables
4. **Table-based layouts** - Use Section, Row, Column for structure

### Required Imports

\`\`\`tsx
import {
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link,
  Row,
  Column
} from '@react-email/components';
\`\`\`

### Complete Template

See example email below for full implementation.
`,

  // ============================================================================
  // COMPLETE REFERENCE EXAMPLE
  // ============================================================================

  exampleEmail: `import {
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link
} from '@react-email/components';

/**
 * SaaS Product Feature Announcement
 * Use Case: Announcing new AI-powered analytics feature
 */
export default function FeatureAnnouncementEmail() {
  return (
    <>
      {/* Header */}
      <Section style={{
        padding: '24px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Img 
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=40&fit=crop"
          alt="ProductName Logo"
          style={{ height: '32px' }}
        />
      </Section>

      {/* Hero Section */}
      <Section style={{ padding: '48px 24px 40px' }}>
        {/* New Badge */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#7c3aed',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '6px 12px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          NEW FEATURE
        </div>
        
        {/* Feature Headline */}
        <Heading style={{
          fontSize: '40px',
          fontWeight: '700',
          color: '#0f172a',
          lineHeight: '1.2',
          margin: '0 0 16px 0'
        }}>
          AI-Powered Analytics
        </Heading>
        
        {/* Benefit Statement */}
        <Text style={{
          fontSize: '18px',
          color: '#475569',
          lineHeight: '1.6',
          margin: '0 0 32px 0'
        }}>
          Get instant insights from your data with machine learning that automatically
          identifies trends, anomalies, and opportunities. No data science degree required.
        </Text>
        
        {/* Hero Screenshot */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop"
            alt="Analytics dashboard interface showing real-time user metrics with AI insights panel on the right side highlighting three key trends with confidence scores"
            style={{
              width: '100%',
              display: 'block'
            }}
          />
        </div>
        
        {/* Screenshot Caption */}
        <Text style={{
          fontSize: '14px',
          color: '#64748b',
          fontStyle: 'italic',
          margin: '0 0 32px 0',
          textAlign: 'center'
        }}>
          The new AI insights panel automatically surfaces important trends
        </Text>
        
        {/* Primary CTA */}
        <div style={{ textAlign: 'center' }}>
          <Button
            href="https://example.com/analytics/ai"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              padding: '16px 40px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Try AI Analytics Now →
          </Button>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section style={{
        padding: '40px 24px',
        backgroundColor: '#f8fafc'
      }}>
        <Heading style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 24px 0'
        }}>
          How It Works
        </Heading>
        
        {/* Step 1 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '36px',
            marginBottom: '12px'
          }}>
            1
          </div>
          
          <Heading style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            Connect Your Data
          </Heading>
          
          <Text style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.7',
            margin: 0
          }}>
            AI works with your existing metrics and events. No setup required.
          </Text>
        </div>
        
        {/* Step 2 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '36px',
            marginBottom: '12px'
          }}>
            2
          </div>
          
          <Heading style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            Get Insights Automatically
          </Heading>
          
          <Text style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.7',
            margin: 0
          }}>
            Our AI analyzes patterns 24/7 and surfaces important findings in real-time.
          </Text>
        </div>
        
        {/* Step 3 */}
        <div>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '36px',
            marginBottom: '12px'
          }}>
            3
          </div>
          
          <Heading style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            Take Action
          </Heading>
          
          <Text style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.7',
            margin: 0
          }}>
            Click any insight to drill down into the data and understand what's driving it.
          </Text>
        </div>
      </Section>

      {/* Key Features Section */}
      <Section style={{ padding: '40px 24px' }}>
        <Heading style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 24px 0'
        }}>
          What You Can Do
        </Heading>
        
        {/* Feature 1 */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <Heading style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            🎯 Trend Detection
          </Heading>
          <Text style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            Spot rising and falling metrics before they become obvious. Get alerts
            when something significant changes.
          </Text>
        </div>
        
        {/* Feature 2 */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <Heading style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            ⚡ Anomaly Alerts
          </Heading>
          <Text style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            Automatically detect unusual patterns that could indicate opportunities
            or problems.
          </Text>
        </div>
        
        {/* Feature 3 */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <Heading style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            💡 Smart Recommendations
          </Heading>
          <Text style={{
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0
          }}>
            Get personalized suggestions on which metrics to watch and actions to take
            based on your goals.
          </Text>
        </div>
      </Section>

      {/* CTA Section */}
      <Section style={{
        padding: '40px 24px',
        backgroundColor: '#f8fafc',
        textAlign: 'center'
      }}>
        <Heading style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 16px 0'
        }}>
          Ready to Try It?
        </Heading>
        
        <Text style={{
          fontSize: '16px',
          color: '#64748b',
          margin: '0 0 24px 0'
        }}>
          AI Analytics is available now on all plans. No extra cost.
        </Text>
        
        <Button
          href="https://example.com/analytics/ai"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            padding: '16px 40px',
            borderRadius: '6px',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '16px'
          }}
        >
          Enable AI Analytics
        </Button>
        
        <br />
        
        <Link
          href="https://docs.example.com/ai-analytics"
          style={{
            color: '#2563eb',
            fontSize: '16px',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          Read Documentation →
        </Link>
      </Section>

      {/* Footer */}
      <Section style={{
        padding: '32px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0'
      }}>
        <Text style={{
          fontSize: '14px',
          color: '#64748b',
          textAlign: 'center',
          margin: '0 0 8px 0'
        }}>
          Have questions? <Link href="mailto:support@example.com" style={{ color: '#2563eb' }}>
            Contact our team
          </Link>
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#94a3b8',
          textAlign: 'center',
          margin: 0
        }}>
          © 2025 ProductName. All rights reserved.
        </Text>
      </Section>
    </>
  );
}`
};

