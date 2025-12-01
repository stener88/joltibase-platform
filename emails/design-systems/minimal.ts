/**
 * MINIMAL ELEGANT EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating sophisticated, refined emails.
 * Optimized for: Luxury brands, design agencies, premium services, high-end retail
 * 
 * Target Audience: High-net-worth individuals, design-conscious consumers, premium clientele
 * Goal: Convey exclusivity, quality, sophistication
 */

export const MinimalElegantDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'minimal-elegant',
  name: 'Minimal Elegant',
  description: 'Refined, sophisticated design with generous whitespace and understated luxury',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   */
  triggers: [
    // Luxury descriptors
    'luxury', 'premium', 'exclusive', 'sophisticated', 'elegant',
    'refined', 'curated', 'bespoke', 'artisan', 'handcrafted',
    
    // High-end retail
    'fashion', 'haute couture', 'designer', 'collection', 'limited edition',
    'fine jewelry', 'watches', 'timepiece', 'accessories',
    
    // Design/creative
    'design', 'architecture', 'interior', 'gallery', 'exhibition',
    'art', 'artist', 'creative', 'aesthetic', 'minimalist',
    
    // Premium services
    'concierge', 'private', 'VIP', 'members only', 'invitation only',
    'boutique', 'atelier', 'maison', 'house of',
    
    // Style descriptors
    'minimal', 'simple', 'clean', 'timeless',
    'classic', 'understated', 'subtle',
    
    // Occasions
    'showcase', 'presentation',
    'launch event', 'private viewing', 'trunk show',
    
    // High-end locations
    'Fifth Avenue', 'Rodeo Drive', 'Champs-Élysées', 'Ginza',
    'Milan', 'Paris', 'London', 'New York'
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['luxury minimal elegant black white', 'sophisticated design clean', 'premium fashion minimal'],
    feature: ['elegant minimal design', 'luxury product white background', 'sophisticated architecture clean'],
    product: ['luxury product elegant white', 'premium minimal black white', 'sophisticated product photography'],
    background: ['minimal elegant abstract', 'luxury pattern subtle', 'sophisticated monochrome'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# MINIMAL ELEGANT EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Less is more. Every element must earn its place. Sophistication through restraint.

This design system prioritizes:
- **Generous Whitespace**: 2-3x normal spacing, let content breathe
- **Refined Typography**: Serif fonts, precise sizing, elegant proportions
- **Monochromatic Palette**: Black, white, subtle grays, minimal gold accents
- **Center Alignment**: Formal, balanced, symmetrical layouts
- **Quality Over Quantity**: One powerful image beats five mediocre ones

**Target Audience**: Discerning consumers, design-conscious professionals, luxury clientele

**Goal**: Convey exclusivity, quality, timeless elegance

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
H1 (Main Headline - Refined Elegance)
├─ Size: 40-48px
├─ Weight: 300-400 (LIGHT, not bold!)
├─ Font: Serif (Georgia, "Times New Roman")
├─ Line Height: 1.3 (generous for elegance)
├─ Color: #000000 (pure black)
├─ Letter Spacing: 2px (subtle tracking)
├─ Text Align: center
├─ Margin: 0 0 32px 0 (generous spacing)
└─ Usage: Event names, product launches, collection titles

H2 (Section Headers)
├─ Size: 28-32px
├─ Weight: 300
├─ Font: Serif
├─ Line Height: 1.4
├─ Color: #1a1a1a
├─ Letter Spacing: 1.5px
├─ Text Align: center
├─ Margin: 48px 0 24px 0
└─ Usage: Section dividers, category names

H3 (Product Names / Sub-sections)
├─ Size: 20-24px
├─ Weight: 400
├─ Font: Serif
├─ Line Height: 1.5
├─ Color: #2d2d2d
├─ Letter Spacing: 0.5px
├─ Text Align: center OR left (product context)
├─ Margin: 32px 0 16px 0
└─ Usage: Product names, feature titles

Body Text (Descriptions)
├─ Size: 16-17px
├─ Weight: 300-400
├─ Font: Sans-serif (system fonts for readability)
├─ Line Height: 1.9-2.0 (VERY generous)
├─ Color: #4d4d4d (medium gray, softer than pure black)
├─ Text Align: center (default) OR left (long text)
├─ Max Width: 480px (narrow for elegance)
├─ Margin: 0 auto 24px (centered)
└─ Usage: Descriptions, event details, product info

Caption/Supporting Text
├─ Size: 13-14px
├─ Weight: 300
├─ Font: Sans-serif
├─ Line Height: 1.7
├─ Color: #808080 (light gray)
├─ Text Align: center
├─ Text Transform: UPPERCASE (for labels)
├─ Letter Spacing: 2px (for labels)
└─ Usage: Image captions, metadata, labels
\`\`\`

### Font Stack

**Headlines (Serif)**:
\`\`\`css
font-family: Georgia, 'Times New Roman', Times, serif;
\`\`\`

**Body (Sans-serif for readability)**:
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
\`\`\`

### Typography Rules

1. **Serif headlines ONLY**: Conveys timeless elegance
2. **Light weights preferred**: 300-400, never 700+
3. **Generous letter-spacing**: 1-2px on headlines
4. **Center everything**: Headlines, text blocks, images
5. **Narrow text blocks**: Max 480px width for sophistication
6. **Line height 1.9-2.0**: Let text breathe
7. **Uppercase sparingly**: Only for small labels
8. **NO bold text**: Use hierarchy through size, not weight

---

## 🎨 COLOR SYSTEM

### Primary Palette (MONOCHROMATIC)

\`\`\`
Black (Primary)
├─ Pure Black: #000000
├─ Near Black: #1a1a1a
├─ Dark Gray: #2d2d2d
└─ Usage: Headlines, important text, borders

White (Foundation)
├─ Pure White: #ffffff
├─ Off-White: #fafafa (sections)
├─ Light Gray: #f5f5f5 (subtle backgrounds)
└─ Usage: Main background, cards, sections

Gray Scale (Text & Borders)
├─ Medium Gray: #4d4d4d (body text)
├─ Light Gray: #808080 (supporting text)
├─ Very Light: #e0e0e0 (dividers, borders)
├─ Subtle: #f0f0f0 (section backgrounds)
└─ Usage: Text hierarchy, subtle divisions

Gold (MINIMAL Accent - Use Sparingly!)
├─ Muted Gold: #b8860b
├─ Lighter Gold: #d4af37
└─ Usage: ONLY for special elements (badges, premium indicators)
   Maximum: 1-2 elements per email
\`\`\`

### Color Usage Rules (CRITICAL)

1. **Monochromatic is the goal**: Black + White + Grays
2. **Gold ONLY for premium**: "VIP", "Exclusive", special badges
3. **No bright colors**: Ever. Period.
4. **Maximum 4 colors total**: Black + White + 2 grays
5. **Backgrounds**: White or very light gray (#fafafa max)
6. **Never use color for hierarchy**: Use size and spacing instead
7. **Borders**: 1px, very light gray (#e0e0e0)

---

## 📏 SPACING SYSTEM

**Base Unit**: 8px (but multiply by 2-3x for minimal aesthetic)

### Spacing Scale (MAXIMUM WHITESPACE)

\`\`\`
Hero Section
├─ Padding: 96-120px vertical (HUGE!)
├─ Headline to body: 32px
├─ Body to CTA: 48px
└─ Max width: 480px (centered, narrow)

Section Dividers
├─ Between major sections: 80-96px
├─ Before section header: 64px
├─ After section header: 40px
└─ Horizontal rule: 1px, very light gray

Product/Content Blocks
├─ Section padding: 64-80px vertical
├─ Image to caption: 16px
├─ Caption to product name: 24px
├─ Product name to description: 16px
├─ Description to price: 24px
└─ Between products: 64px minimum

Minimal Elements
├─ Content occupies 40-50% of vertical space
├─ Whitespace occupies 50-60%
├─ Horizontal padding: 48px minimum
└─ Every element gets generous room
\`\`\`

---

## 🔘 CTA (CALL-TO-ACTION) DESIGN

### Primary CTA - Understated Elegance

**Visual Specifications**:
\`\`\`css
/* MINIMAL, REFINED BUTTON */
background-color: transparent;
color: #000000;
font-size: 14px;
font-weight: 400;
text-transform: uppercase;
letter-spacing: 2px;
padding: 14px 40px;
border: 1px solid #000000;
border-radius: 0; /* Square, not rounded */
text-decoration: none;
display: inline-block;
text-align: center;
\`\`\`

**Alternative: Solid Black CTA**:
\`\`\`css
background-color: #000000;
color: #ffffff;
font-size: 14px;
font-weight: 400;
text-transform: uppercase;
letter-spacing: 2px;
padding: 14px 40px;
border-radius: 0;
\`\`\`

**CTA Text Examples**:
- **Products**: "VIEW COLLECTION", "INQUIRE", "DISCOVER"
- **Events**: "RSVP", "RESERVE", "REQUEST INVITATION"
- **Services**: "SCHEDULE CONSULTATION", "LEARN MORE"
- **Exclusive**: "REQUEST ACCESS", "JOIN WAITLIST"

### CTA RULES (CRITICAL)

1. **Minimalism is key**: Small, understated, refined
2. **Outlined preferred**: Transparent with border, not solid
3. **Square corners**: No border-radius (0px)
4. **Uppercase always**: With generous letter-spacing (2px)
5. **Small font size**: 12-14px maximum
6. **One CTA per section**: Never multiple competing CTAs
7. **Centered placement**: Always center-aligned
8. **Text must be specific**: "Inquire" > "Click Here"
9. **NO bold CTAs**: Regular weight (400) only
10. **NO colors**: Black on white, white on black, that's it

---

## 🖼️ IMAGE GUIDELINES

### Photography Style (CRITICAL)

**Aesthetic Requirements**:
- **Black & white preferred** OR very muted color
- High-contrast, artistic lighting
- Minimal composition
- Professional, editorial quality
- Generous negative space in images themselves

**Content Guidelines**:
- One subject, not multiple
- Clean backgrounds (white, gray, or minimal)
- No busy patterns or clutter
- Artistic, not commercial
- Quality over quantity (1-2 images max per email)

### Product Photography

**Specifications**:
- **Background**: Pure white (#ffffff)
- **Lighting**: Soft, even, professional
- **Framing**: Generous space around product
- **Aspect Ratio**: Square (1:1) or portrait (3:4)
- **Size**: 400-500px max width (never full-width)
- **Placement**: Centered

### Image Layout

**Single centered image** (preferred):
\`\`\`css
max-width: 400px;
display: block;
margin: 0 auto 16px;
\`\`\`

**With subtle border**:
\`\`\`css
border: 1px solid #e0e0e0;
padding: 20px; /* Matted frame effect */
background: #ffffff;
\`\`\`

### Image Accessibility

**Alt Text** (refined language):
- Describe composition and subject
- Example: "Handcrafted leather handbag in black, photographed against white background"
- Example: "Architectural detail of marble staircase with natural lighting"
- Length: 15-20 words, descriptive but concise

---

## ♿ ACCESSIBILITY REQUIREMENTS

**WCAG AA compliance** with luxury design considerations:

### Contrast Requirements

**Careful with light grays**:
- Medium gray (#4d4d4d) on white: 4.5:1 ✅
- Light gray (#808080) on white: 3.1:1 ⚠️ (use for captions only, not body)
- Gold (#b8860b) on white: 4.6:1 ✅

**Solutions**:
- Body text: #4d4d4d minimum
- Headlines: #000000 preferred
- Captions: #808080 OK (small text, non-critical)

---

## ⚠️ COMMON MISTAKES TO AVOID

### Minimal Design Mistakes

❌ **Not enough whitespace**
- If in doubt, add MORE space
- 96px vertical padding is not too much
- Let every element breathe

❌ **Too many elements**
- One image per section maximum
- One CTA per email maximum
- Remove anything non-essential

❌ **Using color**
- Black, white, grays only
- Gold 1-2 times MAX per email
- Color dilutes sophistication

❌ **Bold or heavy fonts**
- Light weights only (300-400)
- Never bold text
- Elegance through hierarchy, not weight

❌ **Rounded buttons**
- Square corners (border-radius: 0)
- Minimal aesthetic requires sharp edges
- Rounded = casual, square = refined

---

## 📝 GENERATION GUIDELINES

### Email Types & Structure

**1. Collection Launch**:
\`\`\`
Generous whitespace hero
↓
Collection name (serif, 48px)
↓
Brief description (centered, narrow)
↓
Single hero image (matted)
↓
"View Collection" (outlined CTA)
\`\`\`

**2. Event Invitation**:
\`\`\`
"You Are Invited" (small, spaced)
↓
Event name (large serif)
↓
Date/Time/Location (stacked, centered)
↓
Minimal divider line
↓
"RSVP" (outlined CTA)
\`\`\`

**3. Product Showcase**:
\`\`\`
Product image (matted, centered)
↓
Caption (small, uppercase, spaced)
↓
Product name (serif, 24px)
↓
Description (narrow, centered)
↓
Price
↓
"Inquire" (solid black CTA)
\`\`\`

### Generation Checklist

- [ ] Serif font for headlines
- [ ] Light font weights (300-400)
- [ ] Generous whitespace (96px+ in hero)
- [ ] Center-aligned layout
- [ ] Narrow text blocks (480px max)
- [ ] Monochromatic palette (black/white/gray)
- [ ] Maximum 1-2 gold accents
- [ ] One CTA maximum
- [ ] Square buttons (no rounding)
- [ ] Quality images (1-2 max)
- [ ] Line height 1.9-2.0 on body
- [ ] Letter-spacing on headlines

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
  Link
} from '@react-email/components';

/**
 * Minimal Elegant Email Example
 * Use Case: Luxury brand collection preview
 */
export default function LuxuryCollectionEmail() {
  return (
    <>
      {/* Hero Section - Maximum Whitespace */}
      <Section style={{
        padding: '120px 48px',
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }}>
        {/* Brand Logo */}
        <Img 
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=56&h=28&fit=crop"
          alt="Maison Élégante"
          style={{
            height: '28px',
            marginBottom: '80px',
            display: 'inline-block'
          }}
        />
        
        {/* Collection Name */}
        <Heading style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: '48px',
          fontWeight: '300',
          color: '#000000',
          lineHeight: '1.3',
          letterSpacing: '2px',
          margin: '0 auto 40px',
          maxWidth: '480px'
        }}>
          Spring Collection 2025
        </Heading>
        
        {/* Description */}
        <Text style={{
          fontFamily: '-apple-system, sans-serif',
          fontSize: '17px',
          fontWeight: '300',
          color: '#4d4d4d',
          lineHeight: '2.0',
          maxWidth: '420px',
          margin: '0 auto 56px',
          textAlign: 'center'
        }}>
          An exclusive preview of our latest collection. Each piece crafted
          with meticulous attention to detail, timeless elegance, and
          uncompromising quality.
        </Text>
        
        {/* CTA */}
        <Link
          href="https://example.com/collection"
          style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            color: '#000000',
            fontSize: '14px',
            fontWeight: '400',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            padding: '16px 48px',
            border: '1px solid #000000',
            textDecoration: 'none',
            borderRadius: '0'
          }}
        >
          VIEW COLLECTION
        </Link>
      </Section>

      {/* Divider */}
      <Section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{
          width: '200px',
          height: '1px',
          backgroundColor: '#e0e0e0',
          margin: '0 auto'
        }} />
      </Section>

      {/* Featured Product */}
      <Section style={{
        padding: '64px 48px',
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }}>
        {/* Exclusive Badge */}
        <div style={{
          display: 'inline-block',
          color: '#b8860b',
          fontSize: '14px',
          fontWeight: '400',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          border: '1px solid #b8860b',
          padding: '8px 20px',
          marginBottom: '40px'
        }}>
          Exclusive
        </div>
        
        {/* Product Image with Matted Frame */}
        <div style={{
          maxWidth: '420px',
          margin: '0 auto 32px',
          border: '1px solid #e0e0e0',
          padding: '40px',
          backgroundColor: '#ffffff'
        }}>
          <Img 
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=840&h=840&fit=crop"
            alt="Handcrafted Italian leather handbag in black, photographed against white background with soft natural lighting"
            style={{
              width: '100%',
              display: 'block'
            }}
          />
        </div>
        
        {/* Product Caption */}
        <Text style={{
          fontSize: '14px',
          color: '#808080',
          fontWeight: '300',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: '0 0 32px 0'
        }}>
          Handcrafted in Florence
        </Text>
        
        {/* Product Name */}
        <Heading style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#000000',
          letterSpacing: '0.5px',
          lineHeight: '1.4',
          margin: '0 0 24px 0'
        }}>
          The Signature Tote
        </Heading>
        
        {/* Description */}
        <Text style={{
          fontSize: '16px',
          fontWeight: '300',
          color: '#4d4d4d',
          lineHeight: '1.9',
          maxWidth: '400px',
          margin: '0 auto 32px',
          textAlign: 'center'
        }}>
          Full-grain Italian leather. Hand-stitched details. Timeless
          silhouette. A companion designed to age gracefully with you.
        </Text>
        
        {/* Price */}
        <Text style={{
          fontSize: '20px',
          fontWeight: '300',
          color: '#000000',
          letterSpacing: '1px',
          margin: '0 0 40px 0'
        }}>
          $3,200
        </Text>
        
        {/* CTA */}
        <Link
          href="https://example.com/product/signature-tote"
          style={{
            display: 'inline-block',
            backgroundColor: '#000000',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '400',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            padding: '16px 48px',
            textDecoration: 'none',
            borderRadius: '0'
          }}
        >
          INQUIRE
        </Link>
      </Section>

      {/* Event Invitation Section */}
      <Section style={{
        padding: '96px 48px',
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        {/* Invitation Label */}
        <Text style={{
          fontSize: '14px',
          fontWeight: '400',
          color: '#808080',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          margin: '0 0 56px 0'
        }}>
          You Are Invited
        </Text>
        
        {/* Event Name */}
        <Heading style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: '40px',
          fontWeight: '300',
          color: '#000000',
          lineHeight: '1.3',
          letterSpacing: '1px',
          margin: '0 0 48px 0'
        }}>
          Spring Preview Event
        </Heading>
        
        {/* Event Details */}
        <Text style={{
          fontSize: '16px',
          fontWeight: '300',
          color: '#4d4d4d',
          lineHeight: '2.0',
          margin: '0 0 12px 0'
        }}>
          Saturday, March 15, 2025
        </Text>
        
        <Text style={{
          fontSize: '16px',
          fontWeight: '300',
          color: '#4d4d4d',
          lineHeight: '2.0',
          margin: '0 0 12px 0'
        }}>
          2:00 PM - 6:00 PM
        </Text>
        
        <Text style={{
          fontSize: '16px',
          fontWeight: '300',
          color: '#4d4d4d',
          lineHeight: '2.0',
          margin: '0 0 56px 0'
        }}>
          Madison Avenue Atelier, New York
        </Text>
        
        {/* RSVP */}
        <Link
          href="https://example.com/rsvp"
          style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            color: '#000000',
            fontSize: '14px',
            fontWeight: '400',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            padding: '16px 48px',
            border: '1px solid #000000',
            textDecoration: 'none',
            borderRadius: '0'
          }}
        >
          RSVP
        </Link>
      </Section>

      {/* Footer - Minimal */}
      <Section style={{
        padding: '64px 48px 80px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Text style={{
          fontSize: '14px',
          color: '#808080',
          fontWeight: '300',
          letterSpacing: '1.5px',
          lineHeight: '2.0',
          margin: '0 0 16px 0'
        }}>
          MADISON AVENUE, NEW YORK
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#999999',
          fontWeight: '300',
          margin: 0
        }}>
          © 2025 Maison Élégante. All rights reserved.
        </Text>
      </Section>
    </>
  );
}`
};

