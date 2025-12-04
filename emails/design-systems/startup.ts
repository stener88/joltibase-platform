/**
 * MODERN STARTUP EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating bold, energetic startup emails.
 * Optimized for: SaaS companies, tech startups, product launches, app announcements
 * 
 * Target Audience: Tech-forward users, early adopters, startup enthusiasts
 * Goal: Generate excitement, drive signups, create momentum
 */

export const ModernStartupDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'modern-startup',
  name: 'Modern Startup',
  description: 'Bold, vibrant, high-energy design for tech startups and SaaS companies',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   */
  triggers: [
    // Company types
    'startup', 'indie hacker', 'founder', 'entrepreneur', 'venture',
    
    // Launch language
    'launch', 'launching', 'ship', 'shipping', 'drop',
    'announce', 'introducing', 'unveiling', 'reveal',
    
    // Access/exclusivity
    'beta', 'early access', 'invite', 'waitlist', 'exclusive',
    'preview', 'first look', 'limited access', 'insider',
    
    // Innovation language
    'innovation', 'innovative', 'revolutionary', 'disruptive',
    'game-changing', 'breakthrough', 'next-gen', 'cutting-edge',
    'reimagined',
    
    // Growth/momentum
    'growing', 'scaling', 'expanding', 'momentum', 'traction',
    'milestone', 'achievement', 'funding', 'seed', 'series A',
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['startup', 'technology', 'innovation'],
    feature: ['workspace', 'team', 'entrepreneurs'],
    product: ['interface', 'modern', 'colorful'],
    background: ['gradient', 'vibrant', 'abstract'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# MODERN STARTUP EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Bold, energetic, forward-thinking. Make recipients feel like they're part of something exciting and new.

This design system prioritizes:
- **Visual Impact**: Vibrant gradients, large typography, dynamic layouts
- **Energy & Momentum**: Create excitement and FOMO
- **Approachable Innovation**: Playful but professional, fun but credible
- **Modern Aesthetics**: Contemporary design that feels fresh and cutting-edge

**Target Audience**: Tech enthusiasts, early adopters, startup community, SaaS users

**Goal**: Drive signups, create buzz, establish momentum

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
H1 (Main Headline - MAXIMUM IMPACT)
├─ Size: 48-56px (LARGE AND BOLD!)
├─ Weight: 800-900 (extra bold)
├─ Line Height: 1.1 (tight for impact)
├─ Color: #111827 OR gradient text
├─ Text Transform: Sometimes UPPERCASE for energy
├─ Letter Spacing: -0.5px (tight, modern)
├─ Margin: 0 0 20px 0
└─ Usage: "Ship 10x Faster", "The Future is Here"

H2 (Feature Headlines)
├─ Size: 32-40px
├─ Weight: 700
├─ Line Height: 1.2
├─ Color: #1f2937 or gradient
├─ Margin: 32px 0 16px 0
└─ Usage: Feature names, section headers

H3 (Sub-features)
├─ Size: 24-28px
├─ Weight: 600
├─ Line Height: 1.3
├─ Color: #374151
├─ Margin: 24px 0 12px 0
└─ Usage: Benefit callouts, step titles

Body Large (Lead Text)
├─ Size: 20px (LARGER than corporate!)
├─ Weight: 400
├─ Line Height: 1.5 (tighter, more energetic)
├─ Color: #4b5563
├─ Margin: 0 0 16px 0
└─ Usage: Value propositions, key benefits

Body Regular
├─ Size: 18px (larger than standard 16px)
├─ Weight: 400
├─ Line Height: 1.6
├─ Color: #6b7280
├─ Margin: 0 0 16px 0
└─ Usage: Descriptions, explanations

Badge/Label Text
├─ Size: 11-13px
├─ Weight: 700
├─ Text Transform: UPPERCASE
├─ Letter Spacing: 1px
├─ Colors: Gradient backgrounds
└─ Usage: "NEW", "BETA", "COMING SOON", "LIVE"
\`\`\`

### Font Stack

**Primary**: 
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif;
\`\`\`

**For Extra Impact** (Headlines):
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
font-weight: 900;
letter-spacing: -1px; /* Tight, modern feel */
\`\`\`

### Typography Rules

1. **Go big or go home**: Headlines should dominate
2. **Tight letter-spacing**: Modern, condensed feel (-0.5px to -1px)
3. **Generous line-height in body**: Readable but energetic (1.6)
4. **Bold everything**: Minimum 600 weight for emphasis
5. **Uppercase for energy**: Feature badges, CTAs, labels
6. **Dynamic sizing**: Don't be afraid of 56px headlines

---

## 🎨 COLOR SYSTEM

### Primary Palette (VIBRANT & BOLD)

\`\`\`
Purple/Violet (Innovation & Tech)
├─ Purple Dark: #6d28d9
├─ Purple Primary: #7c3aed
├─ Purple Light: #a855f7
├─ Purple Lighter: #c084fc
└─ Usage: Headlines, primary CTAs, badges, accents

Teal/Cyan (Modern & Fresh)
├─ Teal Dark: #0891b2
├─ Teal Primary: #06b6d4
├─ Teal Light: #22d3ee
├─ Teal Lighter: #67e8f9
└─ Usage: Secondary elements, highlights, icons

Orange (Energy & Action)
├─ Orange Dark: #ea580c
├─ Orange Primary: #f97316
├─ Orange Light: #fb923c
└─ Usage: PRIMARY CTAs, urgency, action buttons

Neutral Foundation
├─ Text Dark: #111827
├─ Text Medium: #4b5563
├─ Text Light: #6b7280
├─ Border: #e5e7eb
├─ Background: #ffffff
├─ Background Alt: #f9fafb
├─ Background Gradient: Purple/Teal gradients
\`\`\`

### Gradient System (SIGNATURE ELEMENT)

**Primary Gradients**:
\`\`\`css
/* Purple to Blue (Default) */
background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);

/* Teal to Green (Fresh) */
background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);

/* Purple to Pink (Vibrant) */
background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);

/* Orange to Pink (Energy) */
background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
\`\`\`

**Where to Use Gradients**:
- Hero backgrounds
- CTA buttons
- Section dividers
- Badge backgrounds
- Icon backgrounds
- Optional: Headline text

### Color Usage Rules

1. **Vibrant colors encouraged**: Don't be shy with saturation
2. **Gradients are signature**: Use liberally but intentionally
3. **Orange for CTAs**: High-energy, action-oriented
4. **Purple for brand**: Innovation, tech-forward
5. **Teal for secondary**: Modern, fresh, supporting
6. **High contrast essential**: White text on gradients
7. **Maximum 4 colors per email**: Purple + Teal + Orange + Neutral

---

## 📏 SPACING SYSTEM

**Base Unit**: 8px

### Spacing Scale (More Generous Than Corporate)

\`\`\`
Hero Section Spacing
├─ Padding: 64-80px vertical (LARGE!)
├─ Headline to subtext: 20px
├─ Subtext to CTA: 32px
├─ CTA to supporting: 24px

Feature Section Spacing
├─ Section padding: 56px vertical
├─ Between features: 48px (generous)
├─ Feature title to description: 16px
├─ Description to visual: 24px

Component Spacing
├─ Between major sections: 56px
├─ Paragraph spacing: 20px (generous)
├─ Element spacing: 12px minimum
└─ Card internal padding: 32px
\`\`\`

### Modern Startup Specific Spacing

**Generous Whitespace**:
- More breathing room than corporate
- 64-80px vertical padding in hero
- 48px between major sections
- Prioritize impact over density

**Asymmetric Layouts OK**:
- Offset elements for visual interest
- Varied spacing for dynamic feel
- Break the grid strategically

---

## 🔘 CTA (CALL-TO-ACTION) DESIGN

### Primary CTA - Maximum Energy

**Visual Specifications**:
\`\`\`css
/* BOLD, HIGH-ENERGY GRADIENT BUTTON */
background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
background-color: #f97316; /* Fallback */
color: #ffffff;
font-size: 18-20px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 1px;
padding: 18px 48px; /* Extra generous */
border-radius: 12px; /* More rounded than corporate */
box-shadow: 0 8px 16px rgba(249, 115, 22, 0.3); /* Prominent shadow */
text-decoration: none;
display: inline-block;
\`\`\`

**CTA Text Examples**:
- **Launches**: "GET EARLY ACCESS", "JOIN THE WAITLIST", "CLAIM YOUR SPOT"
- **Features**: "TRY IT FREE", "START BUILDING", "GET STARTED"
- **Beta**: "REQUEST INVITE", "JOIN BETA", "GET ACCESS"
- **Action**: "SHIP FASTER", "BUILD NOW", "LET'S GO"

### Secondary CTA (Outlined)

\`\`\`css
background-color: transparent;
color: #7c3aed; /* Purple */
font-size: 16px;
font-weight: 600;
padding: 14px 32px;
border: 2px solid #7c3aed;
border-radius: 12px;
text-decoration: none;
\`\`\`

**CTA Text**: "Learn More", "See Demo", "View Pricing"

### CTA RULES

1. **Primary CTA always gradient**: Orange gradient for energy
2. **Large and prominent**: 18-20px text, generous padding
3. **One per section maximum**: Don't dilute attention
4. **Action-oriented language**: "Start", "Join", "Get", "Build"
5. **Uppercase encouraged**: Adds energy and urgency
6. **No vague CTAs**: "Click here" is banned

---

## 🖼️ IMAGE GUIDELINES

### Product Screenshots (Critical)

**Specifications**:
- **Style**: Modern UI, clean interfaces
- **Quality**: Crisp, high-res (2x for retina)
- **Format**: PNG for UI elements
- **Enhancements**: Add subtle shadows, gradients, or glow

**Enhancement Tips**:
\`\`\`css
/* Add modern depth to screenshots */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
border-radius: 16px;
border: 1px solid rgba(124, 58, 237, 0.1); /* Subtle purple border */
\`\`\`

**Content Guidelines**:
- Show actual product (not mockups)
- Feature the UI being discussed
- Use realistic but anonymized data
- Include brand colors in screenshots

### Emojis (Encouraged!)

**Modern startups embrace emojis**:
- Use strategically in headlines
- Feature icons (🎯 Target, 🚀 Launch)
- Celebratory moments (🎉 Launch, 🔥 Trending)
- Keep professional but playful
- Maximum 2-3 per email

### Image Accessibility

**Alt Text**:
- Describe UI shown + context
- Example: "Dashboard interface showing real-time analytics with purple gradient chart"
- Example: "Mobile app login screen with biometric authentication icon"

---

## ♿ ACCESSIBILITY REQUIREMENTS

**Standard WCAG AA compliance** with modern startup considerations:

### Gradient Text Accessibility

**CRITICAL**: Gradient text can have poor contrast
\`\`\`tsx
// ALWAYS provide fallback solid color
background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
color: #7c3aed; /* Fallback for non-supporting clients */
\`\`\`

### High Contrast Requirements

- Gradient backgrounds: Always use white text
- Colorful sections: Ensure 4.5:1 contrast minimum
- Orange CTAs: White text required (passes WCAG)

---

## 📧 EMAIL CLIENT COMPATIBILITY

### Gradient Support

**Gradients work in**:
- Apple Mail ✅
- Gmail (web/mobile) ✅
- Outlook.com ✅

**Gradients fail in**:
- Outlook (desktop) ❌ → Falls back to solid color

**Solution**: Always provide fallback
\`\`\`css
background-color: #7c3aed; /* Fallback */
background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
\`\`\`

---

## ⚠️ COMMON MISTAKES TO AVOID

### Modern Startup Specific

❌ **Too many gradients**
- Maximum 3 gradient elements per email
- Hero + CTA + One accent = Perfect

❌ **Gradient text everywhere**
- Use sparingly (headlines only)
- Most text should be solid colors

❌ **Being too playful**
- Still professional - this is business
- Emojis: 2-3 max per email
- Don't use slang or memes

❌ **Tiny text on gradients**
- Minimum 18px on gradient backgrounds
- Ensure contrast is sufficient

❌ **Forgetting fallbacks**
- Always solid color fallback for gradients
- Test in Outlook (desktop)

---

## 📝 GENERATION GUIDELINES

### Email Types & Structure

**1. Product Launch**:
\`\`\`
Gradient hero with big headline
↓
"What we built" (feature showcase)
↓
Stats section (social proof)
↓
"Join us" CTA
\`\`\`

**2. Beta Invite**:
\`\`\`
Exclusive badge
↓
"You're invited" headline
↓
Why it's special
↓
Waitlist CTA
↓
FOMO elements (limited spots)
\`\`\`

**3. Milestone/Funding**:
\`\`\`
Celebratory header
↓
The achievement
↓
What it means (vision)
↓
"Join our journey" CTA
\`\`\`

### Generation Checklist

- [ ] Gradient used (hero OR CTA minimum)
- [ ] Headlines are large (44px+)
- [ ] Orange CTA with uppercase text
- [ ] Energy badges ("NEW", "BETA", "LIVE")
- [ ] Modern screenshots with shadows
- [ ] Social proof numbers
- [ ] Generous whitespace (64px+ in hero)
- [ ] Emojis used strategically (2-3 max)
- [ ] Fallback colors for gradients

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
  Link
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
 * Modern Startup Email Example
 * Use Case: SaaS product launch announcement
 */
export default function ProductLaunchEmail() {
  return (
    <>
      {/* Gradient Hero Section */}
      <Section style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
        backgroundColor: '#7c3aed',
        padding: '80px 32px',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        {/* Launch Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '8px 20px',
          borderRadius: '24px',
          marginBottom: '28px'
        }}>
          ✨ NOW LIVE
        </div>
        
        {/* Main Headline */}
        <Heading style={{
          fontSize: '56px',
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          margin: '0 0 24px 0'
        }}>
          Ship 10x Faster
        </Heading>
        
        {/* Subheadline */}
        <Text style={{
          fontSize: '24px',
          fontWeight: '400',
          color: 'rgba(255, 255, 255, 0.95)',
          lineHeight: '1.5',
          maxWidth: '560px',
          margin: '0 auto 40px'
        }}>
          The AI-powered platform that helps startups build, launch, and scale
          without the complexity. From idea to production in minutes, not months.
        </Text>
        
        {/* Primary CTA */}
        <Button
          href="https://example.com/signup"
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '22px 60px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 10px 20px rgba(249, 115, 22, 0.4)',
            marginBottom: '24px'
          }}
        >
          START BUILDING FREE
        </Button>
        
        {/* Social Proof */}
        <Text style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.85)',
          margin: 0
        }}>
          ✓ Join 10,000+ founders • ✓ No credit card required
        </Text>
      </Section>

      {/* Stats Section */}
      <Section style={{
        padding: '64px 32px',
        backgroundColor: '#f9fafb',
        textAlign: 'center'
      }}>
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td width="33%" valign="top" style={{ padding: '0 20px' }}>
              <div style={{
                fontSize: '64px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#7c3aed',
                lineHeight: '1',
                marginBottom: '16px'
              }}>
                10K+
              </div>
              <Text style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#4b5563',
                margin: 0
              }}>
                Active Builders
              </Text>
            </td>
            
            <td width="33%" valign="top" style={{ padding: '0 20px' }}>
              <div style={{
                fontSize: '64px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#06b6d4',
                lineHeight: '1',
                marginBottom: '16px'
              }}>
                &lt;10ms
              </div>
              <Text style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#4b5563',
                margin: 0
              }}>
                API Response
              </Text>
            </td>
            
            <td width="33%" valign="top" style={{ padding: '0 20px' }}>
              <div style={{
                fontSize: '64px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#f97316',
                lineHeight: '1',
                marginBottom: '16px'
              }}>
                99.9%
              </div>
              <Text style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#4b5563',
                margin: 0
              }}>
                Uptime SLA
              </Text>
            </td>
          </tr>
        </table>
      </Section>

      {/* Feature 1: AI Code Generation */}
      <Section style={{ padding: '64px 32px' }}>
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td width="50%" valign="middle" style={{ paddingRight: '32px' }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.1)'
              }}>
                <Img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
                  alt="AI code generation interface showing natural language input transforming into production-ready React components"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </td>
            
            <td width="50%" valign="middle" style={{ paddingLeft: '32px' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#7c3aed',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '16px'
              }}>
                ⚡ AI-POWERED
              </div>
              
              <Heading style={{
                fontSize: '44px',
                fontWeight: '800',
                color: '#111827',
                lineHeight: '1.15',
                letterSpacing: '-0.5px',
                margin: '0 0 20px 0'
              }}>
                Build in Plain English
              </Heading>
              
              <Text style={{
                fontSize: '20px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0 0 28px 0'
              }}>
                Describe what you want in natural language. Our AI generates
                production-ready code, complete with tests and documentation.
              </Text>
              
              <Link
                href="https://example.com/features/ai-generation"
                style={{
                  color: '#7c3aed',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                See it in action →
              </Link>
            </td>
          </tr>
        </table>
      </Section>

      {/* Feature 2: Instant Deploy */}
      <Section style={{ padding: '64px 32px', backgroundColor: '#f9fafb' }}>
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            {/* Text Left (reverse order) */}
            <td width="50%" valign="middle" style={{ paddingRight: '32px' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#06b6d4',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '16px'
              }}>
                🚀 ONE-CLICK
              </div>
              
              <Heading style={{
                fontSize: '44px',
                fontWeight: '800',
                color: '#111827',
                lineHeight: '1.15',
                letterSpacing: '-0.5px',
                margin: '0 0 20px 0'
              }}>
                Deploy to Production
              </Heading>
              
              <Text style={{
                fontSize: '20px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0 0 28px 0'
              }}>
                From local development to global CDN in seconds. Zero configuration,
                automatic scaling, and built-in monitoring.
              </Text>
              
              <Link
                href="https://example.com/features/deploy"
                style={{
                  color: '#06b6d4',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Explore deployment →
              </Link>
            </td>
            
            {/* Image Right */}
            <td width="50%" valign="middle" style={{ paddingLeft: '32px' }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(6, 182, 212, 0.2)',
                border: '1px solid rgba(6, 182, 212, 0.1)'
              }}>
                <Img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                  alt="Deployment dashboard showing live production metrics and automatic scaling configuration"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </td>
          </tr>
        </table>
      </Section>

      {/* What You Get Section */}
      <Section style={{ padding: '64px 32px' }}>
        <Heading style={{
          fontSize: '40px',
          fontWeight: '700',
          color: '#111827',
          textAlign: 'center',
          margin: '0 0 48px 0'
        }}>
          Everything You Need to Ship Fast
        </Heading>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td width="50%" valign="top" style={{ padding: '0 16px 32px 0' }}>
              <Text style={{ fontSize: '40px', margin: '0 0 12px 0' }}>⚡</Text>
              <Heading style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                AI Code Generation
              </Heading>
              <Text style={{
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Write in natural language, get production code instantly
              </Text>
            </td>
            
            <td width="50%" valign="top" style={{ padding: '0 0 32px 16px' }}>
              <Text style={{ fontSize: '40px', margin: '0 0 12px 0' }}>🚀</Text>
              <Heading style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                One-Click Deploy
              </Heading>
              <Text style={{
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Global CDN, automatic scaling, zero configuration
              </Text>
            </td>
          </tr>
          
          <tr>
            <td width="50%" valign="top" style={{ padding: '0 16px 0 0' }}>
              <Text style={{ fontSize: '40px', margin: '0 0 12px 0' }}>🔒</Text>
              <Heading style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                Enterprise Security
              </Heading>
              <Text style={{
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                SOC 2 compliant, encrypted at rest and in transit
              </Text>
            </td>
            
            <td width="50%" valign="top" style={{ padding: '0 0 0 16px' }}>
              <Text style={{ fontSize: '40px', margin: '0 0 12px 0' }}>📊</Text>
              <Heading style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                Real-Time Analytics
              </Heading>
              <Text style={{
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Monitor performance, errors, and user behavior live
              </Text>
            </td>
          </tr>
        </table>
      </Section>

      {/* Final CTA Section */}
      <Section style={{
        padding: '72px 32px',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        backgroundColor: '#1f2937',
        textAlign: 'center'
      }}>
        <Heading style={{
          fontSize: '44px',
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: '1.2',
          margin: '0 0 20px 0'
        }}>
          Ready to Ship 10x Faster?
        </Heading>
        
        <Text style={{
          fontSize: '20px',
          color: '#d1d5db',
          margin: '0 0 40px 0'
        }}>
          Join thousands of founders building the future
        </Text>
        
        <Button
          href="https://example.com/signup"
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '22px 60px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 10px 20px rgba(249, 115, 22, 0.5)',
            marginBottom: '24px'
          }}
        >
          START FREE TRIAL
        </Button>
        
        <Text style={{
          fontSize: '16px',
          color: '#9ca3af',
          margin: 0
        }}>
          No credit card required • 14-day free trial • Cancel anytime
        </Text>
      </Section>

      {/* Footer */}
      <Section style={{
        padding: '40px 32px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb'
      }}>
        <Text style={{
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          margin: '0 0 12px 0'
        }}>
          Questions? <Link href="mailto:hello@example.com" style={{ color: '#7c3aed', fontWeight: '600' }}>
            We're here to help
          </Link>
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#9ca3af',
          textAlign: 'center',
          margin: 0
        }}>
          © 2025 ShipFast AI. All rights reserved.
        </Text>
      </Section>
    </>
  );
}`
};

